import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../services/auth";
import api from "../services/api";
import { User, Lock, LogIn, AlertCircle } from "lucide-react";
import "./Login.css";

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
      const res = await api.post("/api/login/", {
        username: username.trim(),
        password: password.trim(),
      });
      setTokens(res.data.access, res.data.refresh);
      setToken(res.data.access);
      navigate("/");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        "Invalid credentials. Please check username and password.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
        <div className="login-orb login-orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">Z</div>
            <h1 className="login-title">ZEBA Admin</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Secure admin access for QR tracking system</p>
          </div>
        </div>
      </div>
    </div>
  );
}
