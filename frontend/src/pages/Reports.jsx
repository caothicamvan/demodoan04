// src/pages/Reports.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Reports() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/reports/summary').then(r => { if(mounted) setSummary(r.data); }).catch(console.error);
    return ()=> mounted = false;
  }, []);

  if (!summary) return <div className="p-4 mobile-frame">Loading...</div>;

  return (
    <div className="p-4 pb-24 mobile-frame">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm">Total devices</div>
          <div className="text-2xl font-bold">{summary.totalDevices}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm">Logs processed</div>
          <div className="text-2xl font-bold">{summary.logsProcessed}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm">Alerts</div>
          <div className="text-2xl font-bold">{summary.alertsToday}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="text-sm">System stability</div>
          <div className="text-2xl font-bold">{summary.systemStability}%</div>
        </div>
      </div>

      <div className="mt-4 bg-white p-3 rounded-2xl shadow">
        <h3 className="font-medium mb-2">Activity</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={summary.chart}>
              <XAxis dataKey="time" />
              <Tooltip />
              <Bar dataKey="logs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
