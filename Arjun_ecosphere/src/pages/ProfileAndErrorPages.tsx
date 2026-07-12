import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, addToast } from '../store';
import { Shield, Trophy, User, Lock, Award, ArrowLeft } from 'lucide-react';

// PROFILE PAGE
export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const badges = useSelector((state: RootState) => state.badges);

  const [nameForm, setNameForm] = useState(currentUser?.name || '');
  const [passwordForm, setPasswordForm] = useState('••••••••');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addToast({ message: 'Profile details updated in cache!', type: 'success' }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-[#262b36] pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" /> MY CORPORATE PROFILE
        </h1>
        <p className="text-xs text-gray-400 mt-1">Manage corporate details, review earned credentials, and points balance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Info Card */}
        <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4 text-center">
            {/* Avatar placeholder */}
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-2 border-[#262b36] mx-auto text-white font-extrabold text-xl uppercase">
              {currentUser?.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">{currentUser?.name}</h2>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{currentUser?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#0d0f14] p-3 rounded-xl border border-[#262b36] text-center">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Role level</p>
                <p className="text-xs font-bold text-purple-400 uppercase mt-0.5">{currentUser?.role}</p>
              </div>
              <div className="border-l border-[#262b36]">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Segment</p>
                <p className="text-xs font-bold text-blue-400 mt-0.5">{currentUser?.department}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#262b36] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">XP modifier level</span>
              <span className="font-mono text-xs text-orange-400 font-bold">{currentUser?.xp} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Redeemable balance</span>
              <span className="font-mono text-xs text-green-400 font-bold">{currentUser?.points} PTS</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 lg:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Configuration</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameForm}
                  onChange={(e) => setNameForm(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Corporate Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email}
                  className="w-full bg-[#0d0f14]/50 border border-[#262b36] rounded-xl p-2.5 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Reset Security Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordForm}
                  onChange={(e) => setPasswordForm(e.target.value)}
                  className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#262b36] flex justify-end">
              <button
                type="submit"
                className="bg-slate-100 hover:bg-white text-black font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Badges Shelf section */}
      <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">My Unlocked Trophy Shelf</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(badge => {
            const hasBadge = currentUser?.badges.includes(badge.name);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-2 ${
                  hasBadge
                    ? 'bg-orange-500/5 border-orange-500/30 text-white'
                    : 'bg-slate-900/30 border-[#262b36]/60 opacity-40 grayscale'
                }`}
              >
                <Award className={`w-8 h-8 ${hasBadge ? 'text-orange-400' : 'text-gray-600'}`} />
                <div>
                  <h4 className="text-xs font-bold uppercase">{badge.name}</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5">{badge.unlockRule}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 403 FORBIDDEN PAGE
export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center text-red-400 animate-bounce">
        <Shield className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-white uppercase tracking-wider">Access Restrained (403)</h1>
      <p className="text-xs text-gray-400 max-w-md leading-relaxed">
        Your current persona lacks the administrative clearance requirements to view this corporate segment. Please switch your active Persona in the top bar dropdown or return to the main dashboard.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-slate-100 hover:bg-white text-black font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
    </div>
  );
};

// 404 NOT FOUND PAGE
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 bg-slate-800/50 border border-[#262b36] rounded-full flex items-center justify-center text-gray-400 animate-pulse">
        <Trophy className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-white uppercase tracking-wider">Page Not Found (404)</h1>
      <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
        The requested URL mapping could not be located in our ESG registry routers. Check spelling or return home.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-slate-100 hover:bg-white text-black font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Go back home
      </button>
    </div>
  );
};
