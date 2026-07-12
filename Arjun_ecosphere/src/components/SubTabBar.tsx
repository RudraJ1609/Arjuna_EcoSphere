import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubTab {
  name: string;
  path: string;
}

interface SubTabBarProps {
  tabs: SubTab[];
  accentColor: 'green' | 'blue' | 'purple' | 'orange' | 'slate';
  id?: string;
}

export const SubTabBar: React.FC<SubTabBarProps> = ({ tabs, accentColor, id }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPillColorClass = (active: boolean) => {
    if (!active) {
      return 'bg-[#0d0f14] text-gray-400 border border-[#262b36] hover:text-white hover:border-slate-500';
    }
    switch (accentColor) {
      case 'green':
        return 'bg-green-500/10 text-green-400 border border-green-500/40';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/40';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/40';
      case 'orange':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/40';
      default:
        return 'bg-slate-500/10 text-slate-300 border border-slate-500/40';
    }
  };

  return (
    <div id={id} className="flex flex-wrap gap-2 py-4 px-6 border-b border-[#262b36]">
      {tabs.map((tab, idx) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={idx}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none whitespace-nowrap cursor-pointer ${getPillColorClass(
              active
            )}`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};
