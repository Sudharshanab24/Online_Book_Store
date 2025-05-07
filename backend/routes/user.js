const router = require("express").Router();
const mongoose=require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
require("dotenv").config();

// Sign-Up Route
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        if (username.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashPass,
            address,
        });

        await newUser.save();
        return res.status(201).json({ message: "Sign-up successful" });

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign-In Route
router.post("/sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const authClaims = {
            id: existingUser._id,
            role: existingUser.role,
        };

        const token = jwt.sign(authClaims, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            token,
        });

    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Get User Information Route
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user information:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { address } = req.body;

        // Validate Address
        if (!address || address.trim() === "") {
            return res.status(400).json({ message: "Address cannot be empty" });
        }

        // Update User Address
        const updatedUser = await User.findByIdAndUpdate(userId, { address }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Address updated successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
