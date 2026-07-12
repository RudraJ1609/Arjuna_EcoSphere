import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  RootState,
  addCSRActivity,
  addParticipation,
  handleApproveCSRThunk,
  rejectParticipation,
  addToast
} from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Modal } from '../components/Modal';
import { RoleGate } from '../components/RoleGate';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Users, Heart, Check, X, ShieldAlert, FileText, Image } from 'lucide-react';

export const SocialPages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // States
  const csrActivities = useSelector((state: RootState) => state.csrActivities);
  const employeeParticipations = useSelector((state: RootState) => state.employeeParticipations);
  const settings = useSelector((state: RootState) => state.settings);

  // Modal open states
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Sub Tab Navigation
  const subTabs = [
    { name: 'CSR Activities', path: '/social/csr-activities' },
    { name: 'Employee Participation', path: '/social/employee-participation' },
    { name: 'Diversity Dashboard', path: '/social/diversity-dashboard' }
  ];

  // --- NEW ACTIVITY HANDLER ---
  const [activityForm, setActivityForm] = useState({ title: '', category: 'Community Outreach', description: '', evidenceRequired: true, status: 'Active' as any, deadline: '' });
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addCSRActivity({
      title: activityForm.title,
      category: activityForm.category,
      description: activityForm.description,
      evidenceRequired: activityForm.evidenceRequired,
      status: activityForm.status,
      deadline: activityForm.deadline
    }));
    dispatch(addToast({ message: 'New CSR Activity registered!', type: 'success' }));
    setIsActivityModalOpen(false);
    setActivityForm({ title: '', category: 'Community Outreach', description: '', evidenceRequired: true, status: 'Active', deadline: '' });
  };

  // --- JOIN ACTIVITY HANDLER ---
  const handleJoinActivity = (activityId: string) => {
    const activity = csrActivities.find(a => a.id === activityId);
    if (!activity) return;

    // Check if user already joined
    const alreadyJoined = employeeParticipations.some(
      p => p.activityId === activityId && p.employeeEmail === currentUser?.email
    );
    if (alreadyJoined) {
      dispatch(addToast({ message: 'You have already submitted a participation request for this activity!', type: 'info' }));
      return;
    }

    dispatch(addParticipation({
      employeeName: currentUser?.name || 'Current User',
      employeeEmail: currentUser?.email || 'user@ecosphere.com',
      activityId: activityId,
      proofFile: activity.evidenceRequired ? 'evidence_receipt.png' : undefined,
      pointsEarned: 50
    }));

    dispatch(addToast({ message: 'Successfully joined! Participation request queued.', type: 'success' }));
  };

  // --- CHART DATA FOR DIVERSITY ---
  const genderData = [
    { name: 'Female', value: 52, color: '#3b82f6' },
    { name: 'Male', value: 45, color: '#22c55e' },
    { name: 'Non-binary', value: 3, color: '#a855f7' }
  ];

  const headcountData = [
    { name: 'Mfg', count: 134, fill: '#22c55e' },
    { name: 'Log', count: 58, fill: '#3b82f6' },
    { name: 'Corp', count: 41, fill: '#a855f7' },
    { name: 'Sales', count: 72, fill: '#f97316' },
    { name: 'R&D', count: 35, fill: '#94a3b8' }
  ];

  const trainingData = [
    { name: 'ESG Basics', pct: 88, fill: '#3b82f6' },
    { name: 'Safety Drill', pct: 95, fill: '#22c55e' },
    { name: 'Code Ethics', pct: 76, fill: '#a855f7' }
  ];

  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/csr-activities')) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">CSR Activities</h2>
              <p className="text-xs text-gray-400 mt-0.5">Corporate Social Responsibility initiatives. Participate to earn points and XP</p>
            </div>
            <RoleGate allow={['admin', 'manager']}>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> New Activity
              </button>
            </RoleGate>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {csrActivities.map((act) => {
              const userJoined = employeeParticipations.some(p => p.activityId === act.id && p.employeeEmail === currentUser?.email);
              const alreadyApproved = employeeParticipations.some(p => p.activityId === act.id && p.employeeEmail === currentUser?.email && p.approvalStatus === 'Approved');

              return (
                <div key={act.id} className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Heart className="w-4 h-4" />
                      </span>
                      <StatusPill status={act.status} />
                    </div>
                    <div className="min-h-[140px] flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{act.title}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">{act.category}</p>
                        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">{act.description}</p>
                      </div>
                      <div className="pt-3 border-t border-[#262b36] flex justify-between items-center text-[10px] text-gray-500">
                        <span>Deadline: <strong className="text-white">{act.deadline}</strong></span>
                        <span>Joined: <strong className="text-white">{act.joinedCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262b36] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold uppercase">
                      <span>Requires Evidence</span>
                      <span className={act.evidenceRequired ? 'text-blue-400' : 'text-gray-400'}>
                        {act.evidenceRequired ? 'YES' : 'NO'}
                      </span>
                    </div>

                    {alreadyApproved ? (
                      <div className="w-full text-center py-2 bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-xs rounded-xl uppercase">
                        Approved • +50 Points
                      </div>
                    ) : userJoined ? (
                      <div className="w-full text-center py-2 bg-slate-500/10 border border-slate-500/20 text-slate-400 font-bold text-xs rounded-xl uppercase">
                        Request Pending
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinActivity(act.id)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Join Activity
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

    if (path.endsWith('/employee-participation')) {
      const pendingCount = employeeParticipations.filter(p => p.approvalStatus === 'Pending').length;

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Employee Participation approval queue</h2>
              <p className="text-xs text-gray-400 mt-0.5">Managers approve CSR / Challenge achievements and issue Points & XP</p>
            </div>
            {pendingCount > 0 && (
              <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2.5 py-1 rounded-lg font-bold animate-pulse">
                {pendingCount} Actions Required
              </span>
            )}
          </div>

          <DataTable
            data={employeeParticipations}
            searchFilter={(item, q) => item.employeeName.toLowerCase().includes(q) || item.approvalStatus.toLowerCase().includes(q)}
            searchPlaceholder="Search queue..."
            columns={[
              { header: 'Employee', accessor: (p) => <div className="font-semibold text-white">{p.employeeName}</div>, sortKey: 'employeeName' },
              {
                header: 'Activity',
                accessor: (p) => {
                  const actName = csrActivities.find(a => a.id === p.activityId)?.title || 'CSR Activity';
                  return <span className="text-slate-300 font-semibold">{actName}</span>;
                }
              },
              {
                header: 'Proof of Evidence',
                accessor: (p) => (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Image className="w-3.5 h-3.5 text-slate-500" />
                    {p.proofFile ? p.proofFile : <span className="text-red-400 font-semibold">No evidence attached</span>}
                  </span>
                )
              },
              { header: 'Points Weight', accessor: (p) => <span className="font-mono text-green-400 font-bold">+{p.pointsEarned} PTS</span> },
              { header: 'Approval status', accessor: (p) => <StatusPill status={p.approvalStatus} />, sortKey: 'approvalStatus' }
            ]}
            actions={(p) => (
              <RoleGate allow={['admin', 'manager']}>
                {p.approvalStatus === 'Pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => (dispatch as any)(handleApproveCSRThunk(p.id))}
                      className="p-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/25 rounded-lg text-green-400 font-bold transition-all"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(rejectParticipation(p.id));
                        dispatch(addToast({ message: 'Participation request rejected.', type: 'warning' }));
                      }}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/25 rounded-lg text-red-400 font-bold transition-all"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-500 font-semibold">ACTION COMPLETED</span>
                )}
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/diversity-dashboard')) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Social Inclusion & Diversity Dashboard</h2>
              <p className="text-xs text-gray-400 mt-0.5">Demographics and corporate ESG training stats</p>
            </div>
            <Users className="w-4 h-4 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gender Donut */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gender Demographics</h3>
                <p className="text-[10px] text-gray-500 mb-4">Percentage breakdown of payroll personnel</p>
              </div>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-4 text-[11px] font-semibold text-gray-300">
                {genderData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span>{d.name}: {d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department headcount bar chart */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Headcount distribution</h3>
              <p className="text-[10px] text-gray-500 mb-4">Total employees assigned per business segment</p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={headcountData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ESG Training metrics */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Corporate Training index</h3>
              <p className="text-[10px] text-gray-500 mb-4">Completion ratios of designated compliance workshops</p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                    <XAxis type="number" domain={[0, 100]} stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="pct" radius={[0, 4, 4, 0]} fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
            <Heart className="w-5 h-5 text-blue-500" /> SOCIAL ENGAGEMENT & REWARDS MODULE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Community outreach campaigns, CSR activity registries, and department-level demographic insights
          </p>
        </div>
      </div>

      <SubTabBar tabs={subTabs} accentColor="blue" />

      <div className="p-6">
        {renderSubPageContent()}
      </div>

      {/* CSR ACTIVITY MODAL */}
      <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title="Register CSR Activity">
        <form onSubmit={handleActivitySubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Activity Title</label>
            <input
              type="text"
              required
              value={activityForm.title}
              onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="Beach Trash collection"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={activityForm.category}
              onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Community Outreach">Community Outreach</option>
              <option value="Employee Well-being">Employee Well-being</option>
              <option value="Compliance & Auditing">Compliance & Auditing</option>
              <option value="Waste Management">Waste Management</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Task Description</label>
            <textarea
              required
              rows={3}
              value={activityForm.description}
              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
              placeholder="Describe the CSR work scope and deliverables..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Deadline</label>
              <input
                type="date"
                required
                value={activityForm.deadline}
                onChange={(e) => setActivityForm({ ...activityForm, deadline: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Required Proof file</label>
              <select
                value={activityForm.evidenceRequired ? 'true' : 'false'}
                onChange={(e) => setActivityForm({ ...activityForm, evidenceRequired: e.target.value === 'true' })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="true">YES - Require Photo/PDF</option>
                <option value="false">NO - Standard sign-up</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsActivityModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold rounded-xl uppercase">Create activity</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
