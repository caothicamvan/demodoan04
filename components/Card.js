// src/components/Card.js
export default function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded-2xl text-white ${color} shadow-md`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
