// src/pages/Alerts.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/alerts').then(r => { if (mounted) setAlerts(r.data.alerts); }).catch(console.error);
    return ()=> mounted = false;
  }, []);

  const severityColor = (s) => {
    if (!s) return 'bg-gray-200';
    if (s === 'critical') return 'bg-red-500 text-white';
    if (s === 'high') return 'bg-orange-400';
    if (s === 'medium') return 'bg-yellow-300';
    return 'bg-blue-200';
  };

  return (
    <div className="p-4 pb-24 mobile-frame">
      <h1 className="text-xl font-bold mb-4">Alerts</h1>
      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a._id || a.id} className="bg-white p-3 rounded-2xl shadow flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${severityColor(a.severity)}`}>
              {a.severity?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
