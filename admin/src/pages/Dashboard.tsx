import { useEffect, useState } from "react";
import { getStats } from "../services/api";
import MainLayout from "../components/layout/MainLayout";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  MapPin,
  Activity,
  Target,
  ArrowUp,
} from "lucide-react";
import "./Dashboard.css";

type Stat = {
  location__name: string;
  total: number;
};

const CHART_COLORS = ["#3B82F6", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#F472B6"];

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalScans = stats.reduce((sum, stat) => sum + stat.total, 0);
  const avgScans = stats.length > 0 ? Math.round(totalScans / stats.length) : 0;
  const topLocation = stats.length > 0 ? stats.reduce((max, stat) => (stat.total > max.total ? stat : max), stats[0]) : null;
  const growthRate = 12.5; // Mock growth rate

  // Prepare data for charts
  const pieData = stats.map((stat, index) => ({
    name: stat.location__name,
    value: stat.total,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Mock trend data
  const trendData = stats.map((stat) => ({
    name: stat.location__name,
    scans: stat.total,
    target: Math.round(stat.total * 1.2),
  }));

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time QR code scan tracking and performance metrics
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading analytics...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Activity size={64} strokeWidth={1} />
            </div>
            <h3>No Data Available</h3>
            <p>Create locations and start tracking QR code scans!</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card kpi-primary">
                <div className="kpi-header">
                  <div className="kpi-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div className="kpi-badge positive">
                    <ArrowUp size={14} />
                    <span>{growthRate}%</span>
                  </div>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Total Scans</div>
                  <div className="kpi-value">{totalScans.toLocaleString()}</div>
                  <div className="kpi-subtitle">All-time performance</div>
                </div>
                <div className="kpi-glow"></div>
              </div>

              <div className="kpi-card kpi-success">
                <div className="kpi-header">
                  <div className="kpi-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="kpi-badge">
                    <Activity size={14} />
                    <span>Active</span>
                  </div>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Active Locations</div>
                  <div className="kpi-value">{stats.length}</div>
                  <div className="kpi-subtitle">Tracking points</div>
                </div>
                <div className="kpi-glow"></div>
              </div>

              <div className="kpi-card kpi-warning">
                <div className="kpi-header">
                  <div className="kpi-icon">
                    <Target size={24} />
                  </div>
                  <div className="kpi-badge">
                    <span>Top</span>
                  </div>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Best Performer</div>
                  <div className="kpi-value-small">{topLocation?.location__name || "N/A"}</div>
                  <div className="kpi-subtitle">{topLocation?.total.toLocaleString()} scans</div>
                </div>
                <div className="kpi-glow"></div>
              </div>

              <div className="kpi-card kpi-info">
                <div className="kpi-header">
                  <div className="kpi-icon">
                    <Activity size={24} />
                  </div>
                  <div className="kpi-badge">
                    <span>Avg</span>
                  </div>
                </div>
                <div className="kpi-content">
                  <div className="kpi-label">Average Scans</div>
                  <div className="kpi-value">{avgScans.toLocaleString()}</div>
                  <div className="kpi-subtitle">Per location</div>
                </div>
                <div className="kpi-glow"></div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {/* Bar Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Scans by Location</h3>
                  <p className="chart-subtitle">Performance comparison</p>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "#1E293B",
                          border: "1px solid #2A3441",
                          borderRadius: "8px",
                          color: "#F1F5F9",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="scans" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="target" fill="#22C55E" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Distribution</h3>
                  <p className="chart-subtitle">Scan share by location</p>
                </div>
                <div className="chart-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1E293B",
                          border: "1px solid #2A3441",
                          borderRadius: "8px",
                          color: "#F1F5F9",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Location Performance Table */}
            <div className="performance-card">
              <div className="performance-header">
                <h3 className="performance-title">Location Performance</h3>
                <p className="performance-subtitle">Detailed breakdown</p>
              </div>
              <div className="performance-table">
                {stats.map((stat, index) => {
                  const percentage = ((stat.total / totalScans) * 100).toFixed(1);
                  const isTop = index === 0;
                  return (
                    <div key={stat.location__name} className={`performance-row ${isTop ? "top" : ""}`}>
                      <div className="performance-rank">#{index + 1}</div>
                      <div className="performance-info">
                        <div className="performance-name">{stat.location__name}</div>
                        <div className="performance-bar-container">
                          <div
                            className="performance-bar"
                            style={{
                              width: `${percentage}%`,
                              background: CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="performance-stats">
                        <div className="performance-count">{stat.total.toLocaleString()}</div>
                        <div className="performance-percentage">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
