import express from "express";
import {
    deleteConfession,
    getConfession,
    getConfessionById,
    getConfessionStats,
    postConfession,
    updateConfession,
    addReaction,
    addComment
} from "../controller/user.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply verifyToken to all routes to populate req.user if token exists
router.use(verifyToken);

// GET routes
router.get('/confessions', getConfession);
router.get('/confessions/:id', getConfessionById);
router.get('/confessions/stats/overview', getConfessionStats);

// POST routes
router.post('/confessions', postConfession);
router.post('/confessions/:id/react', addReaction);
router.post('/confessions/:id/comment', addComment);

// PUT routes
router.put('/confessions/:id', updateConfession);

// DELETE routes
router.delete('/confessions/:id', deleteConfession);

export default router;