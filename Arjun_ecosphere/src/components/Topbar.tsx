import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, switchUser, markAllRead, logout } from '../store';
import { Bell, LogOut, CheckCircle, ShieldAlert, Award, FileText, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const users = useSelector((state: RootState) => state.auth.users);
  const notifications = useSelector((state: RootState) => state.notifications.list);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(switchUser(e.target.value));
    navigate('/dashboard');
  };

  const notificationIcons = {
    compliance: <ShieldAlert className="w-4 h-4 text-red-400" />,
    participation: <CheckCircle className="w-4 h-4 text-green-400" />,
    policy: <FileText className="w-4 h-4 text-blue-400" />,
    badge: <Award className="w-4 h-4 text-orange-400" />,
    general: <Settings className="w-4 h-4 text-gray-400" />
  };

  return (
    <header className="bg-[#161a22]/80 backdrop-blur-md border-b border-[#262b36] sticky top-0 z-30 h-16 px-6 flex items-center justify-between">
      {/* Search / Breadcrumbs */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
          <span className="text-gray-500 uppercase tracking-wider">ECOSPHERE ESG</span>
          <span className="text-gray-600">/</span>
          <span className="text-white capitalize font-mono text-xs tracking-wider">
            {currentUser?.role} Mode
          </span>
        </div>
      </div>

      {/* Center Persona Switcher and Controls */}
      <div className="flex items-center gap-4">
        {/* DEV MODE SWITCHER */}
        <div className="flex items-center gap-2 bg-[#0d0f14] border border-[#262b36] rounded-lg px-2.5 py-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Persona:</span>
          <select
            value={currentUser?.id}
            onChange={handlePersonaChange}
            className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-[#161a22] text-white text-xs">
                {u.name} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-500/10 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-[#161a22] border border-[#262b36] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[#262b36] flex justify-between items-center bg-[#1a1f29]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllRead())}
                      className="text-[10px] text-slate-400 hover:text-white transition-colors uppercase font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#262b36]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-xs text-center text-gray-400">
                      No notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 flex gap-2.5 transition-colors ${
                          !n.read ? 'bg-[#1e2430]/40' : 'hover:bg-[#1a1f29]/30'
                        }`}
                      >
                        <div className="mt-0.5">{notificationIcons[n.type] || notificationIcons.general}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs text-white ${!n.read ? 'font-semibold' : 'font-normal'}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-gray-500 mt-1 font-mono">
                            {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-[#262b36] bg-[#1a1f29] text-center">
                  <span className="text-[10px] text-gray-400">EcoSphere System Alert Log</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile and Logout */}
        <button
          onClick={() => navigate('/profile')}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-500/10 transition-all"
          title="My Profile"
        >
          <User className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
