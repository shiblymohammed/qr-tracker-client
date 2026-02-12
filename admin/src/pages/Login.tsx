import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../services/auth";
import api from "../services/api";

type Props = {
  setToken: (token: string) => void;
};

export default function Login({ setToken }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Attempting login with:", { username, password: "***" });
      const res = await api.post("/api/login/", {
        username,
        password,
      });
      console.log("Login successful:", res.data);
      setTokens(res.data.access, res.data.refresh);
      setToken(res.data.access);
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.message || 
                       "Invalid credentials. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "#1a1a2e",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ 
            color: "#fff", 
            fontSize: "28px", 
            marginBottom: "8px",
            fontWeight: "600"
          }}>
            QR Tracker Admin
          </h2>
          <p style={{ color: "#a0a0a0", fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            background: "#ff4444",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              color: "#a0a0a0", 
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Username
            </label>
            <input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#16213e",
                border: "2px solid #0f3460",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#0f3460"}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              display: "block", 
              color: "#a0a0a0", 
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#16213e",
                border: "2px solid #0f3460",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#0f3460"}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#555" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, opacity 0.2s",
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
