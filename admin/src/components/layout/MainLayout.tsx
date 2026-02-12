import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { clearTokens } from "../../services/auth";

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/locations", label: "Locations", icon: "📍" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0f1e" }}>
      {/* Sidebar */}
      <aside style={{
        width: "250px",
        background: "#1a1a2e",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #2a2a3e"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ 
            color: "#fff", 
            fontSize: "24px", 
            fontWeight: "700",
            margin: 0
          }}>
            QR Tracker
          </h1>
          <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0" }}>
            Admin Dashboard
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#a0a0a0",
                  background: isActive ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  transition: "all 0.3s",
                  fontWeight: isActive ? "600" : "400"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#16213e";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#a0a0a0";
                  }
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 16px",
            background: "#ff4444",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
            transition: "opacity 0.3s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: "40px",
        overflowY: "auto"
      }}>
        {children}
      </main>
    </div>
  );
}
