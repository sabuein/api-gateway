"use strict";

/* TODO:

1. Private Messaging: Allow residents of a city/village to communicate privately.
2. Gamification: Introduce badges or achievements for active users.
3. Analytics Dashboard: Show population stats for each location.
4. Mobile App: Extend the PWA to a native app using frameworks like React Native or Flutter.

POST /users/signup

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword"
}

callback({
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "visitor"
  }
});


POST /users/login

{
  "email": "john@example.com",
  "password": "securepassword"
}

callback({
  "message": "Login successful",
  "token": "jwt-token-here"
});

GET /users/profile

Authorization: Bearer <JWT-TOKEN>

callback({
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "visitor",
  "location": {
    "id": 10,
    "name": "Smallville",
    "type": "village"
  }
});

GET /locations

callback([
  {
    "id": 1,
    "name": "Default Country",
    "type": "country",
    "children": [
      {
        "id": 2,
        "name": "District A",
        "type": "district",
        "children": [
          {
            "id": 5,
            "name": "City X",
            "type": "city",
            "children": [
              {
                "id": 10,
                "name": "Smallville",
                "type": "village"
              }
            ]
          }
        ]
      }
    ]
  }
]);

GET /locations/:id

callback({
  "id": 10,
  "name": "Smallville",
  "type": "village",
  "description": "A peaceful village in District A.",
  "parent": {
    "id": 5,
    "name": "City X",
    "type": "city"
  }
});

POST /locations/:id/relocate

Authorization: Bearer <JWT-TOKEN>

{
  "reason": "I want to return to my homeland."
}

callback({
  "message": "Relocation request submitted successfully",
  "request": {
    "id": 101,
    "user_id": 1,
    "location_id": 10,
    "status": "pending"
  }
});


*/