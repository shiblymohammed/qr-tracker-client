import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { clearTokens } from "../../services/auth";
import { LayoutDashboard, MapPin, Menu, LogOut, User } from "lucide-react";
import "./MainLayout.css";

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/locations", label: "Locations", icon: MapPin },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">Z</div>
            {isSidebarOpen && <span className="brand-name">ZEBA Admin</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <span className="nav-icon">
                  <Icon size={20} />
                </span>
                {isSidebarOpen && <span className="nav-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className={`logout-btn ${!isSidebarOpen ? "icon-only" : ""}`}
          >
            <span className="logout-icon">
              <LogOut size={18} />
            </span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="top-bar-right">
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
