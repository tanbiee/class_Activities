import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_change_me");
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        req.user = null; // Invalid token -> treat as anonymous
        next();
    }
};

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    next();
};
