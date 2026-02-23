import { FaSearch, FaBell } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div style={{
      backgroundColor: "rgba(15, 15, 30, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, color: "#22c55e" }}>●</span>
        <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: 14 }}>
          Welcome back, {user ? user.username : "friend"}.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: 12, top: 11, color: "#64748b", fontSize: 13 }} />
          <input
            type="text"
            placeholder="Search topics (e.g., #exams)..."
            style={{
              paddingLeft: 36,
              paddingRight: 16,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 99,
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
              width: 260,
              outline: "none",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "#f1f5f9",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.4)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
          />
        </div>
        <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
          <FaBell />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
