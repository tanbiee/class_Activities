import Confession from '../models/confession.js';

// GET all confessions
export const getConfession = async (req, res) => {
    try {
        const data = await Confession.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: data,
            message: "Confessions retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error in retrieving data",
            error: err.message
        });
    }
};

// GET single confession by ID
export const getConfessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await Confession.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Confession not found"
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error retrieving confession",
            error: err.message
        });
    }
};

// POST new confession
export const postConfession = async (req, res) => {
    try {
        const { text, secretCode, userId, vibe, isAnonymous } = req.body;

        // Validate required fields
        if (!text || !secretCode) {
            return res.status(400).json({
                success: false,
                message: "Text and secret code are required"
            });
        }

        if (secretCode.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Secret code must be at least 4 characters"
            });
        }

        // Always save the real userId for ownership tracking
        // isAnonymous only controls whether username is displayed publicly
        const newConfession = await Confession.create({
            text,
            secretCode,
            userId: userId || "anonymous",
            vibe: vibe || "secret",
            isAnonymous: isAnonymous !== false  // default to true
        });

        res.status(201).json({
            success: true,
            message: "Confession posted successfully",
            data: newConfession
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error in creating post",
            error: err.message
        });
    }
};

// ADD comment to confession
export const addComment = async (req, res) => {
    const { id } = req.params;
    const { text, userId, username } = req.body;

    try {
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const confession = await Confession.findById(id);
        if (!confession) {
            return res.status(404).json({ success: false, message: "Confession not found" });
        }

        const comment = {
            userId: userId || "anonymous",
            username: username || "Shadow",
            text: text.trim(),
            createdAt: new Date()
        };

        confession.comments.push(comment);
        await confession.save();

        res.status(201).json({
            success: true,
            message: "Comment added",
            data: confession
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding comment", error: err.message });
    }
};

// UPDATE confession (with secret code validation)
export const updateConfession = async (req, res) => {
    const { id } = req.params;
    const { text, secretCode } = req.body;

    try {
        const confession = await Confession.findById(id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: "Confession not found"
            });
        }

        // Check ownership via JWT user ID
        const isOwner = req.user && req.user.id.toString() === confession.userId.toString();

        // Non-owners must provide a valid secret code
        if (!isOwner) {
            if (!secretCode) {
                return res.status(400).json({ success: false, message: "Secret code is required" });
            }
            if (confession.secretCode !== secretCode) {
                return res.status(403).json({ success: false, message: "Invalid secret code. Access denied" });
            }
        }

        let updateData = { updatedAt: new Date() };
        if (text) updateData.text = text;

        const updatedConfession = await Confession.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Confession updated successfully",
            data: updatedConfession
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating confession",
            error: err.message
        });
    }
};

// DELETE confession (with secret code validation)
export const deleteConfession = async (req, res) => {
    const { id } = req.params;
    const { secretCode } = req.body;

    try {
        const confession = await Confession.findById(id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: "Confession not found"
            });
        }

        // Check ownership via JWT user ID
        const isOwner = req.user && req.user.id.toString() === confession.userId.toString();

        // Non-owners must provide a valid secret code
        if (!isOwner) {
            if (!secretCode) {
                return res.status(400).json({ success: false, message: "Secret code is required" });
            }
            if (confession.secretCode !== secretCode) {
                return res.status(403).json({ success: false, message: "Invalid secret code. Access denied" });
            }
        }

        const deletedConfession = await Confession.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Confession deleted successfully",
            data: deletedConfession
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting confession",
            error: err.message
        });
    }
};

// ADD/UPDATE reaction
export const addReaction = async (req, res) => {
    const { id } = req.params;
    const { reactionType, userId } = req.body;

    try {
        if (!reactionType || !['like', 'love', 'laugh'].includes(reactionType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reaction type. Use: like, love, or laugh"
            });
        }

        const confession = await Confession.findById(id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: "Confession not found"
            });
        }

        const userIdToUse = userId || `anonymous-${Date.now()}`;

        // Check if user already reacted
        const existingReaction = confession.userReactions.find(
            r => r.userId === userIdToUse
        );

        if (existingReaction) {
            // Remove old reaction
            confession.reactions[existingReaction.reactionType]--;

            if (existingReaction.reactionType === reactionType) {
                // Toggle off
                confession.userReactions = confession.userReactions.filter(
                    r => r.userId !== userIdToUse
                );
                await confession.save();
                return res.status(200).json({
                    success: true,
                    message: "Reaction removed",
                    data: confession
                });
            }

            existingReaction.reactionType = reactionType;
        } else {
            // Add new reaction
            confession.userReactions.push({
                userId: userIdToUse,
                reactionType
            });
        }

        // Increment new reaction count
        confession.reactions[reactionType]++;
        confession.updatedAt = new Date();

        const updatedConfession = await confession.save();

        res.status(200).json({
            success: true,
            message: "Reaction added successfully",
            data: updatedConfession
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error adding reaction",
            error: err.message
        });
    }
};

// GET confession stats
export const getConfessionStats = async (req, res) => {
    try {
        const totalConfessions = await Confession.countDocuments();

        const reactionAggregation = await Confession.aggregate([
            {
                $project: {
                    totalReactionsPerDoc: {
                        $add: [
                            { $ifNull: ["$reactions.like", 0] },
                            { $ifNull: ["$reactions.love", 0] },
                            { $ifNull: ["$reactions.laugh", 0] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalReactions: { $sum: "$totalReactionsPerDoc" }
                }
            }
        ]);

        const totalReactions = reactionAggregation[0]?.totalReactions || 0;

        const averageReactions =
            totalConfessions > 0
                ? (totalReactions / totalConfessions).toFixed(2)
                : 0;

        res.status(200).json({
            success: true,
            totalConfessions,
            totalReactions,
            averageReactions
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error in fetching stats",
            error: err.message
        });
    }
};
