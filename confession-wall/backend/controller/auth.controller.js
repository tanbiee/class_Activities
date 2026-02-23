import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me";

// Register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google Sign-In. Please login with Google." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// Google OAuth login — verify token from Google Identity Services
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        const parts = credential.split(".");
        if (parts.length !== 3) {
            return res.status(400).json({ message: "Invalid Google credential" });
        }

        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ message: "Google account email not found" });
        }

        
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            
            let username = name?.replace(/\s+/g, "_").toLowerCase() || email.split("@")[0];
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                username = `${username}_${Date.now().toString(36).slice(-4)}`;
            }

            user = new User({
                username,
                email,
                googleId,
                password: null
            });
            await user.save();
        } else if (!user.googleId) {
            // Link Google to existing email account
            user.googleId = googleId;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Server error during Google login" });
    }
};
