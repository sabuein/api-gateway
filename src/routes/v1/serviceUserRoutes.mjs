// /src/routes/v1/serviceUserRoutes.mjs
import express from "express";
import {
  getUser,
  getUsers,
  createUser,
} from "../../controllers/serviceUserController.mjs";

const router = express.Router();

// existing users
const users = [
  {
    email: "sabuein@gmail.com",
  },
];

// employees data in a database
const employees = [
  { firstName: "Jane", lastName: "Smith", age: 20 },
  { firstName: "John", lastName: "Smith", age: 30 },
  { firstName: "Mary", lastName: "Green", age: 50 },
];

// Get User Data
router
  .get("/:id", getUser, (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Logged In User Information.",
      data: {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
        },
      },
    });
  })
  .post("/:id", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Logged In User Information.",
      data: {
        user: {
          email: req.user.email,
        },
      },
    });
  });

router
  .get("/", getUsers, (req, res) => {
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
  })
  .post("/", createUser, (req, res) => {
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

export default router;
