// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/apiService';
import { getUser } from '../../services/authService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const me = getUser();

  useEffect(() => {
    let mounted = true;
    // only admin can fetch users; endpoint returns 403 otherwise
    api.get('/users')
      .then(r => { if(mounted) setUsers(r.data.users); })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 403) {
          // not admin -> show current user only
          setUsers(me ? [me] : []);
        }
      });
    return ()=> mounted = false;
  }, [me]);

  return (
    <div className="p-4 pb-24 mobile-frame">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <div className="space-y-3">
        {users.map(u => (
          <div key={u._id || u.id || u.email} className="bg-white p-3 rounded-2xl shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
            <div className="text-sm text-gray-600">{u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
