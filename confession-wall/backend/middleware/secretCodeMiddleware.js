import Confession from '../models/confession.js';

// Middleware to validate secret code for update/delete operations
export const validateSecretCode = async (req, res, next) => {
    const { id } = req.params;
    const { secretCode } = req.body;

    if (!secretCode) {
        return res.status(400).json({ 
            message: "Secret code is required" 
        });
    }

    if (secretCode.length < 4) {
        return res.status(400).json({ 
            message: "Secret code must be at least 4 characters" 
        });
    }

    try {
        const confession = await Confession.findById(id);
        
        if (!confession) {
            return res.status(404).json({ 
                message: "Confession not found" 
            });
        }

        if (confession.secretCode !== secretCode) {
            return res.status(403).json({ 
                message: "Invalid secret code. Access denied" 
            });
        }

        req.confession = confession;
        next();
    } catch (err) {
        res.status(500).json({ 
            message: "Error validating secret code", 
            error: err.message 
        });
    }
};
