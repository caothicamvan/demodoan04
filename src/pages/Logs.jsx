// src/pages/Logs.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/logs').then(r => { if(mounted) setLogs(r.data.logs); }).catch(console.error);
    return ()=> mounted = false;
  }, []);

  return (
    <div className="p-4 pb-24 mobile-frame">
      <h1 className="text-xl font-bold mb-4">Logs</h1>
      <div className="space-y-3">
        {logs.map(l => (
          <div key={l._id || l.id} className="bg-white p-3 rounded-2xl shadow">
            <div className="flex justify-between">
              <div className="font-medium">{l.level?.toUpperCase() || 'INFO'}</div>
              <div className="text-xs text-gray-400">{new Date(l.time || l.date).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-700 mt-2">{l.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
