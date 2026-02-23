import { useState } from "react";
import { FaHeart, FaComment, FaEdit, FaTrash, FaKey, FaPaperPlane, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useConfession } from "../../contexts/ConfessionContext";
import { useAuth } from "../../contexts/AuthContext";

const ConfessionCard = ({ confession }) => {
  const { addReaction, updateConfessed, deleteConfessed, addComment } = useConfession();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(confession.text);
  const [secretCode, setSecretCode] = useState("");
  const [storedCode, setStoredCode] = useState("");
  const [showSecretPrompt, setShowSecretPrompt] = useState(false);
  const [action, setAction] = useState(null);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const isOwner = user && user.id === confession.userId;

  const vibeMap = {
    crush: { emoji: "❤️", label: "Crush", bg: "rgba(220,38,38,0.12)", color: "#f87171", border: "rgba(220,38,38,0.2)" },
    study: { emoji: "📚", label: "Study Stress", bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "rgba(168,85,247,0.2)" },
    funny: { emoji: "😂", label: "Funny", bg: "rgba(234,179,8,0.12)", color: "#facc15", border: "rgba(234,179,8,0.2)" },
    secret: { emoji: "🤐", label: "Secret", bg: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "rgba(99,102,241,0.2)" },
  };
  const vibe = vibeMap[confession.vibe] || vibeMap.secret;

  const handleReaction = async (type) => {
    try { await addReaction(confession._id, type, user ? user.id : "anonymous"); }
    catch (err) { setError(err.response?.data?.message || "Reaction failed"); setTimeout(() => setError(""), 3000); }
  };
  const handleEdit = () => {
    setError(""); setEditText(confession.text);
    if (isOwner) { setStoredCode("owner-bypass"); setIsEditing(true); }
    else { setAction("edit"); setShowSecretPrompt(true); }
  };
  const handleDelete = () => { setError(""); setAction("delete"); setShowSecretPrompt(true); };
  const handleSecretConfirm = async () => {
    try {
      setError("");
      const code = isOwner ? "owner-bypass" : secretCode;
      if (!isOwner && !code) { setError("Enter secret code"); return; }
      if (action === "delete") { await deleteConfessed(confession._id, code); setShowSecretPrompt(false); setSecretCode(""); }
      else if (action === "edit") { setStoredCode(code); setShowSecretPrompt(false); setSecretCode(""); setIsEditing(true); }
    } catch (err) { setError(err.response?.data?.message || "Action failed. Check your secret code."); }
  };
  const handleSaveEdit = async () => {
    try { setError(""); await updateConfessed(confession._id, editText, storedCode); setIsEditing(false); setStoredCode(""); }
    catch (err) { setError(err.response?.data?.message || "Failed to save. Check your secret code."); }
  };
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try { await addComment(confession._id, commentText.trim(), user ? user.id : "anonymous", user ? user.username : "Anon"); setCommentText(""); }
    catch (err) { setError("Comment failed"); setTimeout(() => setError(""), 3000); }
    finally { setCommentLoading(false); }
  };
  const timeAgo = (d) => { const diff = Date.now() - new Date(d).getTime(); const m = Math.floor(diff / 60000); if (m < 1) return "Just now"; if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  const likes = confession.reactions?.like || 0;
  const loves = confession.reactions?.love || 0;
  const laughs = confession.reactions?.laugh || 0;
  const commentCount = confession.comments?.length || 0;
  const displayAnonymous = confession.isAnonymous !== false;
  const anonLabel = displayAnonymous ? `👻 Anon #${confession._id.slice(-4).toUpperCase()}` : `👤 ${confession.userId === user?.id ? "You" : "User"}`;

  const glass = "rgba(255,255,255,0.04)";
  const glassBorder = "rgba(255,255,255,0.06)";

  const reactionBtn = (onClick, emoji, count) => (
    <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 8px", borderRadius: 8 }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
      {emoji} <span style={{ fontWeight: 700, color: "#94a3b8", fontSize: 12 }}>{count}</span>
    </button>
  );

  return (
    <div style={{ backgroundColor: glass, borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.2)", border: `1px solid ${glassBorder}`, borderTop: `2px solid ${vibe.border}`, position: "relative", transition: "box-shadow 0.3s, transform 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(168,85,247,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, backgroundColor: vibe.bg, color: vibe.color, border: `1px solid ${vibe.border}` }}>
            <span>{vibe.emoji}</span> {vibe.label}
          </span>
          {isOwner && <span style={{ padding: "3px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, backgroundColor: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>✦ Yours</span>}
        </div>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{timeAgo(confession.createdAt)}</span>
      </div>

      {/* Body */}
      {isEditing ? (
        <div style={{ marginBottom: 16 }}>
          <textarea value={editText} onChange={e => setEditText(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "2px solid rgba(168,85,247,0.4)", fontSize: 14, resize: "none", minHeight: 80, outline: "none", fontFamily: "inherit", backgroundColor: "rgba(255,255,255,0.06)", color: "#f1f5f9" }} autoFocus />
          {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, marginTop: 8, border: "1px solid rgba(239,68,68,0.2)" }}>⚠️ {error}</div>}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
            <button onClick={() => { setIsEditing(false); setError(""); setStoredCode(""); }} style={{ padding: "8px 18px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: glass, fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#94a3b8" }}>Cancel</button>
            <button onClick={handleSaveEdit} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#a855f7,#6366f1)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
          </div>
        </div>
      ) : <p style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}>{confession.text}</p>}

      {error && !isEditing && !showSecretPrompt && <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, marginBottom: 12, border: "1px solid rgba(239,68,68,0.2)" }}>⚠️ {error}</div>}

      {/* Secret code overlay */}
      {showSecretPrompt && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,15,30,0.97)", backdropFilter: "blur(8px)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 10 }}>
          <FaKey style={{ fontSize: 24, color: action === "delete" ? "#ef4444" : "#a855f7", marginBottom: 12 }} />
          <p style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 4 }}>{isOwner ? `${action === "delete" ? "Delete" : "Edit"} your confession?` : `Enter secret code to ${action}`}</p>
          <p style={{ fontSize: 11, color: "#64748b", marginBottom: 14, textAlign: "center" }}>{isOwner ? "You are the owner of this post." : "You need the secret code used when posting."}</p>
          {!isOwner && <input type="password" value={secretCode} onChange={e => { setSecretCode(e.target.value); setError(""); }} placeholder="Enter secret code..." style={{ padding: "10px 16px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.1)", fontSize: 14, marginBottom: 10, width: "80%", textAlign: "center", outline: "none", fontFamily: "inherit", backgroundColor: "rgba(255,255,255,0.06)", color: "#f1f5f9" }} onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} onKeyDown={e => { if (e.key === "Enter") handleSecretConfirm(); }} autoFocus />}
          {error && <div style={{ color: "#f87171", fontSize: 12, fontWeight: 600, marginBottom: 10, textAlign: "center", padding: "8px 14px", background: "rgba(239,68,68,0.1)", borderRadius: 8, width: "80%", border: "1px solid rgba(239,68,68,0.2)" }}>⚠️ {error}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSecretConfirm} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: action === "delete" ? "#ef4444" : "linear-gradient(135deg,#a855f7,#6366f1)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{action === "delete" ? "🗑 Delete" : "✏️ Edit"}</button>
            <button onClick={() => { setShowSecretPrompt(false); setSecretCode(""); setError(""); }} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: glass, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#94a3b8" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isEditing && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${glassBorder}`, paddingTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{anonLabel}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {reactionBtn(() => handleReaction("love"), "❤️", loves)}
            {reactionBtn(() => handleReaction("laugh"), "😂", laughs)}
            {reactionBtn(() => handleReaction("like"), "👍", likes)}
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            <button onClick={() => setShowComments(!showComments)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, padding: "4px 8px", borderRadius: 8, color: showComments ? "#a855f7" : "#64748b" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
              <FaComment /> <span style={{ fontWeight: 700, fontSize: 12 }}>{commentCount}</span>
              {showComments ? <FaChevronUp style={{ fontSize: 10 }} /> : <FaChevronDown style={{ fontSize: 10 }} />}
            </button>
            <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            <button onClick={handleEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13, padding: 4 }} title="Edit" onMouseEnter={e => e.currentTarget.style.color = "#a855f7"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}><FaEdit /></button>
            <button onClick={handleDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13, padding: 4 }} title="Delete" onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#64748b"}><FaTrash /></button>
          </div>
        </div>
      )}

      {/* Comments */}
      {showComments && !isEditing && (
        <div style={{ marginTop: 16, borderTop: `1px solid ${glassBorder}`, paddingTop: 16 }}>
          {confession.comments?.length > 0 ? (
            <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
              {confession.comments.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "8px 0" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c084fc", flexShrink: 0 }}>{(c.username || "A").charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: "#cbd5e1" }}>{c.username || "Anon"}</span>
                      <span style={{ fontSize: 10, color: "#475569" }}>{timeAgo(c.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p style={{ fontSize: 12, color: "#475569", marginBottom: 12, textAlign: "center" }}>No comments yet. Be the first!</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${glassBorder}`, fontSize: 13, outline: "none", backgroundColor: "rgba(255,255,255,0.05)", color: "#f1f5f9" }} onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.3)"} onBlur={e => e.target.style.borderColor = glassBorder} onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }} />
            <button onClick={handleAddComment} disabled={commentLoading || !commentText.trim()} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: commentText.trim() ? "linear-gradient(135deg,#a855f7,#6366f1)" : "rgba(255,255,255,0.06)", color: commentText.trim() ? "#fff" : "#475569", cursor: commentText.trim() ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
              <FaPaperPlane style={{ fontSize: 11 }} /> {commentLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfessionCard;
