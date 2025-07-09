import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const variantClasses = {
  primary: 'bg-blue-50 text-blue-600 border-l-4 border-blue-500',
  success: 'bg-green-50 text-green-600 border-l-4 border-green-500',
  danger: 'bg-red-50 text-red-600 border-l-4 border-red-500',
  default: 'bg-gray-50 text-gray-600 border-l-4 border-gray-500'
};

export default function StatsCard({ title, value, trend, icon, variant = 'default' }) {
  const isPositive = trend?.startsWith('+');
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <div className={`rounded-lg p-6 ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-full p-3 bg-white shadow-sm">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`mt-2 flex items-center text-sm ${trendColor}`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          <span>{trend} vs last period</span>
        </div>
      )}
    </div>
  );
}