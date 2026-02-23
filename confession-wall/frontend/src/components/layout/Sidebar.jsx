import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaHome, FaChartPie, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHeart } from "react-icons/fa";

const Sidebar = ({ onWriteClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "250px",
    backgroundColor: "rgba(15, 15, 30, 0.95)",
    backdropFilter: "blur(16px)",
    borderRight: "1px solid rgba(168, 85, 247, 0.1)",
    display: "flex",
    flexDirection: "column",
    zIndex: 50,
    overflowY: "auto",
  };

  const navBtnStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
    background: active ? "linear-gradient(135deg, #a855f7, #6366f1)" : "transparent",
    color: active ? "#fff" : "#94a3b8",
    boxShadow: active ? "0 4px 20px rgba(168, 85, 247, 0.3)" : "none",
  });

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: "linear-gradient(135deg, #a855f7, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(168, 85, 247, 0.3)" }}>
            <FaHeart style={{ color: "#fff", fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#f1f5f9", lineHeight: 1 }}>Whisper</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#a855f7", letterSpacing: "2px", textTransform: "uppercase" }}>Create Your Safe SPace</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={() => navigate("/feed")} style={navBtnStyle(isActive("/feed"))}>
            <FaHome /> Campus Feed
          </button>
          <button onClick={() => navigate("/dashboard")} style={navBtnStyle(isActive("/dashboard"))}>
            <FaChartPie /> My History
          </button>
        </div>
      </nav>

      {/* Write Button */}
      <div style={{ padding: "0 16px", marginBottom: 20 }}>
        <button
          onClick={onWriteClick}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(168, 85, 247, 0.35)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 30px rgba(168, 85, 247, 0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(168, 85, 247, 0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          ✏️ Write Secret
        </button>
      </div>

      {/* User */}
      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 0 12px rgba(168, 85, 247, 0.3)" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#f1f5f9" }}>{user.username}</div>
                <div style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>● Online</div>
              </div>
            </div>
            <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 16, transition: "color 0.2s" }} title="Logout"
              onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => navigate("/login")} style={{ padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700, fontSize: 13, color: "#cbd5e1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
              <FaSignInAlt /> Login
            </button>
            <button onClick={() => navigate("/register")} style={{ padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #a855f7, #6366f1)", border: "none", fontWeight: 700, fontSize: 13, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 2px 12px rgba(168, 85, 247, 0.3)" }}>
              <FaUserPlus /> Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
