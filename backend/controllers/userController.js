const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/userModel');
dotenv.config();

async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { id: savedUser._id },
             process.env.JWT_SECRET_KEY,
              { expiresIn: "1h" });
        res.json({ token, userId: savedUser._id });
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).send("Server error!");
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error during fetching:", err.message);
        res.status(500).send("Server error!");
    }
}

async function getUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        const user = await User.findById(currentID);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error during fetching:", err.message);
        res.status(500).send("Server error!");
    }
}

async function updateUserProfile(req, res) {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        let updatedFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentID,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error during update:", err.message);
        res.status(500).send("Server error!");
    }
}

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(currentID);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json({ message: "User Profile Deleted!" });
    } catch (err) {
        console.error("Error during delete:", err.message);
        res.status(500).send("Server error!");
    }
}

module.exports = {
    signup,
    login,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
