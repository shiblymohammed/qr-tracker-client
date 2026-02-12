import { useEffect, useState } from "react";
import { getStats } from "../services/api";
import MainLayout from "../components/layout/MainLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Stat = {
  location__name: string;
  total: number;
};

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

  const data = {
    labels: stats.map((s) => s.location__name),
    datasets: [
      {
        label: "Total Scans",
        data: stats.map((s) => s.total),
        backgroundColor: "rgba(102, 126, 234, 0.8)",
        borderColor: "rgba(102, 126, 234, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: "#1a1a2e",
        titleColor: "#fff",
        bodyColor: "#a0a0a0",
        borderColor: "#667eea",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: "#a0a0a0" },
        grid: { color: "#2a2a3e" }
      },
      y: {
        ticks: { color: "#a0a0a0" },
        grid: { color: "#2a2a3e" }
      }
    }
  };

  return (
    <MainLayout>
      <div>
        <h2 style={{ color: "#fff", fontSize: "32px", marginBottom: "8px" }}>
          Scan Analytics
        </h2>
        <p style={{ color: "#a0a0a0", marginBottom: "30px" }}>
          Track QR code scan performance across all locations
        </p>

        {loading ? (
          <div style={{ 
            color: "#a0a0a0", 
            textAlign: "center", 
            padding: "40px" 
          }}>
            Loading analytics...
          </div>
        ) : stats.length === 0 ? (
          <div style={{
            background: "#1a1a2e",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#a0a0a0"
          }}>
            No scan data available yet. Create locations and start tracking!
          </div>
        ) : (
          <div style={{
            background: "#1a1a2e",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}>
            <div style={{ height: "400px" }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          {stats.map((stat) => (
            <div
              key={stat.location__name}
              style={{
                background: "#1a1a2e",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #2a2a3e"
              }}
            >
              <div style={{ color: "#667eea", fontSize: "32px", fontWeight: "700" }}>
                {stat.total}
              </div>
              <div style={{ color: "#a0a0a0", fontSize: "14px", marginTop: "4px" }}>
                {stat.location__name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
