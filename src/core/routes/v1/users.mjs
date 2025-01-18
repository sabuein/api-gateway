"use strict";

// /src/routes/v1/serviceUserRoutes.mjs
import express from "express";
import {
    getUser,
    getUsers,
    createUser,
} from "../../controllers/serviceUserController.mjs";
import validate from "../../middlewares/validation.mjs";
import {
    userSchema,
    newUserSchema,
} from "../../validations/userValidation.mjs";

const router = express.Router();

// dummy database
const users = [
    {
        email: "sabuein@gmail.com",
    },
    {
        email: "abuein@msn.com",
    },
];

/** Get all users. */
router.get("/", (req, res) => {
    const { limit, skip, select, sortBy, order } = req.query;

    const users = {
        users: [
            {
                id: 1,
                firstName: "Emily",
                lastName: "Johnson",
                maidenName: "Smith",
                age: 28,
                gender: "female",
                email: "emily.johnson@x.dummyjson.com",
                phone: "+81 965-431-3024",
                username: "emilys",
                password: "emilyspass",
                birthDate: "1996-5-30",
                image: "...",
                bloodGroup: "O-",
                height: 193.24,
                weight: 63.16,
                eyeColor: "Green",
                hair: {
                    color: "Brown",
                    type: "Curly",
                },
                ip: "42.48.100.32",
                address: {
                    address: "626 Main Street",
                    city: "Phoenix",
                    state: "Mississippi",
                    stateCode: "MS",
                    postalCode: "29112",
                    coordinates: {
                        lat: -77.16213,
                        lng: -92.084824,
                    },
                    country: "United States",
                },
                macAddress: "47:fa:41:18:ec:eb",
                university: "University of Wisconsin--Madison",
                bank: {
                    cardExpire: "03/26",
                    cardNumber: "9289760655481815",
                    cardType: "Elo",
                    currency: "CNY",
                    iban: "YPUXISOBI7TTHPK2BR3HAIXL",
                },
                company: {
                    department: "Engineering",
                    name: "Dooley, Kozey and Cronin",
                    title: "Sales Manager",
                    address: {
                        address: "263 Tenth Street",
                        city: "San Francisco",
                        state: "Wisconsin",
                        stateCode: "WI",
                        postalCode: "37657",
                        coordinates: {
                            lat: 71.814525,
                            lng: -161.150263,
                        },
                        country: "United States",
                    },
                },
                ein: "977-175",
                ssn: "900-590-289",
                userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
                crypto: {
                    coin: "Bitcoin",
                    wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
                    network: "Ethereum (ERC20)",
                },
                role: "admin", // or "moderator", or "user"
            },
            // 30 items
        ],
        total: 208,
        skip: 0,
        limit: 30,
    };

    let results = [...users];
    if (limit) {
        results = results.filter((r) => r.firstName === firstName);
    }

    if (skip) {
        results = results.filter((r) => r.lastName === lastName);
    }

    if (select) {
        results = results.filter((r) => +r.age === +age);
    }

    if (sortBy) {
        results = results.filter((r) => +r.age === +age);
    }

    if (order) {
        results = results.filter((r) => +r.age === +age);
    }

    res.status(200).json(results);
});

router.get("/:from-:to", function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var names = users.map(function(user){ return user.name; });
    res.send('users ' + names.slice(from, to + 1).join(', '));
  });
  
/** Get a single user. */
router.get("/:userId", (req, res) => {
    const userId = req.params.userId;
    const user = {
        id: 1,
        firstName: "Emily",
        lastName: "Johnson",
        maidenName: "Smith",
        age: 28,
        gender: "female",
        email: "emily.johnson@x.dummyjson.com",
        phone: "+81 965-431-3024",
        username: "emilys",
        password: "emilyspass",
        birthDate: "1996-5-30",
        image: "...",
        bloodGroup: "O-",
        height: 193.24,
        weight: 63.16,
        eyeColor: "Green",
        hair: {
            color: "Brown",
            type: "Curly",
        },
        ip: "42.48.100.32",
        address: {
            address: "626 Main Street",
            city: "Phoenix",
            state: "Mississippi",
            stateCode: "MS",
            postalCode: "29112",
            coordinates: {
                lat: -77.16213,
                lng: -92.084824,
            },
            country: "United States",
        },
        macAddress: "47:fa:41:18:ec:eb",
        university: "University of Wisconsin--Madison",
        bank: {
            cardExpire: "03/26",
            cardNumber: "9289760655481815",
            cardType: "Elo",
            currency: "CNY",
            iban: "YPUXISOBI7TTHPK2BR3HAIXL",
        },
        company: {
            department: "Engineering",
            name: "Dooley, Kozey and Cronin",
            title: "Sales Manager",
            address: {
                address: "263 Tenth Street",
                city: "San Francisco",
                state: "Wisconsin",
                stateCode: "WI",
                postalCode: "37657",
                coordinates: {
                    lat: 71.814525,
                    lng: -161.150263,
                },
                country: "United States",
            },
        },
        ein: "977-175",
        ssn: "900-590-289",
        userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
        crypto: {
            coin: "Bitcoin",
            wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
            network: "Ethereum (ERC20)",
        },
        role: "admin", // or "moderator", or "user"
    };

    res.status(200).json(user);
});

/** Search users. */
router.get("/search", (req, res) => {
    const searchTerm = req.query.q;
    // Process search term
    const users = {
        users: [
            {
                id: 50,
                firstName: "Emily",
                lastName: "Johnson", // name matched the search query
                /* rest user data */
            },
            // 3 items
        ],
        total: 3,
        skip: 0,
        limit: 3,
    };
    res.status(200).json(users);
});

/** Get user's posts by user id. */
router.get("/:userId/posts", (req, res) => {
    const userId = req.params.userId;
    const posts = {
        posts: [
            {
                id: 61,
                title: "I'm going to hire professional help tomorrow.",
                body: "I'm going to hire professional help tomorrow. /*... more data */  ",
                userId: 5, // user id is 5
                tags: ["fiction", "classic", "american"],
                reactions: {
                    likes: 1127,
                    dislikes: 40,
                },
            },
        ],
        total: 2,
        skip: 0,
        limit: 2,
    };
    res.status(200).json(posts);
});

/** Add a new user. */
router.post("/add", validate(newUserSchema), (req, res) => {
    const user = {
        id: 209,
        firstName: "Muhammad",
        lastName: "Ovi",
        age: 250,
        /* rest user data */
    };
    res.status(200).json(user);
});

/** Update a user. */
router.put("/:userId", (req, res) => {
    // OR PATCH
    const userId = req.params.userId;
    const user = {
        id: "2",
        firstName: "Michael",
        lastName: "Owais", // only lastName is updated
        gender: "male",
        /* other user data */
    };
    res.status(200).json(user);
});

/** Delete a user. */
router.delete("/:userId", (req, res) => {
    const userId = req.params.userId;
    const user = {
        id: 1,
        firstName: "Emily",
        lastName: "Johnson",
        maidenName: "Smith",
        age: 28,
        gender: "female",

        /* other user data */

        isDeleted: true,
        deletedOn: "" /* ISOTime */,
    };
    res.status(200).json(user);
});

export default router;