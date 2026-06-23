import React from 'react';

const StatCard = ({ title, value, color }) => {
  const getColorAccent = (color) => {
    switch (color) {
      case 'accent':
        return 'border-t-4 border-accent';
      case 'green':
        return 'border-t-4 border-green-500';
      case 'blue':
        return 'border-t-4 border-blue-500';
      default:
        return 'border-t-4 border-primary';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${getColorAccent(color)} flex flex-col justify-between`}>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-black text-primary mt-2">{value !== undefined ? value : 0}</p>
    </div>
  );
};

export default StatCard;
