import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Initialize Google Sign-In button
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        width: "100%",
        text: "signin_with",
        shape: "pill",
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      const success = await googleLogin(response.credential);
      if (success) navigate("/feed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) navigate("/feed");
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    border: "2px solid rgba(255,255,255,0.08)",
    fontSize: 15,
    outline: "none",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#f1f5f9",
    transition: "border-color 0.2s, background-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f1a", padding: 16, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)" }}>
      <div style={{ maxWidth: 440, width: "100%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.3)", padding: "48px 40px", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(168, 85, 247, 0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>Sign in to Campus Safe Space</p>
        </div>

        {/* Google Sign-In Button */}
        <div ref={googleBtnRef} style={{ display: "flex", justifyContent: "center", marginBottom: 24 }} />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="hello@example.com"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
            />
          </div>

          <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 20px rgba(168, 85, 247, 0.35)", marginBottom: 12, transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 30px rgba(168, 85, 247, 0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(168, 85, 247, 0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <button type="button" onClick={() => navigate("/feed")} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#94a3b8", transition: "all 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            Continue as Guest
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#64748b" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#a855f7", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
