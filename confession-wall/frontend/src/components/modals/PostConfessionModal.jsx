import { useState } from "react";
import { FaTimes, FaPaperPlane, FaKey, FaUserSecret, FaUser } from "react-icons/fa";
import { useConfession } from "../../contexts/ConfessionContext";
import { useAuth } from "../../contexts/AuthContext";

const PostConfessionModal = ({ isOpen, onClose }) => {
  const { postConfession } = useConfession();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [vibe, setVibe] = useState("secret");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const vibes = [
    { id: "crush", label: "Crush", emoji: "❤️" },
    { id: "study", label: "Study", emoji: "📚" },
    { id: "funny", label: "Funny", emoji: "😂" },
    { id: "secret", label: "Secret", emoji: "🤐" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) { setError("Write your confession"); return; }
    if (!secretCode || secretCode.length < 4) { setError("Secret code must be ≥ 4 characters"); return; }
    setLoading(true);
    try {
      const uid = user ? user.id : "anonymous";
      await postConfession(text, secretCode, uid, vibe, isAnonymous);
      setText(""); setSecretCode(""); setVibe("secret"); onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error posting");
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const glass = "rgba(255,255,255,0.04)";
  const glassBorder = "rgba(255,255,255,0.06)";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,15,30,0.7)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "rgba(20,20,40,0.98)", borderRadius: 24, maxWidth: 520, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.08)", maxHeight: "90vh", overflowY: "auto", border: `1px solid ${glassBorder}` }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", borderBottom: `1px solid ${glassBorder}` }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>Share a Secret</h2>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 2 }}>What's on your mind?</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#64748b", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => e.currentTarget.style.color = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748b"}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 28px" }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="I'm feeling..." maxLength={500} rows={5}
            style={{ width: "100%", padding: 16, border: "2px solid rgba(255,255,255,0.08)", borderRadius: 16, fontSize: 15, resize: "none", outline: "none", fontFamily: "inherit", color: "#f1f5f9", backgroundColor: "rgba(255,255,255,0.04)", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            disabled={loading} />
          <div style={{ textAlign: "right", fontSize: 11, color: text.length > 450 ? "#ef4444" : "#64748b", fontWeight: 600, marginTop: 4 }}>{text.length}/500</div>

          {error && <div style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, marginTop: 12, border: "1px solid rgba(239,68,68,0.2)" }}>{error}</div>}

          {/* Vibes */}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: 10 }}>Choose a Vibe:</label>
            <div style={{ display: "flex", gap: 10 }}>
              {vibes.map(v => (
                <button key={v.id} type="button" onClick={() => setVibe(v.id)}
                  style={{ padding: "10px 16px", borderRadius: 12, border: vibe === v.id ? "2px solid rgba(168,85,247,0.5)" : "2px solid rgba(255,255,255,0.08)", background: vibe === v.id ? "rgba(168,85,247,0.15)" : glass, fontWeight: 700, fontSize: 13, cursor: "pointer", color: vibe === v.id ? "#c084fc" : "#94a3b8", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                  <span>{v.emoji}</span> {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secret Code */}
          <div style={{ marginTop: 20, padding: 16, background: "rgba(245,158,11,0.06)", borderRadius: 14, border: "1px solid rgba(245,158,11,0.12)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <FaKey style={{ color: "#f59e0b" }} /> Secret Code <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input type="password" value={secretCode} onChange={e => setSecretCode(e.target.value)} placeholder="At least 4 characters"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 13, outline: "none", backgroundColor: "rgba(255,255,255,0.05)", color: "#f1f5f9" }}
              onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.3)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              disabled={loading} />
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
              {user ? "As the owner, you can also edit/delete without this code." : "Required to edit/delete later. Don't forget it!"}
            </p>
          </div>

          {/* Anonymous toggle */}
          {user && (
            <div onClick={() => setIsAnonymous(!isAnonymous)}
              style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, border: `1px solid ${glassBorder}`, cursor: "pointer", background: isAnonymous ? glass : "rgba(168,85,247,0.08)", transition: "all 0.2s" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isAnonymous ? "rgba(255,255,255,0.08)" : "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: isAnonymous ? "#94a3b8" : "#c084fc" }}>
                {isAnonymous ? <FaUserSecret /> : <FaUser />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#f1f5f9" }}>{isAnonymous ? "Post Anonymously" : `Post as ${user.username}`}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{isAnonymous ? "Your name is hidden, but you can still edit/delete as owner" : "Your username will be shown"}</div>
              </div>
              <div style={{ width: 40, height: 22, borderRadius: 99, padding: 2, background: isAnonymous ? "rgba(255,255,255,0.15)" : "#a855f7", transition: "background 0.2s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transform: isAnonymous ? "translateX(0)" : "translateX(18px)", transition: "transform 0.2s" }} />
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ marginTop: 24, width: "100%", padding: "14px", borderRadius: 14, border: "none", background: loading ? "#475569" : "linear-gradient(135deg,#a855f7,#6366f1)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(168,85,247,0.35)", transition: "all 0.3s" }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 6px 30px rgba(168,85,247,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(168,85,247,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <FaPaperPlane /> {loading ? "Posting..." : "Post Secret"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostConfessionModal;
