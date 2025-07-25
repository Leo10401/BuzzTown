'use client';
import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
        </div>
        <div className={`text-2xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
