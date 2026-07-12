import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  RootState,
  addPolicy,
  handleAcknowledgePolicyThunk,
  addAudit,
  handleAddComplianceIssueThunk,
  handleResolveComplianceIssueThunk,
  deleteComplianceIssue,
  addToast
} from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Modal } from '../components/Modal';
import { RoleGate } from '../components/RoleGate';
import { Shield, FileText, CheckCircle, AlertOctagon, Plus, Send, AlertTriangle } from 'lucide-react';
import { ESGPolicy, Audit, ComplianceIssue } from '../types';

export const GovernancePages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // States
  const policies = useSelector((state: RootState) => state.policies);
  const acknowledgements = useSelector((state: RootState) => state.policyAcknowledgements);
  const audits = useSelector((state: RootState) => state.audits);
  const issues = useSelector((state: RootState) => state.complianceIssues);
  const departments = useSelector((state: RootState) => state.departments);

  // Modal open states
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string>('au1');

  // Sub Tab Navigation
  const subTabs = [
    { name: 'Policies', path: '/governance/policies' },
    { name: 'Policy Acknowledgements', path: '/governance/policy-acknowledgements' },
    { name: 'Audits', path: '/governance/audits' },
    { name: 'Compliance Issues', path: '/governance/compliance-issues' }
  ];

  // Current Date reference
  const today = '2026-07-12';

  // --- NEW POLICY HANDLER ---
  const [policyForm, setPolicyForm] = useState({ title: '', category: 'Governance Ethics', description: '', effectiveDate: '', status: 'Active' as any });
  const handlePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addPolicy({
      title: policyForm.title,
      category: policyForm.category,
      description: policyForm.description,
      effectiveDate: policyForm.effectiveDate,
      status: policyForm.status
    }));
    dispatch(addToast({ message: 'New policy published!', type: 'success' }));
    setIsPolicyModalOpen(false);
    setPolicyForm({ title: '', category: 'Governance Ethics', description: '', effectiveDate: '', status: 'Active' });
  };

  // --- NEW AUDIT HANDLER ---
  const [auditForm, setAuditForm] = useState({ title: '', department: 'Manufacturing', auditor: '', findings: '', status: 'Completed' as any });
  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addAudit({
      title: auditForm.title,
      department: auditForm.department,
      auditor: auditForm.auditor,
      date: new Date().toISOString().split('T')[0],
      findings: auditForm.findings,
      status: auditForm.status
    }));
    dispatch(addToast({ message: 'New audit record added!', type: 'success' }));
    setIsAuditModalOpen(false);
    setAuditForm({ title: '', department: 'Manufacturing', auditor: '', findings: '', status: 'Completed' });
  };

  // --- COMPLIANCE ISSUE HANDLER ---
  const [issueForm, setIssueForm] = useState({ severity: 'High' as any, description: '', owner: 'Marcus Vance', dueDate: '' });
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (dispatch as any)(handleAddComplianceIssueThunk({
      auditId: selectedAuditId,
      severity: issueForm.severity,
      description: issueForm.description,
      owner: issueForm.owner,
      dueDate: issueForm.dueDate
    }));
    setIsIssueModalOpen(false);
    setIssueForm({ severity: 'High', description: '', owner: 'Marcus Vance', dueDate: '' });
  };

  const openRaiseIssue = (auditId: string) => {
    setSelectedAuditId(auditId);
    setIsIssueModalOpen(true);
  };

  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/policies')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Corporate policies & standards</h2>
              <p className="text-xs text-gray-400 mt-0.5">Formal compliance directives, ethics policies, and supplier standard specifications</p>
            </div>
            <RoleGate allow={['admin']}>
              <button
                onClick={() => setIsPolicyModalOpen(true)}
                className="bg-purple-500 hover:bg-purple-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> New Policy
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={policies}
            searchFilter={(item, q) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)}
            searchPlaceholder="Search policies..."
            columns={[
              { header: 'Title', accessor: (p) => <div className="font-semibold text-white">{p.title}</div>, sortKey: 'title' },
              { header: 'Category', accessor: (p) => <span className="text-slate-400">{p.category}</span>, sortKey: 'category' },
              { header: 'Description', accessor: (p) => <span className="text-xs text-gray-400 block max-w-sm truncate">{p.description}</span> },
              { header: 'Effective Date', accessor: (p) => <span className="font-mono text-gray-500">{p.effectiveDate}</span>, sortKey: 'effectiveDate' },
              { header: 'Status', accessor: (p) => <StatusPill status={p.status} />, sortKey: 'status' }
            ]}
            actions={(p) => {
              const alreadyAck = acknowledgements.some(
                pa => pa.policyId === p.id && pa.employeeEmail === currentUser?.email && pa.status === 'Acknowledged'
              );
              return (
                <div className="flex items-center gap-2">
                  {alreadyAck ? (
                    <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase">
                      ✓ Signed
                    </span>
                  ) : (
                    <button
                      onClick={() => (dispatch as any)(handleAcknowledgePolicyThunk(p.id, currentUser?.email || ''))}
                      className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500 hover:text-black border border-purple-500/20 text-purple-400 font-bold text-[10px] rounded uppercase transition-all"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              );
            }}
          />
        </div>
      );
    }

    if (path.endsWith('/policy-acknowledgements')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Policy Sign-off Registry</h2>
              <p className="text-xs text-gray-400 mt-0.5">Comprehensive audit trail of employee policy acknowledgements and signatures</p>
            </div>
            <span className="text-xs bg-[#0d0f14] border border-[#262b36] px-3 py-1 rounded-lg text-slate-400">
              Platform Acknowledged Index: <strong className="text-white">84%</strong>
            </span>
          </div>

          <DataTable
            data={acknowledgements}
            searchFilter={(item, q) => item.employeeName.toLowerCase().includes(q) || item.status.toLowerCase().includes(q)}
            searchPlaceholder="Search signatures..."
            columns={[
              { header: 'Employee Name', accessor: (pa) => <div className="font-semibold text-white">{pa.employeeName}</div>, sortKey: 'employeeName' },
              { header: 'Employee Email', accessor: (pa) => <span className="text-xs font-mono text-gray-400">{pa.employeeEmail}</span>, sortKey: 'employeeEmail' },
              {
                header: 'Policy Target',
                accessor: (pa) => {
                  const title = policies.find(p => p.id === pa.policyId)?.title || 'Ethical Directive';
                  return <span className="text-slate-300 font-semibold">{title}</span>;
                }
              },
              { header: 'Signed Date', accessor: (pa) => <span className="font-mono text-gray-500">{pa.acknowledgedDate || '—'}</span>, sortKey: 'acknowledgedDate' },
              { header: 'Status', accessor: (pa) => <StatusPill status={pa.status} />, sortKey: 'status' }
            ]}
            actions={(pa) => (
              <RoleGate allow={['admin', 'manager']}>
                {pa.status === 'Pending' && (
                  <button
                    onClick={() => dispatch(addToast({ message: `Signature reminder sent to ${pa.employeeName}!`, type: 'info' }))}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-500/10 rounded transition-all"
                    title="Send Reminder"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/audits')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Independent Governance Audits</h2>
              <p className="text-xs text-gray-400 mt-0.5">Formal external and internal audit schedules and findings report</p>
            </div>
            <RoleGate allow={['admin', 'manager']}>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="bg-purple-500 hover:bg-purple-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Log Audit
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={audits}
            searchFilter={(item, q) => item.title.toLowerCase().includes(q) || item.auditor.toLowerCase().includes(q)}
            searchPlaceholder="Search audits..."
            columns={[
              { header: 'Title', accessor: (a) => <div className="font-semibold text-white">{a.title}</div>, sortKey: 'title' },
              { header: 'Department', accessor: (a) => <span className="text-slate-400">{a.department}</span>, sortKey: 'department' },
              { header: 'Auditor', accessor: (a) => <span className="text-xs font-semibold text-slate-300">{a.auditor}</span>, sortKey: 'auditor' },
              { header: 'Date', accessor: (a) => <span className="font-mono text-gray-500">{a.date}</span>, sortKey: 'date' },
              { header: 'Findings summary', accessor: (a) => <span className="text-xs text-gray-400 block max-w-xs truncate">{a.findings}</span> },
              { header: 'Status', accessor: (a) => <StatusPill status={a.status} />, sortKey: 'status' }
            ]}
            actions={(a) => (
              <RoleGate allow={['admin', 'manager']}>
                <button
                  onClick={() => openRaiseIssue(a.id)}
                  className="px-2 py-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase transition-all"
                >
                  Raise Issue
                </button>
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/compliance-issues')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Compliance Issues registry</h2>
              <p className="text-xs text-gray-400 mt-0.5">Anomaly tracking, severity sorting, and due date management</p>
            </div>
            <span className="text-xs bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Active Risk: <strong className="text-white">{issues.filter(i => i.status === 'Open').length}</strong> Open Issues
            </span>
          </div>

          <DataTable
            data={issues}
            searchFilter={(item, q) => item.description.toLowerCase().includes(q) || item.owner.toLowerCase().includes(q)}
            searchPlaceholder="Search issues..."
            columns={[
              {
                header: 'Issue Anomaly',
                accessor: (i) => {
                  const isOverdue = i.status === 'Open' && i.dueDate < today;
                  return (
                    <div className="flex flex-col gap-1">
                      <span className={`font-semibold ${isOverdue ? 'text-red-400 font-bold' : 'text-white'}`}>
                        {i.description}
                      </span>
                      {isOverdue && (
                        <span className="text-[9px] bg-red-500/15 border border-red-500/25 text-red-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider max-w-max animate-pulse">
                          ⚠️ PAST DUE DATE
                        </span>
                      )}
                    </div>
                  );
                },
                sortKey: 'description'
              },
              { header: 'Severity', accessor: (i) => <StatusPill status={i.severity} />, sortKey: 'severity' },
              {
                header: 'Audit ID',
                accessor: (i) => {
                  const auditTitle = audits.find(a => a.id === i.auditId)?.title || 'Corporate Anomaly';
                  return <span className="text-slate-400">{auditTitle}</span>;
                }
              },
              { header: 'Assignee Owner', accessor: (i) => <span className="text-xs text-white font-semibold">{i.owner}</span>, sortKey: 'owner' },
              {
                header: 'Due Date',
                accessor: (i) => {
                  const isOverdue = i.status === 'Open' && i.dueDate < today;
                  return (
                    <span className={`font-mono text-xs ${isOverdue ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                      {i.dueDate}
                    </span>
                  );
                },
                sortKey: 'dueDate'
              },
              { header: 'Status', accessor: (i) => <StatusPill status={i.status} />, sortKey: 'status' }
            ]}
            actions={(i) => (
              <RoleGate allow={['admin', 'manager']}>
                {i.status === 'Open' ? (
                  <button
                    onClick={() => (dispatch as any)(handleResolveComplianceIssueThunk(i.id))}
                    className="px-2 py-1 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/20 text-green-400 font-bold text-[10px] rounded uppercase transition-all"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(deleteComplianceIssue(i.id));
                      dispatch(addToast({ message: 'Anomaly logs purged.', type: 'info' }));
                    }}
                    className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                  >
                    <Trash2Icon className="w-3.5 h-3.5" />
                  </button>
                )}
              </RoleGate>
            )}
          />
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
            <Shield className="w-5 h-5 text-purple-500" /> CORPORATE GOVERNANCE COMPLIANCE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Ethics directives, independent audit indices, and compliance-issue remediation engines
          </p>
        </div>
      </div>

      <SubTabBar tabs={subTabs} accentColor="purple" />

      <div className="p-6">
        {renderSubPageContent()}
      </div>

      {/* NEW POLICY MODAL */}
      <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title="Publish ESG Policy">
        <form onSubmit={handlePolicySubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Policy Title</label>
            <input
              type="text"
              required
              value={policyForm.title}
              onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="Supplier human rights code"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={policyForm.category}
              onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Governance Ethics">Governance Ethics</option>
              <option value="Vendor Compliance">Vendor Compliance</option>
              <option value="Social Inclusion">Social Inclusion</option>
              <option value="Environmental Ethics">Environmental Ethics</option>
              <option value="Internal Governance">Internal Governance</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Policy Scope Description</label>
            <textarea
              required
              rows={3}
              value={policyForm.description}
              onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
              placeholder="Provide policy guidelines..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Effective Date</label>
              <input
                type="date"
                required
                value={policyForm.effectiveDate}
                onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={policyForm.status}
                onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value as any })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsPolicyModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-black text-xs font-bold rounded-xl uppercase">Publish Policy</button>
          </div>
        </form>
      </Modal>

      {/* NEW AUDIT MODAL */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="Log Governance Audit">
        <form onSubmit={handleAuditSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Audit Title</label>
            <input
              type="text"
              required
              value={auditForm.title}
              onChange={(e) => setAuditForm({ ...auditForm, title: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="Q3 Vendor Emissions review"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Department</label>
              <select
                value={auditForm.department}
                onChange={(e) => setAuditForm({ ...auditForm, department: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Auditor Name</label>
              <input
                type="text"
                required
                value={auditForm.auditor}
                onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="R. Iyer"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Findings Summary</label>
            <textarea
              required
              rows={3}
              value={auditForm.findings}
              onChange={(e) => setAuditForm({ ...auditForm, findings: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
              placeholder="Detailed findings and observations..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Audit Status</label>
            <select
              value={auditForm.status}
              onChange={(e) => setAuditForm({ ...auditForm, status: e.target.value as any })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Completed">Completed</option>
              <option value="Under Review">Under Review</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-black text-xs font-bold rounded-xl uppercase">Log Audit</button>
          </div>
        </form>
      </Modal>

      {/* COMPLIANCE ISSUE RAISE MODAL */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Raise Compliance Issue Anomaly">
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Severity</label>
            <select
              value={issueForm.severity}
              onChange={(e) => setIssueForm({ ...issueForm, severity: e.target.value as any })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Anomaly Description</label>
            <textarea
              required
              rows={3}
              value={issueForm.description}
              onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none"
              placeholder="Describe the compliance failure scope..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Owner Assignee</label>
              <input
                type="text"
                required
                value={issueForm.owner}
                onChange={(e) => setIssueForm({ ...issueForm, owner: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="Marcus Vance"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Due date</label>
              <input
                type="date"
                required
                value={issueForm.dueDate}
                onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-black text-xs font-bold rounded-xl uppercase">Raise Issue Anomaly</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Trash2Icon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
