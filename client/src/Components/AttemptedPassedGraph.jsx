import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const AttemptedPassedGraph = ({ attempted, passed, failed }) => {

  const data = [
    {
      name: "Exams",
      Attempted: attempted || 0,
      Passed: passed || 0,
      Failed: failed || 0,
    },
  ];

  return (
    <div className="student-performance-graph rounded-xl p-2 mt-4">

      <h3 className="text-base font-semibold mb-4">
        Attempted vs Passed Exams
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          <XAxis dataKey="name" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip cursor={{ fill: '#eff6ff' }} />

          <Legend />

          <Bar dataKey="Attempted" fill="#3b82f6" radius={[6, 6, 0, 0]} />

          <Bar dataKey="Passed" fill="#14b8a6" radius={[6, 6, 0, 0]} />

          <Bar dataKey="Failed" fill="#8b5cf6" radius={[6, 6, 0, 0]} />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};
