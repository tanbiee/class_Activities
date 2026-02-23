import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await register(username, email, password);
        setIsLoading(false);
        if (success) navigate("/login");
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f1a", padding: 16, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)" }}>
            <div style={{ maxWidth: 440, width: "100%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.3)", padding: "48px 40px", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(168, 85, 247, 0.4)" }}>
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Create Account</h1>
                    <p style={{ color: "#64748b", fontSize: 15 }}>Join the campus community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="JohnDoe"
                            style={inputStyle}
                            onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="hello@example.com"
                            style={inputStyle}
                            onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                        />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginBottom: 8 }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                            style={inputStyle}
                            onFocus={(e) => { e.target.style.borderColor = "rgba(168, 85, 247, 0.5)"; e.target.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 20px rgba(168, 85, 247, 0.35)", transition: "all 0.3s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 30px rgba(168, 85, 247, 0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(168, 85, 247, 0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#64748b" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#a855f7", fontWeight: 700, textDecoration: "none" }}>Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
