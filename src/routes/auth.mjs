// /src/routes/auth.mjs
import express from "express";
import User from "../classes/User.mjs";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../middlewares/authentication.mjs";

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            role,
            status,
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password, firstName, lastName, role, status});
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

/*
router.post('/register', validate(userSchema), (req, res) => {
    res
        .status(200)
        .json({ success: true, message: "User registered successfully!" });
});
*/

/* sabuein "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzE4Nzg0MDcsImV4cCI6MTczMTg4MDIwN30.GKc8axgonc1uiJFK1G8LqyeVSf8e4aErRPX2mO8BFMs" */
router.post("/createNewUser", (req, res) => {
    console.log("HIIIIII");
    const token = generateAccessToken({ username: req.body.username });
    res
        .status(200)
        .json(token);
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, "", {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;