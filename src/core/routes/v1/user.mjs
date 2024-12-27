"use strict";

// /src/routes/v1/serviceUserRoutes.mjs
import express from "express";
import {
  getUser,
  getUsers,
  createUser,
} from "../../controllers/serviceUserController.mjs";
import authorize from "../../middlewares/authorization.mjs";

const router = express.Router();

// existing users
const users = [
  {
    email: "sabuein@gmail.com",
  },
  {
    email: "abuein@msn.com",
  }
];

// employees data in a database
const employees = [
  { firstName: "Jane", lastName: "Smith", age: 20 },
  { firstName: "John", lastName: "Smith", age: 30 },
  { firstName: "Mary", lastName: "Green", age: 50 },
];

router
  .get("/", (req, res) => {
    // /employees?lastName=Smith&age=30
    const { firstName, lastName, age } = req.query;
    let results = [...employees];
    if (firstName) {
      results = results.filter((r) => r.firstName === firstName);
    }

    if (lastName) {
      results = results.filter((r) => r.lastName === lastName);
    }

    if (age) {
      results = results.filter((r) => +r.age === +age);
    }
    res.json(results);
  });

  router.post("/", (req, res) => {
    const { email } = req.body;
    const userExists = users.find((u) => u.email === email);
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    res.status(200).json({
      status: "Success",
      message: "Logged In User Information.",
      data: { user: { email: req.user.email }, body: req.body },
    });
  });

// Get data
router.get("/:userId", (req, res) => {
  try {
      res.status(200).json({
        success: true,
        message: "Logged In User Information.",
        user: req.user
      });} catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

router.get("/:userId/posts", (req, res) => {
  // Access userId via: req.params.userId
  res.send(req.params);
});

router.get("/:userId/posts/:postId", (req, res) => {
  // Access userId via: req.params.userId
  // Access bookId via: req.params.bookId
  res.send(req.params);
});


router.get("/profile", (req, res) => {
  const sessionId = req.cookies["session_id"];
  if (isValidSession(sessionId)) {
      res.send("Profile page");
  } else {
      res.status(401).send("Unauthorized");
  }
});

export default router;
