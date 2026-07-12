import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  RootState,
  addDepartment,
  editDepartment,
  deleteDepartment,
  updateWeights,
  toggleAutoEmission,
  toggleRequireEvidence,
  addToast
} from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Modal } from '../components/Modal';
import { RoleGate } from '../components/RoleGate';
import { Settings, Plus, Edit, Trash2, Check, ShieldAlert, Sliders, Bell } from 'lucide-react';
import { Department } from '../types';

export const SettingsPages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux States
  const departments = useSelector((state: RootState) => state.departments);
  const settings = useSelector((state: RootState) => state.settings);

  // Modal open states
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);

  // Sub Tab Navigation
  const subTabs = [
    { name: 'Departments', path: '/settings/departments' },
    { name: 'Categories Mapping', path: '/settings/categories' },
    { name: 'ESG Configuration', path: '/settings/esg-configuration' },
    { name: 'Notifications Alerts', path: '/settings/notifications' }
  ];

  // --- DEPARTMENT FORM STATE ---
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    head: '',
    parentDept: '',
    employeeCount: '',
    status: 'Active' as any
  });

  const openAddDept = () => {
    setDeptToEdit(null);
    setDeptForm({
      name: '',
      code: '',
      head: '',
      parentDept: 'None',
      employeeCount: '',
      status: 'Active'
    });
    setIsDeptModalOpen(true);
  };

  const openEditDept = (d: Department) => {
    setDeptToEdit(d);
    setDeptForm({
      name: d.name,
      code: d.code,
      head: d.head,
      parentDept: d.parentDept,
      employeeCount: d.employeeCount.toString(),
      status: d.status
    });
    setIsDeptModalOpen(true);
  };

  const handleDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedData: Department = {
      id: deptToEdit ? deptToEdit.id : '',
      name: deptForm.name,
      code: deptForm.code || deptForm.name.substring(0, 4).toUpperCase(),
      head: deptForm.head || 'Corporate Head',
      parentDept: deptForm.parentDept || 'None',
      employeeCount: parseInt(deptForm.employeeCount) || 1,
      status: deptForm.status
    };

    if (deptToEdit) {
      dispatch(editDepartment(formattedData));
      dispatch(addToast({ message: 'Segment metadata updated successfully!', type: 'success' }));
    } else {
      // Omit ID since addDepartment creates it inside Redux Slice
      const { id, ...dataToCreate } = formattedData;
      dispatch(addDepartment(dataToCreate));
      dispatch(addToast({ message: 'New department segment registered!', type: 'success' }));
    }
    setIsDeptModalOpen(false);
  };

  // --- ESG CONFIGURATION WEIGHTS ---
  const [envWeight, setEnvWeight] = useState(settings.weights.environmental.toString());
  const [socWeight, setSocWeight] = useState(settings.weights.social.toString());
  const [govWeight, setGovWeight] = useState(settings.weights.governance.toString());

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const eW = parseInt(envWeight) || 0;
    const sW = parseInt(socWeight) || 0;
    const gW = parseInt(govWeight) || 0;

    if (eW + sW + gW !== 100) {
      dispatch(addToast({ message: 'Error: Sum of ESG weights must equal exactly 100%!', type: 'error' }));
      return;
    }

    dispatch(updateWeights({ environmental: eW, social: sW, governance: gW }));
    dispatch(addToast({ message: 'ESG weights updated successfully!', type: 'success' }));
  };

  // Static Category listings
  const categories = [
    { id: 'cat1', name: 'Manufacturing Operations', pillar: 'Environmental', mapType: 'Scope 1 direct' },
    { id: 'cat2', name: 'Fleet Transportation logistics', pillar: 'Environmental', mapType: 'Scope 1 direct' },
    { id: 'cat3', name: 'Electricity purchase grid', pillar: 'Environmental', mapType: 'Scope 2 indirect' },
    { id: 'cat4', name: 'Community volunteering initiatives', pillar: 'Social', mapType: 'Engagement' },
    { id: 'cat5', name: 'Employee educational safety program', pillar: 'Social', mapType: 'Well-being' },
    { id: 'cat6', name: 'Vendor and supplier code auditing', pillar: 'Governance', mapType: 'Audit trails' }
  ];

  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/departments')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Corporate departments registry</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage operational business segments and track their operational department metadata</p>
            </div>
            <RoleGate allow={['admin']}>
              <button
                onClick={openAddDept}
                className="bg-red-500 hover:bg-red-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Add Segment
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={departments}
            searchFilter={(item, q) => item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)}
            searchPlaceholder="Search departments..."
            columns={[
              { header: 'Department Segment', accessor: (d) => <div className="font-semibold text-white">{d.name} ({d.code})</div>, sortKey: 'name' },
              { header: 'Leader Head', accessor: (d) => <span className="text-gray-300 font-medium">{d.head}</span>, sortKey: 'head' },
              { header: 'Parent Org', accessor: (d) => <span className="text-gray-400 font-mono text-xs">{d.parentDept}</span> },
              { header: 'Personnel Headcount', accessor: (d) => <span className="font-mono text-blue-400 font-bold">{d.employeeCount} employees</span>, sortKey: 'employeeCount' },
              { header: 'Status', accessor: (d) => <StatusPill status={d.status} />, sortKey: 'status' }
            ]}
            actions={(d) => (
              <RoleGate allow={['admin']}>
                <button
                  onClick={() => openEditDept(d)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-slate-500/10 rounded transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    dispatch(deleteDepartment(d.id));
                    dispatch(addToast({ message: 'Segment removed.', type: 'info' }));
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/categories')) {
      return (
        <div className="space-y-4">
          <div className="bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">ESG categories mapping list</h2>
            <p className="text-xs text-gray-400 mt-0.5">Maps transactional resources to direct greenhouse protocol scopes and ESG reporting metrics</p>
          </div>

          <DataTable
            data={categories}
            searchPlaceholder="Search categories mapping..."
            columns={[
              { header: 'Category Title', accessor: (c) => <div className="font-semibold text-white">{c.name}</div> },
              { header: 'ESG Pillar Link', accessor: (c) => <span className="font-bold text-xs text-blue-400">{c.pillar}</span> },
              { header: 'Greenhouse gas / GRI scope type', accessor: (c) => <span className="font-mono text-xs text-gray-400">{c.mapType}</span> }
            ]}
          />
        </div>
      );
    }

    if (path.endsWith('/esg-configuration')) {
      return (
        <div className="space-y-6">
          <div className="bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">ESG Configuration & weights management</h2>
            <p className="text-xs text-gray-400 mt-0.5">Formulate global scores and configure automatic emission triggers for the organization</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Configuration */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-slate-500" /> Sub-Weights Allocation
              </h3>
              <form onSubmit={handleSaveWeights} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Environmental Weight %</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={envWeight}
                      onChange={(e) => setEnvWeight(e.target.value)}
                      className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white text-center font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Social Weight %</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={socWeight}
                      onChange={(e) => setSocWeight(e.target.value)}
                      className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white text-center font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Governance Weight %</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={govWeight}
                      onChange={(e) => setGovWeight(e.target.value)}
                      className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white text-center font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#262b36] flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">
                    Combined Total: {parseInt(envWeight) + parseInt(socWeight) + parseInt(govWeight)}% (Must equal exactly 100)
                  </span>
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    Save Weights
                  </button>
                </div>
              </form>
            </div>

            {/* Platform Toggles */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Enterprise System Rules</h3>

              {/* Rule 3 Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 bg-[#0d0f14]/50 border border-[#262b36] rounded-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Auto Emission Calculation</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      settings.autoEmissionCalculation ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {settings.autoEmissionCalculation ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Automatically computes scope carbon tonnes during logging events based on greenhouse indices. Manual entries are locked when active.
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(toggleAutoEmission());
                    dispatch(addToast({ message: 'Auto Emission Calculation state updated!', type: 'info' }));
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    settings.autoEmissionCalculation ? 'bg-green-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.autoEmissionCalculation ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Rule 4 Toggle */}
              <div className="flex items-start justify-between gap-4 p-4 bg-[#0d0f14]/50 border border-[#262b36] rounded-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Require Evidence for CSR approvals</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      settings.requireEvidenceForCSR ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {settings.requireEvidenceForCSR ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Forces employees to provide file logs when signing up for CSR campaigns. Manager approvals fail if file links are empty.
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(toggleRequireEvidence());
                    dispatch(addToast({ message: 'Evidence Enforcement rule toggled!', type: 'info' }));
                  }}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    settings.requireEvidenceForCSR ? 'bg-green-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    settings.requireEvidenceForCSR ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (path.endsWith('/notifications')) {
      return (
        <div className="space-y-6">
          <div className="bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">System Alerts & subscriptions</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage SMS, email, and API dispatch targets for platform-wide ESG updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Email Dispatch</h3>
                <p className="text-xs text-gray-400">Transmit audit reports and compliance notices directly to corporate mailboxes.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-500" />
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Slack Integrations Alert</h3>
                <p className="text-xs text-gray-400">Dispatch alerts automatically to configured `#esg-compliance` channels.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-500" />
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">In-App Alerts</h3>
                <p className="text-xs text-gray-400">Toggle real-time floating alerts inside the main platform viewport.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-500" />
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">SMS Compliance Alerts</h3>
                <p className="text-xs text-gray-400">High severity anomalies send secure immediate phone notifications.</p>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-red-500" />
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
            <Settings className="w-5 h-5 text-red-500" /> PLATFORM & BUSINESS SETTINGS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Segment configuration registers, score-weights balances, and emission auto-calculation controllers
          </p>
        </div>
      </div>

      <SubTabBar tabs={subTabs} accentColor="slate" />

      <div className="p-6">
        {renderSubPageContent()}
      </div>

      {/* DEPARTMENT MODAL */}
      <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title={deptToEdit ? 'Edit Department Segment' : 'Register Department Segment'}>
        <form onSubmit={handleDeptSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Segment Name</label>
              <input
                type="text"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. Legal & Contracts"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Segment Code</label>
              <input
                type="text"
                required
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. LGL"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Segment Leader/Head</label>
              <input
                type="text"
                required
                value={deptForm.head}
                onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Parent Department</label>
              <input
                type="text"
                required
                value={deptForm.parentDept}
                onChange={(e) => setDeptForm({ ...deptForm, parentDept: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. Operations or None"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Personnel headcount</label>
              <input
                type="number"
                required
                value={deptForm.employeeCount}
                onChange={(e) => setDeptForm({ ...deptForm, employeeCount: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Operational status</label>
              <select
                value={deptForm.status}
                onChange={(e) => setDeptForm({ ...deptForm, status: e.target.value as any })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsDeptModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-black text-xs font-bold rounded-xl uppercase">Save Segment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
