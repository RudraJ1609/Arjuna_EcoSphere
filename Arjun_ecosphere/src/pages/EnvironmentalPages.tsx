import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  RootState,
  addEmissionFactor,
  editEmissionFactor,
  deleteEmissionFactor,
  addProductProfile,
  editProductProfile,
  deleteProductProfile,
  addCarbonTransaction,
  deleteCarbonTransaction,
  addGoal,
  editGoal,
  deleteGoal,
  addToast
} from '../store';
import { SubTabBar } from '../components/SubTabBar';
import { DataTable } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { Modal } from '../components/Modal';
import { RoleGate } from '../components/RoleGate';
import { Plus, Edit, Trash2, Download, Search, Leaf, ShieldAlert, Sliders } from 'lucide-react';
import { EmissionFactor, ProductESGProfile, CarbonTransaction, EnvironmentalGoal } from '../types';

export const EnvironmentalPages: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // States
  const emissionFactors = useSelector((state: RootState) => state.emissionFactors);
  const productProfiles = useSelector((state: RootState) => state.productProfiles);
  const carbonTransactions = useSelector((state: RootState) => state.carbonTransactions);
  const goals = useSelector((state: RootState) => state.goals);
  const settings = useSelector((state: RootState) => state.settings);

  // Modal open states
  const [isFactorModalOpen, setIsFactorModalOpen] = useState(false);
  const [factorToEdit, setFactorToEdit] = useState<EmissionFactor | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductESGProfile | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<EnvironmentalGoal | null>(null);

  // Sub Tab Navigation
  const subTabs = [
    { name: 'Emission Factors', path: '/environmental/emission-factors' },
    { name: 'Product ESG Profiles', path: '/environmental/product-esg-profiles' },
    { name: 'Carbon Transactions', path: '/environmental/carbon-transactions' },
    { name: 'Environmental Goals', path: '/environmental/goals' }
  ];

  // --- EMISSION FACTOR CRUD HANDLERS ---
  const [factorForm, setFactorForm] = useState({ activityType: '', unit: '', co2PerUnit: '', source: '' });
  const openAddFactor = () => {
    setFactorToEdit(null);
    setFactorForm({ activityType: '', unit: '', co2PerUnit: '', source: '' });
    setIsFactorModalOpen(true);
  };
  const openEditFactor = (ef: EmissionFactor) => {
    setFactorToEdit(ef);
    setFactorForm({ activityType: ef.activityType, unit: ef.unit, co2PerUnit: ef.co2PerUnit.toString(), source: ef.source });
    setIsFactorModalOpen(true);
  };
  const handleFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const factorData = {
      activityType: factorForm.activityType,
      unit: factorForm.unit,
      co2PerUnit: parseFloat(factorForm.co2PerUnit) || 0.0,
      source: factorForm.source
    };

    if (factorToEdit) {
      dispatch(editEmissionFactor({ id: factorToEdit.id, ...factorData }));
      dispatch(addToast({ message: 'Emission Factor updated!', type: 'success' }));
    } else {
      dispatch(addEmissionFactor(factorData));
      dispatch(addToast({ message: 'New Emission Factor added!', type: 'success' }));
    }
    setIsFactorModalOpen(false);
  };

  // --- PRODUCT ESG PROFILE CRUD HANDLERS ---
  const [productForm, setProductForm] = useState({ productName: '', category: '', carbonFootprint: '', recyclability: '', esgRating: 'AA' as any });
  const openAddProduct = () => {
    setProductToEdit(null);
    setProductForm({ productName: '', category: '', carbonFootprint: '', recyclability: '', esgRating: 'AA' });
    setIsProductModalOpen(true);
  };
  const openEditProduct = (pp: ProductESGProfile) => {
    setProductToEdit(pp);
    setProductForm({ productName: pp.productName, category: pp.category, carbonFootprint: pp.carbonFootprint.toString(), recyclability: pp.recyclability.toString(), esgRating: pp.esgRating });
    setIsProductModalOpen(true);
  };
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      productName: productForm.productName,
      category: productForm.category,
      carbonFootprint: parseFloat(productForm.carbonFootprint) || 0.0,
      recyclability: parseFloat(productForm.recyclability) || 0,
      esgRating: productForm.esgRating
    };

    if (productToEdit) {
      dispatch(editProductProfile({ id: productToEdit.id, ...productData }));
      dispatch(addToast({ message: 'Product ESG Profile updated!', type: 'success' }));
    } else {
      dispatch(addProductProfile(productData));
      dispatch(addToast({ message: 'New Product ESG Profile added!', type: 'success' }));
    }
    setIsProductModalOpen(false);
  };

  // --- GOAL CRUD HANDLERS ---
  const [goalForm, setGoalForm] = useState({ name: '', department: 'Manufacturing', targetCO2: '', currentCO2: '', deadline: '', status: 'Active' as any });
  const openAddGoal = () => {
    setGoalToEdit(null);
    setGoalForm({ name: '', department: 'Manufacturing', targetCO2: '', currentCO2: '', deadline: '', status: 'Active' });
    setIsGoalModalOpen(true);
  };
  const openEditGoal = (g: EnvironmentalGoal) => {
    setGoalToEdit(g);
    setGoalForm({ name: g.name, department: g.department, targetCO2: g.targetCO2.toString(), currentCO2: g.currentCO2.toString(), deadline: g.deadline, status: g.status });
    setIsGoalModalOpen(true);
  };
  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = {
      name: goalForm.name,
      department: goalForm.department,
      targetCO2: parseInt(goalForm.targetCO2) || 100,
      currentCO2: parseInt(goalForm.currentCO2) || 0,
      deadline: goalForm.deadline,
      status: goalForm.status
    };

    if (goalToEdit) {
      dispatch(editGoal({ id: goalToEdit.id, ...goalData }));
      dispatch(addToast({ message: 'Goal updated!', type: 'success' }));
    } else {
      dispatch(addGoal(goalData));
      dispatch(addToast({ message: 'New Goal registered!', type: 'success' }));
    }
    setIsGoalModalOpen(false);
  };

  // --- CARBON LOG HANDLER ---
  const [txForm, setTxForm] = useState({ department: currentUser?.department || 'Manufacturing', sourceType: 'Manufacturing' as any, factorId: 'ef1', quantity: '' });
  const handleTxLog = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(txForm.quantity);
    if (isNaN(qty) || qty <= 0) {
      dispatch(addToast({ message: 'Please enter a valid quantity!', type: 'error' }));
      return;
    }
    dispatch(addCarbonTransaction({
      department: txForm.department,
      sourceType: txForm.sourceType,
      emissionFactorId: txForm.factorId,
      quantity: qty,
      date: new Date().toISOString().split('T')[0],
      autoGenerated: false
    }));
    dispatch(addToast({ message: 'Transaction logged manually!', type: 'success' }));
    setIsTransactionModalOpen(false);
    setTxForm({ ...txForm, quantity: '' });
  };

  // Render sub-view helper
  const renderSubPageContent = () => {
    const path = location.pathname;

    if (path.endsWith('/emission-factors')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Emission Factors master database</h2>
              <p className="text-xs text-gray-400 mt-0.5">Used during auto-calculations of scope-1 and scope-2 emissions</p>
            </div>
            <RoleGate allow={['admin']}>
              <button
                onClick={openAddFactor}
                className="bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Add Factor
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={emissionFactors}
            searchFilter={(item, q) => item.activityType.toLowerCase().includes(q) || item.source.toLowerCase().includes(q)}
            searchPlaceholder="Search factors (e.g. Electricity, Natural Gas)..."
            columns={[
              { header: 'Activity Type', accessor: (ef) => <div className="font-semibold text-white">{ef.activityType}</div>, sortKey: 'activityType' },
              { header: 'Unit', accessor: (ef) => <span className="font-mono text-gray-400">{ef.unit}</span> },
              { header: 'CO2 Per Unit', accessor: (ef) => <span className="font-mono text-green-400 font-bold">{ef.co2PerUnit} kg</span>, sortKey: 'co2PerUnit' },
              { header: 'Database Source', accessor: (ef) => <span className="text-xs text-slate-400">{ef.source}</span> }
            ]}
            actions={(ef) => (
              <RoleGate allow={['admin']}>
                <button
                  onClick={() => openEditFactor(ef)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-slate-500/10 rounded transition-colors"
                  title="Edit Factor"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    dispatch(deleteEmissionFactor(ef.id));
                    dispatch(addToast({ message: 'Factor deleted.', type: 'info' }));
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete Factor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </RoleGate>
            )}
          />
        </div>
      );
    }

    if (path.endsWith('/product-esg-profiles')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Product ESG Profiles</h2>
              <p className="text-xs text-gray-400 mt-0.5">Carbon footprints and recyclability indicators linked to enterprise inventory</p>
            </div>
            <RoleGate allow={['admin']}>
              <button
                onClick={openAddProduct}
                className="bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Create Profile
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={productProfiles}
            searchFilter={(item, q) => item.productName.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)}
            searchPlaceholder="Search profiles (e.g. EcoBox, SolarCharge)..."
            columns={[
              { header: 'Product Name', accessor: (p) => <div className="font-semibold text-white">{p.productName}</div>, sortKey: 'productName' },
              { header: 'Category', accessor: (p) => <span className="text-slate-400">{p.category}</span>, sortKey: 'category' },
              { header: 'Carbon Footprint', accessor: (p) => <span className="font-mono text-green-400 font-bold">{p.carbonFootprint} kg CO2e</span>, sortKey: 'carbonFootprint' },
              {
                header: 'Recyclability',
                accessor: (p) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-[#0d0f14] h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${p.recyclability}%` }}></div>
                    </div>
                    <span className="font-mono font-bold text-white text-[10px]">{p.recyclability}%</span>
                  </div>
                ),
                sortKey: 'recyclability'
              },
              { header: 'ESG Rating', accessor: (p) => <StatusPill status={p.esgRating} />, sortKey: 'esgRating' }
            ]}
            actions={(p) => (
              <RoleGate allow={['admin']}>
                <button
                  onClick={() => openEditProduct(p)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-slate-500/10 rounded transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    dispatch(deleteProductProfile(p.id));
                    dispatch(addToast({ message: 'Profile deleted.', type: 'info' }));
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

    if (path.endsWith('/carbon-transactions')) {
      const activeAutoCalc = settings.autoEmissionCalculation;

      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Carbon Transactions Ledger</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  activeAutoCalc ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  Auto-Calculation: {activeAutoCalc ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeAutoCalc
                  ? 'New transactional records calculate emissions instantly using pre-configured factors.'
                  : 'Manual emissions input and factor assignments required.'}
              </p>
            </div>
            <RoleGate allow={['admin', 'manager']}>
              <button
                onClick={() => setIsTransactionModalOpen(true)}
                disabled={activeAutoCalc}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  activeAutoCalc
                    ? 'bg-slate-700 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-green-500 hover:bg-green-600 text-black cursor-pointer'
                }`}
                title={activeAutoCalc ? 'Disabled while Auto Calculation is ON' : 'Log Carbon Transaction'}
              >
                <Plus className="w-4 h-4" /> Log Carbon Data
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={carbonTransactions}
            searchFilter={(item, q) => item.department.toLowerCase().includes(q) || item.sourceType.toLowerCase().includes(q)}
            searchPlaceholder="Search transactions (e.g. Fleet, manufacturing)..."
            columns={[
              { header: 'Date', accessor: (ct) => <span className="font-mono text-gray-400">{ct.date}</span>, sortKey: 'date' },
              { header: 'Department', accessor: (ct) => <span className="font-semibold text-white">{ct.department}</span>, sortKey: 'department' },
              { header: 'Source Type', accessor: (ct) => <StatusPill status={ct.sourceType} />, sortKey: 'sourceType' },
              {
                header: 'Emission Factor',
                accessor: (ct) => {
                  const facName = emissionFactors.find(f => f.id === ct.emissionFactorId)?.activityType || 'Custom';
                  return <span className="text-xs text-slate-300">{facName}</span>;
                }
              },
              { header: 'Qty', accessor: (ct) => <span className="font-mono text-gray-400 font-bold">{ct.quantity}</span>, sortKey: 'quantity' },
              { header: 'CO2 Output', accessor: (ct) => <span className="font-mono text-red-400 font-bold">+{ct.co2Calculated} kg</span>, sortKey: 'co2Calculated' },
              {
                header: 'Generation Method',
                accessor: (ct) => (
                  <span className={`text-[10px] font-semibold ${ct.autoGenerated ? 'text-green-400' : 'text-blue-400'}`}>
                    {ct.autoGenerated ? '🤖 Auto' : '👤 Manual'}
                  </span>
                ),
                sortKey: 'autoGenerated'
              }
            ]}
            actions={(ct) => (
              <RoleGate allow={['admin']}>
                <button
                  onClick={() => {
                    dispatch(deleteCarbonTransaction(ct.id));
                    dispatch(addToast({ message: 'Transaction record removed.', type: 'info' }));
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

    if (path.endsWith('/goals')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#161a22] p-4 rounded-xl border border-[#262b36]">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Environmental Sustainability Goals</h2>
              <p className="text-xs text-gray-400 mt-0.5">Corporate threshold tracking and emission-reduction targets per department</p>
            </div>
            <RoleGate allow={['admin', 'manager']}>
              <button
                onClick={openAddGoal}
                className="bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> + New Goal
              </button>
            </RoleGate>
          </div>

          <DataTable
            data={goals}
            searchFilter={(item, q) => item.name.toLowerCase().includes(q) || item.department.toLowerCase().includes(q)}
            searchPlaceholder="Search goals (e.g. reduce fleet, cutting waste)..."
            columns={[
              { header: 'Goal Name', accessor: (g) => <div className="font-semibold text-white">{g.name}</div>, sortKey: 'name' },
              { header: 'Department', accessor: (g) => <span className="text-slate-400">{g.department}</span>, sortKey: 'department' },
              { header: 'Target co2', accessor: (g) => <span className="font-mono font-bold text-green-400">{g.targetCO2} t</span>, sortKey: 'targetCO2' },
              { header: 'Current co2', accessor: (g) => <span className="font-mono font-bold text-red-400">{g.currentCO2} t</span>, sortKey: 'currentCO2' },
              {
                header: 'Progress',
                accessor: (g) => {
                  const pct = Math.min(Math.round((g.currentCO2 / (g.targetCO2 || 1)) * 100), 100);
                  // Progress color based on goal completion or threat
                  let barColor = 'bg-green-500';
                  if (g.status === 'At Risk') barColor = 'bg-red-500';
                  else if (g.status === 'On Track') barColor = 'bg-yellow-500';
                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#0d0f14] h-2 rounded-full overflow-hidden">
                        <div className={`${barColor} h-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="font-mono font-bold text-white text-[10px]">{pct}%</span>
                    </div>
                  );
                }
              },
              { header: 'Deadline', accessor: (g) => <span className="font-mono text-gray-400">{g.deadline}</span>, sortKey: 'deadline' },
              { header: 'Status', accessor: (g) => <StatusPill status={g.status} />, sortKey: 'status' }
            ]}
            actions={(g) => (
              <RoleGate allow={['admin', 'manager']}>
                <button
                  onClick={() => openEditGoal(g)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-slate-500/10 rounded transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    dispatch(deleteGoal(g.id));
                    dispatch(addToast({ message: 'Goal removed.', type: 'info' }));
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

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Module Title Chrome bar */}
      <div className="p-6 border-b border-[#262b36] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" /> ENVIRONMENTAL COMPLIANCE MODULE
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Carbon accounting, greenhouse gas inventory, and corporate sustainability threshold indexes
          </p>
        </div>
      </div>

      {/* Persistent Module Tabs */}
      <SubTabBar tabs={subTabs} accentColor="green" />

      {/* Render sub-page */}
      <div className="p-6">
        {renderSubPageContent()}
      </div>

      {/* 1. EMISSION FACTOR MODAL */}
      <Modal isOpen={isFactorModalOpen} onClose={() => setIsFactorModalOpen(false)} title={factorToEdit ? 'Edit Emission Factor' : 'Add Emission Factor'}>
        <form onSubmit={handleFactorSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Activity Type</label>
            <input
              type="text"
              required
              value={factorForm.activityType}
              onChange={(e) => setFactorForm({ ...factorForm, activityType: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="e.g. Methane leaks"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Unit</label>
              <input
                type="text"
                required
                value={factorForm.unit}
                onChange={(e) => setFactorForm({ ...factorForm, unit: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. kg, liters"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">CO2 Per Unit (kg)</label>
              <input
                type="number"
                required
                step="any"
                value={factorForm.co2PerUnit}
                onChange={(e) => setFactorForm({ ...factorForm, co2PerUnit: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="e.g. 2.68"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Database Source reference</label>
            <input
              type="text"
              required
              value={factorForm.source}
              onChange={(e) => setFactorForm({ ...factorForm, source: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="e.g. DEFRA 2026 guidelines"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsFactorModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-xl uppercase">Save</button>
          </div>
        </form>
      </Modal>

      {/* 2. PRODUCT PROFILE MODAL */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={productToEdit ? 'Edit ESG Product Profile' : 'Create ESG Product Profile'}>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={productForm.productName}
              onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="SustainaWrap Container"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
            <input
              type="text"
              required
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="Packaging Materials"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">CO2 Carbon Footprint</label>
              <input
                type="number"
                step="any"
                required
                value={productForm.carbonFootprint}
                onChange={(e) => setProductForm({ ...productForm, carbonFootprint: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="0.25 kg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Recyclability %</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={productForm.recyclability}
                onChange={(e) => setProductForm({ ...productForm, recyclability: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">ESG Rating Index</label>
            <select
              value={productForm.esgRating}
              onChange={(e) => setProductForm({ ...productForm, esgRating: e.target.value as any })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="AAA">AAA (Leader)</option>
              <option value="AA">AA (Leader)</option>
              <option value="A">A (Strong)</option>
              <option value="BBB">BBB (Average)</option>
              <option value="BB">BB (Average)</option>
              <option value="B">B (Laggard)</option>
              <option value="CCC">CCC (Critical)</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-xl uppercase">Save</button>
          </div>
        </form>
      </Modal>

      {/* 3. CARBON TRANSACTION MANUAL DIALOG */}
      <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} title="Log Carbon Transaction">
        <form onSubmit={handleTxLog} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Logging Department</label>
            <select
              value={txForm.department}
              onChange={(e) => setTxForm({ ...txForm, department: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Manufacturing">Manufacturing</option>
              <option value="Logistics">Logistics</option>
              <option value="Corporate">Corporate</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Research & Development">Research & Development</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Source Type Category</label>
            <select
              value={txForm.sourceType}
              onChange={(e) => setTxForm({ ...txForm, sourceType: e.target.value as any })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Manufacturing">Manufacturing</option>
              <option value="Purchase">Purchase & Assets</option>
              <option value="Fleet">Logistics Fleet</option>
              <option value="Expense">Office Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Emission Factor Link</label>
            <select
              value={txForm.factorId}
              onChange={(e) => setTxForm({ ...txForm, factorId: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              {emissionFactors.map(ef => (
                <option key={ef.id} value={ef.id}>{ef.activityType} ({ef.unit})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quantity consumed</label>
            <input
              type="number"
              required
              step="any"
              value={txForm.quantity}
              onChange={(e) => setTxForm({ ...txForm, quantity: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="e.g. 3500"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsTransactionModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-xl uppercase">Add transaction</button>
          </div>
        </form>
      </Modal>

      {/* 4. GOAL MODAL */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={goalToEdit ? 'Edit Sustainability Goal' : 'Register Sustainability Goal'}>
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Goal Title</label>
            <input
              type="text"
              required
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              placeholder="Cut electricity consumption by 15%"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Responsible Department</label>
            <select
              value={goalForm.department}
              onChange={(e) => setGoalForm({ ...goalForm, department: e.target.value })}
              className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Manufacturing">Manufacturing</option>
              <option value="Logistics">Logistics</option>
              <option value="Corporate">Corporate</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Research & Development">Research & Development</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target (Metric Tonnes)</label>
              <input
                type="number"
                required
                value={goalForm.targetCO2}
                onChange={(e) => setGoalForm({ ...goalForm, targetCO2: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Progress</label>
              <input
                type="number"
                required
                value={goalForm.currentCO2}
                onChange={(e) => setGoalForm({ ...goalForm, currentCO2: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                placeholder="200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Deadline</label>
              <input
                type="date"
                required
                value={goalForm.deadline}
                onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status Pill</label>
              <select
                value={goalForm.status}
                onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value as any })}
                className="w-full bg-[#0d0f14] border border-[#262b36] rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="On Track">On Track</option>
                <option value="Completed">Completed</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-[#262b36]">
            <button type="button" onClick={() => setIsGoalModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-xl uppercase">Save goal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
