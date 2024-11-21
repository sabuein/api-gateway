const getToken = async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzE4Nzg0MDcsImV4cCI6MTczMTg4MDIwN30.GKc8axgonc1uiJFK1G8LqyeVSf8e4aErRPX2mO8BFMs",
        url = 'http://localhost:3000/v1/protected-route';

    try {
        const response = await fetch(url, { 
            method: 'GET',
            headers: new Headers({
                "Accept": "*/*",
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (data.success) {
            console.log(data);
            // set token in cookie
            document.cookie = `token=${token}`;
        }

    } catch (error) {
        console.error('Error fetching protected data:', error);
    }
};

// Function to fetch data and display result
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const resultElement = document.getElementById('result');

        // Check if success is true and display the appropriate message
        if (data.success) {
            resultElement.innerHTML = `<span>Success! Data:</span><code>${data.output}</code>`;
            return data;
        } else {
            resultElement.textContent = 'Failed to fetch the desired data.';
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').textContent = 'Error fetching data. Please try again later.';
    }
}

// The URL of your API endpoint
const apiUrl = 'http://localhost:3000/get-password';

// Call the function
fetchData(apiUrl);
getToken();