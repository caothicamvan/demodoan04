import axios from "axios";
import { useEffect, useState } from "react";

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/devices").then(res => setDevices(res.data));
  }, []);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Thiết bị</h1>
      {devices.map((d, i) => (
        <div key={i} className="p-3 mb-2 bg-white rounded-2xl shadow flex justify-between">
          <p>{d.name}</p>
          <p className={d.status === "Online" ? "text-green-500" : "text-red-500"}>
            {d.status}
          </p>
        </div>
      ))}
    </div>
  );
}
