import DashboardLayout from "../components/layout/DashboardLayout";
import ConfessionCard from "../components/cards/ConfessionCard";
import { useConfession } from "../contexts/ConfessionContext";
import { useAuth } from "../contexts/AuthContext";
import { FaLock, FaChartBar, FaCloud } from "react-icons/fa";

const Dashboard = () => {
  const { confessions } = useConfession();
  const { user } = useAuth();

  const myConfessions = user ? confessions.filter((c) => c.userId === user.id) : [];

  if (!user) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(168, 85, 247, 0.2)" }}>
            <FaLock style={{ fontSize: 24, color: "#a855f7" }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Login Required</h2>
          <p style={{ color: "#64748b", maxWidth: 300 }}>Please login to view your personal dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  const bars = [40, 65, 30, 85, 50, 90, 45];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const words = [
    { text: "Stressed", size: 36, color: "#f1f5f9" },
    { text: "Happy", size: 22, color: "#64748b" },
    { text: "Tired", size: 18, color: "#a855f7" },
    { text: "Excited", size: 28, color: "#c084fc" },
    { text: "Nervous", size: 20, color: "#818cf8" },
    { text: "Chill", size: 16, color: "#475569" },
  ];

  const cardBase = {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    padding: 32,
    boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <DashboardLayout>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>Campus Trends</h1>
      <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500, marginBottom: 32 }}>Overview of campus activity.</p>

      {/* Chart Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Active Hours */}
        <div style={{ ...cardBase, minHeight: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ padding: 8, background: "rgba(168, 85, 247, 0.15)", borderRadius: 10 }}><FaChartBar style={{ color: "#a855f7" }} /></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Most Active Hours</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, padding: "0 8px" }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "100%", height: 160, background: "rgba(255,255,255,0.04)", borderRadius: "10px 10px 0 0", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${h}%`, background: "linear-gradient(180deg, #a855f7, #6366f1)", borderRadius: "10px 10px 0 0", transition: "height 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 8px 0", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
            {days.map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Mood Cloud */}
        <div style={{ ...cardBase, minHeight: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ padding: 8, background: "rgba(236, 72, 153, 0.15)", borderRadius: 10 }}><FaCloud style={{ color: "#ec4899" }} /></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Weekly Mood Cloud</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: "12px 20px" }}>
            {words.map((w) => (
              <span key={w.text} style={{ fontSize: w.size, fontWeight: 800, color: w.color, cursor: "default" }}>{w.text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 40 }}>
        <div style={{ ...cardBase, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4, textTransform: "uppercase" }}>Total Confessions</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9" }}>{myConfessions.length}</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(168, 85, 247, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid rgba(168, 85, 247, 0.15)" }}>💬</div>
        </div>

        <div style={{ ...cardBase, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4, textTransform: "uppercase" }}>Support Given</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9" }}>85.4k</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid rgba(34, 197, 94, 0.15)" }}>❤️</div>
        </div>

        <div style={{ ...cardBase, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4, textTransform: "uppercase" }}>Campuses Online</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#f1f5f9" }}>12</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(249, 115, 22, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: "1px solid rgba(249, 115, 22, 0.15)" }}>🏢</div>
        </div>
      </div>

      {/* My Confessions */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 20 }}>My Recent Confessions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {myConfessions.length > 0 ? (
          myConfessions.map((c) => <ConfessionCard key={c._id} confession={c} />)
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 48, background: "rgba(255,255,255,0.03)", borderRadius: 20, border: "2px dashed rgba(255,255,255,0.08)", color: "#64748b", fontWeight: 600 }}>
            You haven't posted any secrets yet.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
