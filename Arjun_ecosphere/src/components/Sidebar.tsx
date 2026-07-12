import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleSidebar } from '../store';
import {
  LayoutDashboard,
  Leaf,
  Users,
  ShieldAlert,
  Award,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Sliders,
  CheckCircle,
  FileText
} from 'lucide-react';
import { RoleGate } from './RoleGate';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (prefix: string) => location.pathname.startsWith(prefix);

  const menuGroups = [
    {
      title: 'Core',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-slate-400' }
      ]
    },
    {
      title: 'Environmental',
      prefix: '/environmental',
      accentColor: 'border-green-500',
      items: [
        { name: 'Emission Factors', path: '/environmental/emission-factors', icon: Leaf, color: 'text-green-500' },
        { name: 'Product ESG Profiles', path: '/environmental/product-esg-profiles', icon: Leaf, color: 'text-green-500' },
        { name: 'Carbon Transactions', path: '/environmental/carbon-transactions', icon: Leaf, color: 'text-green-500' },
        { name: 'Environmental Goals', path: '/environmental/goals', icon: Leaf, color: 'text-green-500' }
      ]
    },
    {
      title: 'Social',
      prefix: '/social',
      accentColor: 'border-blue-500',
      items: [
        { name: 'CSR Activities', path: '/social/csr-activities', icon: Users, color: 'text-blue-500' },
        { name: 'Employee Participation', path: '/social/employee-participation', icon: Users, color: 'text-blue-500' },
        { name: 'Diversity Dashboard', path: '/social/diversity-dashboard', icon: Users, color: 'text-blue-500' }
      ]
    },
    {
      title: 'Governance',
      prefix: '/governance',
      accentColor: 'border-purple-500',
      items: [
        { name: 'Policies', path: '/governance/policies', icon: ShieldAlert, color: 'text-purple-500' },
        { name: 'Acknowledgements', path: '/governance/policy-acknowledgements', icon: ShieldAlert, color: 'text-purple-500' },
        { name: 'Audits', path: '/governance/audits', icon: ShieldAlert, color: 'text-purple-500' },
        { name: 'Compliance Issues', path: '/governance/compliance-issues', icon: ShieldAlert, color: 'text-purple-500' }
      ]
    },
    {
      title: 'Gamification',
      prefix: '/gamification',
      accentColor: 'border-orange-500',
      items: [
        { name: 'Challenges', path: '/gamification/challenges', icon: Award, color: 'text-orange-500' },
        { name: 'Challenge Progress', path: '/gamification/challenge-participation', icon: Award, color: 'text-orange-500' },
        { name: 'Badges Gallery', path: '/gamification/badges', icon: Award, color: 'text-orange-500' },
        { name: 'Rewards Store', path: '/gamification/rewards', icon: Award, color: 'text-orange-500' },
        { name: 'Leaderboard', path: '/gamification/leaderboard', icon: Award, color: 'text-orange-500' }
      ]
    },
    {
      title: 'Reports',
      prefix: '/reports',
      accentColor: 'border-slate-500',
      roles: ['admin', 'manager'] as const,
      items: [
        { name: 'Environmental Report', path: '/reports/environmental', icon: FileBarChart, color: 'text-slate-400' },
        { name: 'Social Report', path: '/reports/social', icon: FileBarChart, color: 'text-slate-400' },
        { name: 'Governance Report', path: '/reports/governance', icon: FileBarChart, color: 'text-slate-400' },
        { name: 'ESG Summary', path: '/reports/esg-summary', icon: FileBarChart, color: 'text-slate-400' },
        { name: 'Custom Report Builder', path: '/reports/custom-builder', icon: FileBarChart, color: 'text-slate-400' }
      ]
    },
    {
      title: 'Settings',
      prefix: '/settings',
      accentColor: 'border-red-500',
      roles: ['admin'] as const,
      items: [
        { name: 'Departments', path: '/settings/departments', icon: Settings, color: 'text-slate-400' },
        { name: 'Categories', path: '/settings/categories', icon: Settings, color: 'text-slate-400' },
        { name: 'ESG Configuration', path: '/settings/esg-configuration', icon: Settings, color: 'text-slate-400' },
        { name: 'Notification Settings', path: '/settings/notifications', icon: Settings, color: 'text-slate-400' }
      ]
    }
  ];

  return (
    <aside
      className={`bg-[#0d0f14] border-r border-[#262b36] flex flex-col justify-between transition-all duration-300 h-screen sticky top-0 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Chrome */}
      <div className="p-5 border-b border-[#262b36] flex items-center justify-between">
        {!collapsed && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              EcoSphere
            </span>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </div>
            <span className="text-xs font-bold text-green-400 uppercase">ES</span>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-gray-400 hover:text-white hover:bg-[#161a22] p-1.5 rounded transition-all hidden sm:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {menuGroups.map((group, gIndex) => {
          const content = (
            <div key={gIndex} className="space-y-1">
              {!collapsed && (
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1">
                  {group.title}
                </p>
              )}
              {group.items.map((item, iIndex) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={iIndex}
                    onClick={() => navigate(item.path)}
                    title={item.name}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      active
                        ? 'bg-[#161a22] text-white border-l-2 border-slate-400'
                        : 'text-gray-400 hover:text-white hover:bg-[#161a22]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </button>
                );
              })}
            </div>
          );

          if (group.roles) {
            return (
              <RoleGate key={gIndex} allow={group.roles as any}>
                {content}
              </RoleGate>
            );
          }
          return content;
        })}
      </div>

      {/* User profile section */}
      <div className="p-4 border-t border-[#262b36] bg-[#161a22]/30 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser?.role} • {currentUser?.department}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="bg-[#161a22] border border-[#262b36] rounded-lg p-2 flex justify-between items-center text-[10px] font-semibold mt-1">
            <span className="text-orange-400 font-mono">XP: {currentUser?.xp}</span>
            <span className="text-green-400 font-mono">PTS: {currentUser?.points}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
