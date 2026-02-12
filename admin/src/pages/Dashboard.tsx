import { useEffect, useState } from "react";
import { getStats } from "../services/api";
import MainLayout from "../components/layout/MainLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

type Stat = {
  location__name: string;
  total: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    getStats().then((res) => setStats(res.data));
  }, []);

  const data = {
    labels: stats.map((s) => s.location__name),
    datasets: [
      {
        label: "Scans",
        data: stats.map((s) => s.total),
      },
    ],
  };

  return (
    <MainLayout>
      <h2>Scan Analytics</h2>
      <Bar data={data} />
    </MainLayout>
  );
}
