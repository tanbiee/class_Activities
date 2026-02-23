import { useEffect, useState } from "react";
import ConfessionCard from "../components/cards/ConfessionCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useConfession } from "../contexts/ConfessionContext";
import { useAuth } from "../contexts/AuthContext";

const Feed = () => {
  const { confessions, loading, fetchConfessions } = useConfession();
  const { user } = useAuth();

  useEffect(() => {
    fetchConfessions();
  }, []);

  const safeSpaceRules = ["Be Kind & Support.", "No Names (Anonymity First).", "No Bullying."];
  const hotTopics = ["#finals_week", "#library_crush", "#lost_airpods", "#campus_food"];

  return (
    <DashboardLayout>
      {/* Content + Right Sidebar wrapper */}
      <div style={{ display: "flex", gap: 32 }}>
        {/* Main feed column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>
              <span style={{ color: "#a855f7" }}># </span>Trending on Campus
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>
              Anonymous confessions from your campus community.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
              <p style={{ fontWeight: 600 }}>Loading secrets...</p>
            </div>
          ) : confessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", background: "rgba(255,255,255,0.03)", borderRadius: 20, border: "2px dashed rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ fontWeight: 700, color: "#cbd5e1", fontSize: 18, marginBottom: 4 }}>No confessions yet</p>
              <p style={{ color: "#64748b" }}>Be the first to share!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {confessions.map((c) => (
                <ConfessionCard key={c._id} confession={c} />
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar widgets */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {/* Rules */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span>🛡️</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>Safe Space Rules</span>
            </div>
            {safeSpaceRules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                <span style={{ color: "#a855f7", marginTop: 2 }}>•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {/* Hot Topics */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", display: "block", marginBottom: 12 }}>Hot Topics</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {hotTopics.map((t) => (
                <span key={t} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(168, 85, 247, 0.1)", fontSize: 12, fontWeight: 700, color: "#c084fc", cursor: "pointer", border: "1px solid rgba(168, 85, 247, 0.15)", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)"; }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Campus Mood */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", display: "block", marginBottom: 16 }}>Campus Mood</span>

            {/* Stressed */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                <span>Stressed</span><span>60%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, #a855f7, #6366f1)", borderRadius: 99 }} />
              </div>
            </div>

            {/* Happy */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>
                <span>Happy</span><span>25%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "25%", background: "linear-gradient(90deg, #22c55e, #10b981)", borderRadius: 99 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;
