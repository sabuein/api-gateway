"use strict";

import { getLocationAsync } from "./web.js";

const apiKeyTomTom = "WpC8jDXAcKKEduy6CGB1slFg8L7m7N1R";
const centerCoords = {
    lat: 31.898043,
    lng: 35.204269,
};

const locationData = [
    {
        id: "Unified",
        center: [35.19931638893172, 31.597761546944213],
        zoom: 3,
    },

    {
        id: "IN",
        center: [78, 24],
        zoom: 3,
    },
    {
        id: "IL",
        center: [34.8, 31],
        zoom: 7,
    },
    {
        id: "MA",
        center: [-6.356618, 31.880916],
        zoom: 3,
    },
    {
        id: "PA",
        center: [69.306735, 29.759973],
        zoom: 3,
    },
    {
        id: "AR",
        center: [-68.361007, -42.426041],
        zoom: 2,
    },
    {
        id: "Arabic",
        center: [51.744665, 25.790791],
        zoom: 5,
    },
    {
        id: "RU",
        center: [33.988533, 45.488992],
        zoom: 7,
    },
    {
        id: "TR",
        center: [33.254136, 35.115268],
        zoom: 7,
    },
];
const companyAssets = [
    {
        lat: 52.373627,
        lng: 4.902642,
    },
    {
        lat: 52.3659,
        lng: 4.927198,
    },
    {
        lat: 52.347878,
        lng: 4.893488,
    },
    {
        lat: 52.349447,
        lng: 4.858433,
    },
];

const popupOffsets = {
    top: [0, 0],
    bottom: [0, -70],
    "bottom-right": [0, -70],
    "bottom-left": [0, -70],
    left: [25, -35],
    right: [-25, -35],
};
// Name of your product (e.g., com.company-name.product-name).
// The version of your product.
// tt.setProductInfo("<your-product-name>", "<your-product-version>")
const renderTomTomMap = (containerId) => {
    window.isMobileOrTablet = window.isMobileOrTablet || isMobileOrTablet;
    const myMap = tt.map({
        key: apiKeyTomTom,
        container: containerId,
        dragPan: !isMobileOrTablet(),
        source: "vector",
        basePath: "/sdk",
        language: "en-GB",
        zoom: 6,
        style: "https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAaWp4Q0hjMXNNZGI5aUZRUjszZTc4ZGI2Yi1jYjVhLTRkZWUtOTFmYy04N2JmODE1MTZhNjA=.json",
        // style: 'https://api.tomtom.com/style/1/style/20.4.5-*/?map=basic_night&poi=poi_main', // Dark mode
        center: locationData[0].center,
        geopoliticalView: locationData[0].id,
    });
    myMap.addControl(new tt.FullscreenControl());
    myMap.addControl(new tt.NavigationControl());
    // var mymap = tt.map('mapid').setView([51.505, -0.09], 13);
    // var marker = tt.marker([51.5, -0.09]).addTo(myMap);

    const markerElement = document.createElement("div");
    markerElement.innerHTML = "";
    const marker = new tt.Marker({
        draggable: true,
        element: markerElement,
    })
        .setLngLat(centerCoords)
        .addTo(myMap);

    const popup = new tt.Popup({
        anchor: "top",
        offset: popupOffsets,
    }).setText("Ramallah");
    marker.setPopup(popup).togglePopup();

    loadMultipleCoordinates(companyAssets, myMap);
};

// Loading multiple coordinates at once
const loadMultipleCoordinates = (coordinates, map) => {
    coordinates.forEach(function (child) {
        new tt.Marker().setLngLat(child).addTo(map);
    });
};

function isMobileOrTablet() {
    var i,
        a = !1;
    return (
        (i = navigator.userAgent || navigator.vendor || window.opera),
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            i
        ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                i.substr(0, 4)
            )) &&
            (a = !0),
        a
    );
}

const xoxo = () => {
    const AbujaZone = [
        {
            Address: "HQ",
            Coordinate: [9.0548, 7.4856],
        },
        {
            Address: "SUB HQ",
            Coordinate: [9.06, 7.4899],
        },
        {
            Address: "ABUJA A",
            Coordinate: [9.0509, 7.4931],
        },
        {
            Address: "ABUJA B",
            Coordinate: [9.046, 7.4873],
        },
        {
            Address: "ABUJA C",
            Coordinate: [9.053, 7.4793],
        },
        {
            Address: "NEW CONSTRUCTION",
            Coordinate: [9.065, 7.4924],
        },
        {
            Address: "ABUJA E",
            Coordinate: [9.065, 7.4734],
        },
    ];

    AbujaZone.forEach(function (child) {
        new tt.Marker().setLngLat(child.Coordinate).addTo(myMap);
    });

    function createMarker(icon, position, color, popupText) {
        var markerElement = document.createElement("div");
        markerElement.className = "marker";

        var markerContentElement = document.createElement("div");
        markerContentElement.className = "marker-content";
        markerContentElement.style.backgroundColor = color;
        markerElement.appendChild(markerContentElement);

        var iconElement = document.createElement("div");
        iconElement.className = "marker-icon";
        iconElement.style.backgroundImage =
            "url(../assets/images/custom-markers/" + icon + ")";
        markerContentElement.appendChild(iconElement);

        var popup = new tt.Popup({
            offset: 30,
        }).setText(popupText);
        // add marker to map
        new tt.Marker({
            element: markerElement,
            anchor: "bottom",
        })
            .setLngLat(position)
            .setPopup(popup)
            .addTo(myMap);
    }
};

// Get the address where you are right now
const getCurrentAddress = () => {
    return new Promise((resolve, reject) => {
        getLocation((position) => {
            const coords = position.coords;
            tt.services
                .reverseGeocode({
                    key: apiKeyTomTom,
                    position: new tt.LngLat(coords.longitude, coords.latitude),
                })
                .go()
                .then(currentAddressCallback)
                .catch(reject);
        });
    });
};

const currentAddressCallback = (result) => {
    const firstResult = response.addresses[0];
    const address = firstResult.address.freeformAddress;
    // Copy the address to the clipboard
    navigator.clipboard.writeText(address);
};

async function getScreenShot(zoom) {
    try {
        const position = await getLocationAsync();
        const coords = position.coords;

        console.log("position", position);
        console.log("coords", coords);

        const url = await tt.services
            .staticImage({
                key: apiKeyTomTom,
                zoom: zoom,
                center: new tt.LngLat(coords.longitude, coords.latitude),
                width: 500,
                height: 500,
            })
            .go();

        return url; // Return the static image URL
    } catch (error) {
        console.error("Error in getScreenShot:", error);
        throw error; // Propagate the error to the caller
    }
}

export { renderTomTomMap, getScreenShot };