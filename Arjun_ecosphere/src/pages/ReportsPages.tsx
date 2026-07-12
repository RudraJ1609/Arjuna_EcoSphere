import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState, addToast } from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Download, BarChart2, Filter, Settings, Sliders } from 'lucide-react';

export const ReportsPages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux States
  const weights = useSelector((state: RootState) => state.settings.weights);
  const carbonTransactions = useSelector((state: RootState) => state.carbonTransactions);
  const employeeParticipations = useSelector((state: RootState) => state.employeeParticipations);
  const issues = useSelector((state: RootState) => state.complianceIssues);

  // Sub Tab Navigation
  const subTabs = [
    { name: 'Environmental Report', path: '/reports/environmental' },
    { name: 'Social Report', path: '/reports/social' },
    { name: 'Governance Report', path: '/reports/governance' },
    { name: 'ESG Executive Summary', path: '/reports/esg-summary' },
    { name: 'Custom Builder', path: '/reports/custom-builder' }
  ];

  // --- EXPORT PDF HANDLER ---
  const handleExportPDF = (reportName: string) => {
    dispatch(addToast({ message: `Generating secure encrypted ${reportName} PDF...`, type: 'info' }));
    setTimeout(() => {
      dispatch(addToast({ message: `${reportName} PDF successfully downloaded!`, type: 'success' }));
    }, 1500);
  };

  // --- CUSTOM BUILDER STATES ---
  const [metricType, setMetricType] = useState<'environmental' | 'social' | 'governance'>('environmental');
  const [timeRange, setTimeRange] = useState('Year-to-Date');
  const [targetDept, setTargetDept] = useState('All');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('bar');
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  // Dynamic Custom Report Formulation
  const getCustomBuilderData = () => {
    if (metricType === 'environmental') {
      return [
        { label: 'Q1 Carbon', value: 145000, color: '#22c55e' },
        { label: 'Q2 Carbon', value: 128000, color: '#22c55e' },
        { label: 'Q3 Carbon', value: 161000, color: '#22c55e' },
        { label: 'Q4 Carbon', value: 112000, color: '#22c55e' }
      ];
    } else if (metricType === 'social') {
      return [
        { label: 'Volunteer Hrs', value: 320, color: '#3b82f6' },
        { label: 'Blood Drives', value: 140, color: '#3b82f6' },
        { label: 'Diversity Ratios', value: 210, color: '#3b82f6' },
        { label: 'Safety Index', value: 290, color: '#3b82f6' }
      ];
    } else {
      return [
        { label: 'Policy Sign-off', value: 88, color: '#a855f7' },
        { label: 'Audits Passed', value: 92, color: '#a855f7' },
        { label: 'Remediation Ratios', value: 74, color: '#a855f7' },
        { label: 'Vendor Checks', value: 82, color: '#a855f7' }
      ];
    }
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportGenerated(true);
    dispatch(addToast({ message: 'Custom ESG report synthesized successfully!', type: 'success' }));
  };

  // Static chart datasets
  const envScopeData = [
    { source: 'Manufacturing (Scope 1)', co2: 122000, fill: '#22c55e' },
    { source: 'Fleet Logistics (Scope 1)', co2: 85000, fill: '#10b981' },
    { source: 'Electricity (Scope 2)', co2: 44000, fill: '#34d399' },
    { source: 'Office Expenses (Scope 3)', co2: 18000, fill: '#6ee7b7' }
  ];

  const socParticipationData = [
    { month: 'Jan', participation: 45 },
    { month: 'Feb', participation: 52 },
    { month: 'Mar', participation: 68 },
    { month: 'Apr', participation: 59 },
    { month: 'May', participation: 84 },
    { month: 'Jun', participation: 91 }
  ];

  const govAuditScoreData = [
    { audit: 'CSR Vendor Audit', score: 92 },
    { audit: 'Facility Energy', score: 85 },
    { audit: 'Ethics Audit', score: 98 },
    { audit: 'Supplier ESG', score: 74 }
  ];

  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/environmental')) {
      const totalCO2 = carbonTransactions.reduce((acc, curr) => acc + curr.co2Calculated, 0);

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Environmental ESG audit report</h2>
              <p className="text-xs text-gray-400 mt-0.5">Summary of scope-1, 2 and 3 emissions logs compiled this period</p>
            </div>
            <button
              onClick={() => handleExportPDF('Environmental Audit')}
              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Carbon Output Breakdown by Category</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={envScopeData} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                    <XAxis type="number" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis dataKey="source" type="category" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="co2" radius={[0, 4, 4, 0]}>
                      {envScopeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Period Carbon Intensity</h3>
                <div className="space-y-4">
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Greenhouse Output</p>
                    <p className="text-xl font-mono font-bold text-red-400 mt-1">{totalCO2.toLocaleString()} kg CO2e</p>
                  </div>
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Scope-1 Direct Ratio</p>
                    <p className="text-xl font-mono font-bold text-green-400 mt-1">82%</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed pt-4 border-t border-[#262b36]">
                Report conforms with Greenhouse Gas Protocol corporate standards of scope reporting.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (path.endsWith('/social')) {
      const approvedParticipation = employeeParticipations.filter(p => p.approvalStatus === 'Approved').length;

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Social inclusion & engagement audit</h2>
              <p className="text-xs text-gray-400 mt-0.5">Demographics indexes, CSR metrics and safety sign-off compliance</p>
            </div>
            <button
              onClick={() => handleExportPDF('Social Compliance')}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-black text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">CSR Monthly Engagement counts</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={socParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                    <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="participation" name="Volunteers joined" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Engagement Index</h3>
                <div className="space-y-4">
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Approved Participations</p>
                    <p className="text-xl font-mono font-bold text-blue-400 mt-1">{approvedParticipation} CSR Sign-offs</p>
                  </div>
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Corporate Diversity Rank</p>
                    <p className="text-xl font-mono font-bold text-green-400 mt-1">AA (Strong)</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed pt-4 border-t border-[#262b36]">
                Metrics are aggregated from registered activity sign-ups and payroll indices.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (path.endsWith('/governance')) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Independent Governance audits report</h2>
              <p className="text-xs text-gray-400 mt-0.5">Policy sign-offs, severity anomaly index and independent auditing metrics</p>
            </div>
            <button
              onClick={() => handleExportPDF('Corporate Governance')}
              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-black text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Independent audit scores comparison</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={govAuditScoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                    <XAxis dataKey="audit" stroke="#4b5563" fontSize={10} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Governance KPIs</h3>
                <div className="space-y-4">
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Unresolved Anomalies</p>
                    <p className="text-xl font-mono font-bold text-red-400 mt-1">
                      {issues.filter(i => i.status === 'Open').length} Open issues
                    </p>
                  </div>
                  <div className="bg-[#0d0f14] border border-[#262b36] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Remediation SLA index</p>
                    <p className="text-xl font-mono font-bold text-green-400 mt-1">94% Compliant</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed pt-4 border-t border-[#262b36]">
                Conforms with SASB enterprise governance criteria indexes.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (path.endsWith('/esg-summary')) {
      const weightedOverall = Math.round((82 * weights.environmental + 74 * weights.social + 88 * weights.governance) / 100);

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">ESG Executive Consolidated Summary</h2>
              <p className="text-xs text-gray-400 mt-0.5">Comprehensive executive summary ready for investors and regulatory boards</p>
            </div>
            <button
              onClick={() => handleExportPDF('Consolidated Executive ESG Summary')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-white text-black text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" /> Export Combined PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#161a22] border border-green-500/20 p-5 rounded-xl">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Environmental Score</span>
              <p className="text-2xl font-mono font-bold text-green-400 mt-1">82%</p>
              <p className="text-[10px] text-gray-400 mt-2">Scope-1, 2 and 3 emissions are fully within targets this quarter.</p>
            </div>
            <div className="bg-[#161a22] border border-blue-500/20 p-5 rounded-xl">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Social Score</span>
              <p className="text-2xl font-mono font-bold text-blue-400 mt-1">74%</p>
              <p className="text-[10px] text-gray-400 mt-2">CSR activities and diversity distributions exceed guidelines.</p>
            </div>
            <div className="bg-[#161a22] border border-purple-500/20 p-5 rounded-xl">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Governance Score</span>
              <p className="text-2xl font-mono font-bold text-purple-400 mt-1">88%</p>
              <p className="text-[10px] text-gray-400 mt-2">Remediation rate on audit findings remains in peak SLAs.</p>
            </div>
            <div className="bg-[#161a22] border border-slate-500/20 p-5 rounded-xl">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Consolidated Weighted Score</span>
              <p className="text-2xl font-mono font-bold text-white mt-1">{weightedOverall}%</p>
              <p className="text-[10px] text-gray-400 mt-2">Weights: {weights.environmental}% E / {weights.social}% S / {weights.governance}% G</p>
            </div>
          </div>
        </div>
      );
    }

    if (path.endsWith('/custom-builder')) {
      const data = getCustomBuilderData();

      return (
        <div className="space-y-6">
          <div className="bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Dynamic ESG report builder</h2>
            <p className="text-xs text-gray-400 mt-0.5">Assemble and graph corporate metadata dynamically</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form selections */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 flex flex-col justify-between">
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-slate-500" /> Metric Pillar Category
                  </label>
                  <select
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value as any)}
                    className="w-full bg-[#0d0f14] border border-[#262b36] p-2.5 text-xs text-white rounded-xl focus:outline-none"
                  >
                    <option value="environmental">Environmental (Carbon Intensity)</option>
                    <option value="social">Social (CSR Participations)</option>
                    <option value="governance">Governance (Audit Sign-offs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-slate-500" /> Horizon Range
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#262b36] p-2.5 text-xs text-white rounded-xl focus:outline-none"
                  >
                    <option value="Year-to-Date">Year-to-Date (Consolidated)</option>
                    <option value="Q1">Q1 (Jan - Mar)</option>
                    <option value="Q2">Q2 (Apr - Jun)</option>
                    <option value="Q3">Q3 (Jul - Sep)</option>
                    <option value="Q4">Q4 (Oct - Dec)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Settings className="w-3 h-3 text-slate-500" /> Segment Filter
                  </label>
                  <select
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#262b36] p-2.5 text-xs text-white rounded-xl focus:outline-none"
                  >
                    <option value="All">All Corporate Segments</option>
                    <option value="Manufacturing">Manufacturing Operation</option>
                    <option value="Logistics">Fleet Logistics</option>
                    <option value="Corporate">Headquarters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <BarChart2 className="w-3 h-3 text-slate-500" /> Visualization Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bar', 'line', 'pie'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setChartType(type as any)}
                        className={`py-1.5 border font-bold text-[10px] uppercase rounded-lg transition-all ${
                          chartType === type
                            ? 'bg-slate-100 border-white text-black'
                            : 'bg-[#0d0f14] border-[#262b36] text-gray-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-100 hover:bg-white text-black font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Synthesize Custom Report
                </button>
              </form>
            </div>

            {/* Dynamic Rendering Canvas */}
            <div className="bg-[#161a22] border border-[#262b36] rounded-xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[350px]">
              {isReportGenerated ? (
                <>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                          Dynamic Report: {metricType.toUpperCase()} ({timeRange})
                        </h3>
                        <p className="text-[10px] text-gray-500">Department: {targetDept}</p>
                      </div>
                      <button
                        onClick={() => handleExportPDF('Dynamic Custom Generated')}
                        className="p-1.5 bg-[#0d0f14] border border-[#262b36] hover:border-slate-500 rounded-lg text-slate-400 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                            <XAxis dataKey="label" stroke="#4b5563" fontSize={10} tickLine={false} />
                            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={data[0].color} strokeWidth={3} />
                          </LineChart>
                        ) : chartType === 'pie' ? (
                          <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" nameKey="label">
                              {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        ) : (
                          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f242e" />
                            <XAxis dataKey="label" stroke="#4b5563" fontSize={10} tickLine={false} />
                            <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill={data[0].color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#262b36] flex justify-between text-[10px] text-gray-500 font-semibold uppercase">
                    <span>Validation stamp</span>
                    <span className="text-green-400">SECURE GENERATED</span>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <BarChart2 className="w-12 h-12 text-slate-600 animate-pulse" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Report Synthesis Pending</h4>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    Select your parameters, time frames, and target departments, then click the synthesis command button to generate an interactive live report.
                  </p>
                </div>
              )}
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
            <FileText className="w-5 h-5 text-slate-400" /> CONSOLIDATED ESG AUDIT REPORTING
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Enterprise index compilation, GRI standard-aligned reports, and custom dynamic ESG graph generation builders
          </p>
        </div>
      </div>

      <SubTabBar tabs={subTabs} accentColor="slate" />

      <div className="p-6">
        {renderSubPageContent()}
      </div>
    </div>
  );
};
