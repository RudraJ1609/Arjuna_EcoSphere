import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  RootState,
  addChallenge,
  addChallengeParticipation,
  handleApproveChallengeThunk,
  rejectChallengeParticipation,
  handleRedeemRewardThunk,
  addToast
} from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Modal } from '../components/Modal';
import { RoleGate } from '../components/RoleGate';
import { Trophy, Award, Gift, Zap, Sparkles, Check, X, Shield, Plus, Flame, Lock } from 'lucide-react';
import { Challenge, ChallengeParticipation, Reward } from '../types';

export const GamificationPages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // States
  const challenges = useSelector((state: RootState) => state.challenges);
  const challengeParticipations = useSelector((state: RootState) => state.challengeParticipations);
  const badges = useSelector((state: RootState) => state.badges);
  const rewards = useSelector((state: RootState) => state.rewards);
  const users = useSelector((state: RootState) => state.auth.users);

  // Local redemptions tracking for the dynamic UI log
  const [localRedemptions, setLocalRedemptions] = useState<any[]>([
    { id: 'red1', rewardId: 'r1', redeemedDate: '2026-07-01', pointsSpent: 200 }
  ]);

  // Active user's state
  const activeUserPoints = currentUser?.points || 0;
  const activeUserXP = currentUser?.xp || 0;

  // Modal open states
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  // Sub Tab Navigation
  const subTabs = [
    { name: 'Challenges', path: '/gamification/challenges' },
    { name: 'Challenge Participation', path: '/gamification/challenge-participation' },
    { name: 'Badges Shelf', path: '/gamification/badges' },
    { name: 'Rewards Store', path: '/gamification/rewards' },
    { name: 'Leaderboard', path: '/gamification/leaderboard' }
  ];

  // --- NEW CHALLENGE HANDLER ---
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    category: 'Waste',
    xp: '150',
    difficulty: 'Medium' as any,
    evidenceRequired: true,
    deadline: '2026-08-31',
    status: 'Active' as any
  });

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addChallenge({
      title: challengeForm.title,
      category: challengeForm.category,
      description: challengeForm.description,
      xp: parseInt(challengeForm.xp) || 150,
      difficulty: challengeForm.difficulty,
      evidenceRequired: challengeForm.evidenceRequired,
      deadline: challengeForm.deadline,
      status: challengeForm.status
    }));
    dispatch(addToast({ message: 'New sustainability challenge active!', type: 'success' }));
    setIsChallengeModalOpen(false);
    setChallengeForm({
      title: '',
      description: '',
      category: 'Waste',
      xp: '150',
      difficulty: 'Medium',
      evidenceRequired: true,
      deadline: '2026-08-31',
      status: 'Active'
    });
  };

  // --- JOIN CHALLENGE HANDLER ---
  const handleJoinChallenge = (challengeId: string) => {
    // Check if user already joined
    const alreadyJoined = challengeParticipations.some(
      p => p.challengeId === challengeId && p.employeeEmail === currentUser?.email
    );
    if (alreadyJoined) {
      dispatch(addToast({ message: 'You have already joined this challenge!', type: 'info' }));
      return;
    }

    const chal = challenges.find(c => c.id === challengeId);
    dispatch(addChallengeParticipation({
      challengeId: challengeId,
      employeeName: currentUser?.name || 'Current User',
      employeeEmail: currentUser?.email || 'user@ecosphere.com',
      progress: 0,
      proofFile: 'https://ecosphere.com/proof.pdf',
      xpAwarded: chal?.xp || 150
    }));
    dispatch(addToast({ message: 'Joined! Push hard to complete the objectives.', type: 'success' }));
  };

  // --- REWARD REDEMPTION HANDLER ---
  const handleRedeem = (rewardId: string) => {
    if (!currentUser) return;
    
    const targetReward = rewards.find(r => r.id === rewardId);
    if (!targetReward) return;

    if (currentUser.points < targetReward.pointsRequired) {
      dispatch(addToast({ message: 'Insufficient points!', type: 'error' }));
      return;
    }
    if (targetReward.stock <= 0) {
      dispatch(addToast({ message: 'Reward out of stock!', type: 'error' }));
      return;
    }

    (dispatch as any)(handleRedeemRewardThunk(rewardId, currentUser.id));

    // Append to aesthetic local redemptions log
    setLocalRedemptions(prev => [
      {
        id: `red-${Date.now()}`,
        rewardId: rewardId,
        redeemedDate: new Date().toISOString().split('T')[0],
        pointsSpent: targetReward.pointsRequired
      },
      ...prev
    ]);
  };

  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/challenges')) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active sustainability challenges</h2>
              <p className="text-xs text-gray-400 mt-0.5">Corporate campaigns. Earn Points for rewards and XP for leaderboard ranks</p>
            </div>
            <RoleGate allow={['admin', 'manager']}>
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Add Challenge
              </button>
            </RoleGate>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => {
              const userPart = challengeParticipations.find(p => p.challengeId === c.id && p.employeeEmail === currentUser?.email);
              const isJoined = !!userPart;
              const isApproved = userPart?.approvalStatus === 'Approved';

              return (
                <div key={c.id} className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2 py-0.5 rounded-full font-bold uppercase">
                        {c.category} • {c.difficulty}
                      </span>
                      <StatusPill status={c.status} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{c.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed min-h-[50px]">{c.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#0d0f14] p-3 rounded-xl border border-[#262b36]">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Reward Weight</p>
                        <p className="text-xs font-bold text-green-400 font-mono mt-0.5">+{Math.round(c.xp / 2)} PTS</p>
                      </div>
                      <div className="text-center border-l border-[#262b36]">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">XP Modifier</p>
                        <p className="text-xs font-bold text-orange-400 font-mono mt-0.5">+{c.xp} XP</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262b36]">
                    {isApproved ? (
                      <div className="w-full text-center py-2 bg-green-500/10 border border-green-500/25 text-green-400 font-bold text-xs rounded-xl uppercase">
                        Challenge Completed!
                      </div>
                    ) : isJoined ? (
                      <div className="w-full text-center py-2 bg-slate-500/10 border border-slate-500/25 text-slate-400 font-bold text-xs rounded-xl uppercase">
                        Participation In Progress
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinChallenge(c.id)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Accept Challenge
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (path.endsWith('/challenge-participation')) {
      const pendingCount = challengeParticipations.filter(p => p.approvalStatus === 'Pending').length;

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Challenge participation sign-offs</h2>
              <p className="text-xs text-gray-400 mt-0.5">Enforces Rule 5: Approving the third challenge triggers dynamic badge unlocks.</p>
            </div>
            {pendingCount > 0 && (
              <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2.5 py-1 rounded-lg font-bold animate-pulse">
                {pendingCount} Verifications Required
              </span>
            )}
          </div>

          <DataTable
            data={challengeParticipations}
            searchFilter={(item, q) => item.employeeName.toLowerCase().includes(q) || item.approvalStatus.toLowerCase().includes(q)}
            searchPlaceholder="Search sign-offs..."
            columns={[
              { header: 'Employee', accessor: (p) => <div className="font-semibold text-white">{p.employeeName}</div>, sortKey: 'employeeName' },
              {
                header: 'Challenge Target',
                accessor: (p) => {
                  const title = challenges.find(c => c.id === p.challengeId)?.title || 'Sustainability Challenge';
                  return <span className="text-slate-300 font-semibold">{title}</span>;
                }
              },
              {
                header: 'Yields Point/XP',
                accessor: (p) => {
                  const chal = challenges.find(c => c.id === p.challengeId);
                  const xpVal = chal?.xp || 150;
                  return (
                    <span className="font-mono text-xs text-orange-400 font-bold">
                      +{Math.round(xpVal / 2)} PTS / +{xpVal} XP
                    </span>
                  );
                }
              },
              { header: 'Status', accessor: (p) => <StatusPill status={p.approvalStatus} />, sortKey: 'approvalStatus' }
            ]}
            actions={(p) => (
              <RoleGate allow={['admin', 'manager']}>
                {p.approvalStatus === 'Pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => (dispatch as any)(handleApproveChallengeThunk(p.id))}
                      className="p-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/25 rounded-lg text-green-400 font-bold transition-all"
                      title="Approve Completion"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(rejectChallengeParticipation(p.id));
                        dispatch(addToast({ message: 'Participation marked incomplete.', type: 'warning' }));
                      }}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/25 rounded-lg text-red-400 font-bold transition-all"
                      title="Decline Completion"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 font-semibold">CLOSED</span>
                )}
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/badges')) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Aesthetic Badges Shelf</h2>
              <p className="text-xs text-gray-400 mt-0.5">Badges unlocked by users. Eco Warrior is auto-awarded on the 3rd completed challenge!</p>
            </div>
            <Award className="w-5 h-5 text-orange-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => {
              // Active user's badges array
              const isUnlocked = currentUser?.badges.includes(badge.id) || currentUser?.badges.includes(badge.name);

              return (
                <div
                  key={badge.id}
                  className={`border rounded-xl p-6 text-center flex flex-col items-center justify-between transition-all duration-300 relative overflow-hidden ${
                    isUnlocked
                      ? 'bg-orange-500/5 border-orange-500/40 shadow-lg shadow-orange-500/5'
                      : 'bg-slate-900/40 border-[#262b36] opacity-60'
                  }`}
                >
                  <div className="absolute top-2 right-2">
                    {isUnlocked ? (
                      <span className="text-[9px] bg-orange-500 text-black font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        UNLOCKED
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Badge Icon Visual */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 mx-auto ${
                      isUnlocked
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-slate-950/50 border-slate-700 text-slate-500 grayscale'
                    }`}>
                      <Trophy className="w-8 h-8" />
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{badge.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mt-0.5">{badge.unlockRule}</p>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">{badge.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262b36] w-full text-[10px] font-mono text-gray-500">
                    {isUnlocked ? 'Earned on verification' : 'Requirements pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (path.endsWith('/rewards')) {
      return (
        <div className="space-y-6">
          {/* Points Display */}
          <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sustainability Balance</p>
                <p className="text-xl font-mono font-bold text-white">
                  <span className="text-orange-400">{activeUserPoints}</span> Points /{' '}
                  <span className="text-blue-400">{activeUserXP}</span> XP
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400 leading-relaxed max-w-sm">
              Use points to claim real carbon offsets, buy reusable items, or plant trees. Points are deducted instantly.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((rew) => {
              const canAfford = activeUserPoints >= rew.pointsRequired;

              return (
                <div key={rew.id} className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between hover:border-slate-500/40 transition-colors">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <Gift className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-mono font-bold text-orange-400">{rew.pointsRequired} PTS</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{rew.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed min-h-[36px]">{rew.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262b36] flex items-center justify-between gap-3">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Qty Available: {rew.stock}</span>
                    <button
                      onClick={() => handleRedeem(rew.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        canAfford && rew.stock > 0
                          ? 'bg-orange-500 hover:bg-orange-600 text-black cursor-pointer'
                          : 'bg-[#0d0f14] border border-[#262b36] text-gray-500 cursor-not-allowed'
                      }`}
                      title={!canAfford ? 'Insufficient points balance' : 'Redeem reward'}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redemptions Ledger */}
          <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Redemption History Log</h3>
            {localRedemptions.length === 0 ? (
              <p className="text-xs text-center text-gray-500 p-4">No points redeemed yet.</p>
            ) : (
              <div className="divide-y divide-[#262b36]">
                {localRedemptions.map((red) => {
                  const rewardName = rewards.find(r => r.id === red.rewardId)?.name || 'Corporate Benefit';
                  return (
                    <div key={red.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-white font-semibold">{rewardName}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">Date: {red.redeemedDate}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-red-400 font-bold text-xs">-{red.pointsSpent} PTS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (path.endsWith('/leaderboard')) {
      // Sort users by XP descending
      const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Corporate Sustainability Leaderboard</h2>
              <p className="text-xs text-gray-400 mt-0.5">Top performing personnel and sustainability champions in the organization</p>
            </div>
            <Trophy className="w-5 h-5 text-orange-400 animate-bounce" />
          </div>

          <div className="bg-[#161a22] border border-[#262b36] rounded-xl overflow-hidden divide-y divide-[#262b36]">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              let rankStyle = 'text-gray-400';
              let badgeIcon = null;

              if (rank === 1) {
                rankStyle = 'text-yellow-400 font-extrabold text-base';
                badgeIcon = '🥇';
              } else if (rank === 2) {
                rankStyle = 'text-slate-300 font-extrabold text-base';
                badgeIcon = '🥈';
              } else if (rank === 3) {
                rankStyle = 'text-amber-600 font-extrabold text-base';
                badgeIcon = '🥉';
              }

              return (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-[#1a1f29]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 text-center font-mono ${rankStyle}`}>
                      {badgeIcon || `#${rank}`}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-white font-bold uppercase text-xs">
                      {user.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs text-white font-bold">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{user.department} Department</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">XP Level</span>
                      <span className="text-xs font-mono font-bold text-blue-400">{user.xp} XP</span>
                    </div>
                    <div className="text-right border-l border-[#262b36] pl-6 min-w-[80px]">
                      <span className="text-[10px] text-gray-500 uppercase font-bold block">Redeemable</span>
                      <span className="text-xs font-mono font-bold text-orange-400">{user.points} PTS</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border-b border-[#262b36] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" /> GAMIFICATION & REWARDS PLATFORM
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Accept active corporate challenges, unlock trophies, and purchase carbon offset vouchers with reward points
          </p>
        </div>
      </div>

      <SubTabBar tabs={subTabs} accentColor="orange" />

      <div className="p-6">
        {renderSubPageContent()}
      </div>

      {/* NEW CHALLENGE MODAL */}
      <Modal isOpen={isChallengeModalOpen} onClose={() => setIsChallengeModalOpen(false)} title="Add Sustainability Challenge">
        <form onSubmit={handleChallengeSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Challenge Title</label>
            <input
              type="text"
              required
              value={challengeForm.title}
              onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="E-waste recycling drive"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Challenge Description</label>
            <textarea
              required
              rows={3}
              value={challengeForm.description}
              onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
              placeholder="Provide challenge objectives and rules..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">XP Reward Weight</label>
              <input
                type="number"
                required
                value={challengeForm.xp}
                onChange={(e) => setChallengeForm({ ...challengeForm, xp: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={challengeForm.category}
                onChange={(e) => setChallengeForm({ ...challengeForm, category: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Waste">Waste Management</option>
                <option value="Carbon">Carbon Reduction</option>
                <option value="Social">Social Engagement</option>
                <option value="Energy">Energy Efficiency</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Difficulty</label>
              <select
                value={challengeForm.difficulty}
                onChange={(e) => setChallengeForm({ ...challengeForm, difficulty: e.target.value as any })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Evidence Submission Policy</label>
              <select
                value={challengeForm.evidenceRequired ? 'true' : 'false'}
                onChange={(e) => setChallengeForm({ ...challengeForm, evidenceRequired: e.target.value === 'true' })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="true">Evidence Required</option>
                <option value="false">Honor System (None)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Campaign Status</label>
            <select
              value={challengeForm.status}
              onChange={(e) => setChallengeForm({ ...challengeForm, status: e.target.value as any })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-bold rounded-xl uppercase">Create Challenge</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
