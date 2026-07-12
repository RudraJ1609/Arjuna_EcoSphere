import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPITileProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor: 'green' | 'blue' | 'purple' | 'orange' | 'slate';
  onClick?: () => void;
  id?: string;
}

export const KPITile: React.FC<KPITileProps> = ({
  title,
  value,
  subtext,
  trend,
  trendValue,
  accentColor,
  onClick,
  id
}) => {
  const accentClasses = {
    green: 'border-l-4 border-green-500 hover:shadow-green-950/20',
    blue: 'border-l-4 border-blue-500 hover:shadow-blue-950/20',
    purple: 'border-l-4 border-purple-500 hover:shadow-purple-950/20',
    orange: 'border-l-4 border-orange-500 hover:shadow-orange-950/20',
    slate: 'border-l-4 border-slate-500 hover:shadow-slate-950/20'
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-[#161a22] border border-[#262b36] p-5 rounded-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${accentClasses[accentColor]}`}
    >
      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{title}</p>
        {trend && (
          <div
            className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
              trend === 'up'
                ? 'text-green-400 bg-green-500/10'
                : trend === 'down'
                ? 'text-red-400 bg-red-500/10'
                : 'text-gray-400 bg-gray-500/10'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <Minus className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold mt-2 tracking-tight text-white">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-1.5">{subtext}</p>}
    </div>
  );
};
