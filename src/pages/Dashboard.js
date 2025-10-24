import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../../components/Card";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  // Gọi API backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reports/summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // có thể bỏ nếu chưa dùng login
        }
      })
      .then(res => setSummary(res.data))
      .catch(err => console.error("Lỗi lấy dữ liệu:", err));
  }, []);

  if (!summary) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 pb-20 space-y-6">
      <h1 className="text-2xl font-bold">📊 Network Dashboard</h1>

      {/* Các thẻ thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Devices" value={summary.totalDevices} color="bg-blue-500" />
        <Card title="Logs Processed" value={summary.logsProcessed} color="bg-green-500" />
        <Card title="Alerts Today" value={summary.alertsToday} color="bg-red-500" />
        <Card title="System Stability" value={`${summary.systemStability}%`} color="bg-yellow-500" />
      </div>

      {/* Biểu đồ Recharts */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Activity Summary</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={summary.chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <Tooltip />
            <Bar dataKey="logs" fill="#3b82f6" name="Logs" />
            <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
