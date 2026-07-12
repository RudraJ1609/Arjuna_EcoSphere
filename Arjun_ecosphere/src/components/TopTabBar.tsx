import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoleGate } from './RoleGate';

export const TopTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Dashboard', path: '/dashboard', color: 'hover:border-slate-400' },
    { name: 'Environmental', path: '/environmental/emission-factors', prefix: '/environmental', color: 'hover:border-green-500' },
    { name: 'Social', path: '/social/csr-activities', prefix: '/social', color: 'hover:border-blue-500' },
    { name: 'Governance', path: '/governance/policies', prefix: '/governance', color: 'hover:border-purple-500' },
    { name: 'Gamification', path: '/gamification/challenges', prefix: '/gamification', color: 'hover:border-orange-500' },
    { name: 'Reports', path: '/reports/environmental', prefix: '/reports', roles: ['admin', 'manager'] as const, color: 'hover:border-slate-500' },
    { name: 'Settings', path: '/settings/departments', prefix: '/settings', roles: ['admin'] as const, color: 'hover:border-red-500' }
  ];

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.prefix) {
      return location.pathname.startsWith(tab.prefix);
    }
    return location.pathname === tab.path;
  };

  const getActiveTabColor = (tabName: string) => {
    switch (tabName) {
      case 'Environmental': return 'border-green-500 text-green-400';
      case 'Social': return 'border-blue-500 text-blue-400';
      case 'Governance': return 'border-purple-500 text-purple-400';
      case 'Gamification': return 'border-orange-500 text-orange-400';
      case 'Reports': return 'border-slate-400 text-slate-300';
      case 'Settings': return 'border-red-500 text-red-400';
      default: return 'border-slate-400 text-white';
    }
  };

  return (
    <div className="bg-[#161a22] border-b border-[#262b36] px-6">
      <nav className="flex space-x-8 -mb-px overflow-x-auto scrollbar-none">
        {tabs.map((tab, index) => {
          const active = isActive(tab);
          const content = (
            <button
              key={index}
              onClick={() => navigate(tab.path)}
              className={`py-4 px-1 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 whitespace-nowrap focus:outline-none ${
                active
                  ? getActiveTabColor(tab.name)
                  : `border-transparent text-gray-400 ${tab.color} hover:text-white`
              }`}
            >
              {tab.name}
            </button>
          );

          if (tab.roles) {
            return (
              <RoleGate key={index} allow={tab.roles as any}>
                {content}
              </RoleGate>
            );
          }
          return content;
        })}
      </nav>
    </div>
  );
};
