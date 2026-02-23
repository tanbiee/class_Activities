import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    secretCode: {
        type: String,
        required: true,
        minlength: 4
    },
    vibe: {
        type: String,
        enum: ['crush', 'study', 'funny', 'secret'],
        default: 'secret'
    },
    reactions: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        laugh: { type: Number, default: 0 }
    },
    comments: [{
        userId: { type: String, default: "anonymous" },
        username: { type: String, default: "Anon" },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        default: "anonymous"
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    userReactions: [{
        userId: String,
        reactionType: String
    }]
});

const Confession = mongoose.model("Confession", confessionSchema);
export default Confession;