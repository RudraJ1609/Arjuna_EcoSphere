import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  initialUsers,
  initialDepartments,
  initialCategories,
  initialEmissionFactors,
  initialProductProfiles,
  initialGoals,
  initialPolicies,
  initialBadges,
  initialRewards,
  initialCarbonTransactions,
  initialCSRActivities,
  initialEmployeeParticipations,
  initialChallenges,
  initialChallengeParticipations,
  initialPolicyAcknowledgements,
  initialAudits,
  initialComplianceIssues,
  initialNotifications
} from './mockData';
import {
  User,
  Department,
  Category,
  EmissionFactor,
  ProductESGProfile,
  EnvironmentalGoal,
  ESGPolicy,
  Badge,
  Reward,
  CarbonTransaction,
  CSRActivity,
  EmployeeParticipation,
  Challenge,
  ChallengeParticipation,
  PolicyAcknowledgement,
  Audit,
  ComplianceIssue,
  AppNotification
} from '../types';

// Helper to check for badge auto-award
const checkBadgeAutoAward = (
  user: User,
  badges: Badge[],
  completedChallengesCount: number,
  approvedCSRCount: number,
  resolvedIssuesCount: number,
  addNotification: (title: string, message: string, type: 'badge') => void
): string[] => {
  const newBadges = [...user.badges];
  let updated = false;

  badges.forEach((badge) => {
    if (newBadges.includes(badge.id)) return;

    let eligible = false;
    if (badge.id === 'b1' && user.xp >= 100) eligible = true;
    else if (badge.id === 'b2' && completedChallengesCount >= 1) eligible = true;
    else if (badge.id === 'b3' && user.xp >= 2000) eligible = true;
    else if (badge.id === 'b4' && approvedCSRCount >= 2) eligible = true;
    else if (badge.id === 'b5' && resolvedIssuesCount >= 1) eligible = true;

    if (eligible) {
      newBadges.push(badge.id);
      updated = true;
      addNotification(
        'Badge Unlocked!',
        `Congratulations! You've unlocked the "${badge.name}" badge.`,
        'badge'
      );
    }
  });

  return newBadges;
};

// 1. AUTH SLICE
const savedUser = typeof window !== 'undefined' ? localStorage.getItem('ecosphere_user') : null;
const initialCurrentUser = savedUser ? JSON.parse(savedUser) : null;
const initialIsAuthenticated = !!savedUser;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: initialCurrentUser as User | null,
    users: initialUsers,
    isAuthenticated: initialIsAuthenticated,
    error: null as string | null,
    loading: false
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<{ email: string; role?: 'admin' | 'manager' | 'user' }>) => {
      const user = state.users.find(u => u.email === action.payload.email);
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecosphere_user', JSON.stringify(user));
          localStorage.setItem('ecosphere_token', 'local_bypass_token');
        }
      } else {
        state.error = 'Invalid credentials';
      }
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecosphere_user', JSON.stringify(action.payload.user));
        localStorage.setItem('ecosphere_token', action.payload.token);
      }
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ecosphere_user');
        localStorage.removeItem('ecosphere_token');
      }
    },
    switchUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find(u => u.id === action.payload);
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecosphere_user', JSON.stringify(user));
        }
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        const index = state.users.findIndex(u => u.id === state.currentUser.id);
        const updated = { ...state.currentUser, ...action.payload };
        state.currentUser = updated;
        if (index !== -1) {
          state.users[index] = updated;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecosphere_user', JSON.stringify(updated));
        }
      }
    },
    updateXPAndPoints: (state, action: PayloadAction<{ userId: string; xpToAdd: number; pointsToAdd: number }>) => {
      const userIndex = state.users.findIndex(u => u.id === action.payload.userId);
      if (userIndex !== -1) {
        state.users[userIndex].xp += action.payload.xpToAdd;
        state.users[userIndex].points += action.payload.pointsToAdd;
        if (state.currentUser && state.currentUser.id === action.payload.userId) {
          state.currentUser.xp = state.users[userIndex].xp;
          state.currentUser.points = state.users[userIndex].points;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ecosphere_user', JSON.stringify(state.currentUser));
          }
        }
      }
    },
    awardBadgesToUser: (state, action: PayloadAction<{ userId: string; badgeIds: string[] }>) => {
      const userIndex = state.users.findIndex(u => u.id === action.payload.userId);
      if (userIndex !== -1) {
        const uniqueBadges = Array.from(new Set([...state.users[userIndex].badges, ...action.payload.badgeIds]));
        state.users[userIndex].badges = uniqueBadges;
        if (state.currentUser && state.currentUser.id === action.payload.userId) {
          state.currentUser.badges = uniqueBadges;
          if (typeof window !== 'undefined') {
            localStorage.setItem('ecosphere_user', JSON.stringify(state.currentUser));
          }
        }
      }
    }
  }
});

// 2. DEPARTMENTS SLICE
const departmentsSlice = createSlice({
  name: 'departments',
  initialState: initialDepartments,
  reducers: {
    addDepartment: (state, action: PayloadAction<Omit<Department, 'id'>>) => {
      const newId = `d${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      return state.filter(d => d.id !== action.payload);
    }
  }
});

// 3. CATEGORIES SLICE
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialCategories,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newId = `c${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editCategory: (state, action: PayloadAction<Category>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      return state.filter(c => c.id !== action.payload);
    }
  }
});

// 4. EMISSION FACTORS SLICE
const emissionFactorSlice = createSlice({
  name: 'emissionFactors',
  initialState: initialEmissionFactors,
  reducers: {
    addEmissionFactor: (state, action: PayloadAction<Omit<EmissionFactor, 'id'>>) => {
      const newId = `ef${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editEmissionFactor: (state, action: PayloadAction<EmissionFactor>) => {
      const index = state.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteEmissionFactor: (state, action: PayloadAction<string>) => {
      return state.filter(e => e.id !== action.payload);
    }
  }
});

// 5. PRODUCT PROFILES SLICE
const productProfileSlice = createSlice({
  name: 'productProfiles',
  initialState: initialProductProfiles,
  reducers: {
    addProductProfile: (state, action: PayloadAction<Omit<ProductESGProfile, 'id'>>) => {
      const newId = `pp${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editProductProfile: (state, action: PayloadAction<ProductESGProfile>) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteProductProfile: (state, action: PayloadAction<string>) => {
      return state.filter(p => p.id !== action.payload);
    }
  }
});

// 6. GOALS SLICE
const goalSlice = createSlice({
  name: 'goals',
  initialState: initialGoals,
  reducers: {
    addGoal: (state, action: PayloadAction<Omit<EnvironmentalGoal, 'id'>>) => {
      const newId = `g${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editGoal: (state, action: PayloadAction<EnvironmentalGoal>) => {
      const index = state.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      return state.filter(g => g.id !== action.payload);
    }
  }
});

// 7. CARBON TRANSACTIONS SLICE
const carbonTransactionSlice = createSlice({
  name: 'carbonTransactions',
  initialState: initialCarbonTransactions,
  reducers: {
    addCarbonTransaction: (state, action: PayloadAction<Omit<CarbonTransaction, 'id' | 'co2Calculated'>>) => {
      const newId = `ct${state.length + 1}`;
      // Calculating CO2
      const efId = action.payload.emissionFactorId;
      const factor = initialEmissionFactors.find(f => f.id === efId)?.co2PerUnit || 1.0;
      const co2Calculated = Math.round(action.payload.quantity * factor * 100) / 100;
      state.push({ id: newId, ...action.payload, co2Calculated });
    },
    deleteCarbonTransaction: (state, action: PayloadAction<string>) => {
      return state.filter(ct => ct.id !== action.payload);
    }
  }
});

// 8. CSR ACTIVITIES SLICE
const csrActivitySlice = createSlice({
  name: 'csrActivities',
  initialState: initialCSRActivities,
  reducers: {
    addCSRActivity: (state, action: PayloadAction<Omit<CSRActivity, 'id' | 'joinedCount'>>) => {
      const newId = `csr${state.length + 1}`;
      state.push({ id: newId, ...action.payload, joinedCount: 0 });
    },
    editCSRActivity: (state, action: PayloadAction<CSRActivity>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCSRActivity: (state, action: PayloadAction<string>) => {
      return state.filter(c => c.id !== action.payload);
    },
    incrementJoinedCount: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(c => c.id === action.payload);
      if (index !== -1) {
        state[index].joinedCount += 1;
      }
    }
  }
});

// 9. EMPLOYEE PARTICIPATIONS SLICE
const employeeParticipationSlice = createSlice({
  name: 'employeeParticipations',
  initialState: initialEmployeeParticipations,
  reducers: {
    addParticipation: (state, action: PayloadAction<Omit<EmployeeParticipation, 'id' | 'approvalStatus'>>) => {
      const newId = `ep${state.length + 1}`;
      state.push({ id: newId, ...action.payload, approvalStatus: 'Pending' });
    },
    approveParticipation: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        state[index].approvalStatus = 'Approved';
        state[index].completionDate = new Date().toISOString().split('T')[0];
      }
    },
    rejectParticipation: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        state[index].approvalStatus = 'Rejected';
      }
    }
  }
});

// 10. CHALLENGES SLICE
const challengeSlice = createSlice({
  name: 'challenges',
  initialState: initialChallenges,
  reducers: {
    addChallenge: (state, action: PayloadAction<Omit<Challenge, 'id'>>) => {
      const newId = `ch${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editChallenge: (state, action: PayloadAction<Challenge>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteChallenge: (state, action: PayloadAction<string>) => {
      return state.filter(c => c.id !== action.payload);
    }
  }
});

// 11. CHALLENGE PARTICIPATIONS SLICE
const challengeParticipationSlice = createSlice({
  name: 'challengeParticipations',
  initialState: initialChallengeParticipations,
  reducers: {
    addChallengeParticipation: (state, action: PayloadAction<Omit<ChallengeParticipation, 'id' | 'approvalStatus'>>) => {
      const newId = `cp${state.length + 1}`;
      state.push({ id: newId, ...action.payload, approvalStatus: 'Pending' });
    },
    updateChallengeProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state[index].progress = action.payload.progress;
      }
    },
    approveChallengeParticipation: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        state[index].approvalStatus = 'Approved';
        state[index].progress = 100;
      }
    },
    rejectChallengeParticipation: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        state[index].approvalStatus = 'Rejected';
      }
    }
  }
});

// 12. POLICIES SLICE
const policySlice = createSlice({
  name: 'policies',
  initialState: initialPolicies,
  reducers: {
    addPolicy: (state, action: PayloadAction<Omit<ESGPolicy, 'id'>>) => {
      const newId = `p${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editPolicy: (state, action: PayloadAction<ESGPolicy>) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deletePolicy: (state, action: PayloadAction<string>) => {
      return state.filter(p => p.id !== action.payload);
    }
  }
});

// 13. POLICY ACKNOWLEDGEMENTS SLICE
const policyAcknowledgementSlice = createSlice({
  name: 'policyAcknowledgements',
  initialState: initialPolicyAcknowledgements,
  reducers: {
    addAcknowledgement: (state, action: PayloadAction<Omit<PolicyAcknowledgement, 'id' | 'status'>>) => {
      const newId = `pa${state.length + 1}`;
      state.push({ id: newId, ...action.payload, status: 'Pending' });
    },
    acknowledgePolicy: (state, action: PayloadAction<{ policyId: string; employeeEmail: string }>) => {
      const index = state.findIndex(
        pa => pa.policyId === action.payload.policyId && pa.employeeEmail === action.payload.employeeEmail
      );
      if (index !== -1) {
        state[index].status = 'Acknowledged';
        state[index].acknowledgedDate = new Date().toISOString().split('T')[0];
      } else {
        const newId = `pa${state.length + 1}`;
        state.push({
          id: newId,
          policyId: action.payload.policyId,
          employeeEmail: action.payload.employeeEmail,
          employeeName: 'Current User',
          acknowledgedDate: new Date().toISOString().split('T')[0],
          status: 'Acknowledged'
        });
      }
    }
  }
});

// 14. AUDITS SLICE
const auditSlice = createSlice({
  name: 'audits',
  initialState: initialAudits,
  reducers: {
    addAudit: (state, action: PayloadAction<Omit<Audit, 'id'>>) => {
      const newId = `au${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editAudit: (state, action: PayloadAction<Audit>) => {
      const index = state.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

// 15. COMPLIANCE ISSUES SLICE
const complianceIssueSlice = createSlice({
  name: 'complianceIssues',
  initialState: initialComplianceIssues,
  reducers: {
    addComplianceIssue: (state, action: PayloadAction<Omit<ComplianceIssue, 'id' | 'status'>>) => {
      const newId = `ci${state.length + 1}`;
      state.push({ id: newId, ...action.payload, status: 'Open' });
    },
    resolveComplianceIssue: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(c => c.id === action.payload);
      if (index !== -1) {
        state[index].status = 'Resolved';
      }
    },
    editComplianceIssue: (state, action: PayloadAction<ComplianceIssue>) => {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteComplianceIssue: (state, action: PayloadAction<string>) => {
      return state.filter(c => c.id !== action.payload);
    }
  }
});

// 16. BADGES SLICE
const badgeSlice = createSlice({
  name: 'badges',
  initialState: initialBadges,
  reducers: {
    addBadge: (state, action: PayloadAction<Omit<Badge, 'id'>>) => {
      const newId = `b${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    }
  }
});

// 17. REWARDS SLICE
const rewardSlice = createSlice({
  name: 'rewards',
  initialState: initialRewards,
  reducers: {
    addReward: (state, action: PayloadAction<Omit<Reward, 'id'>>) => {
      const newId = `r${state.length + 1}`;
      state.push({ id: newId, ...action.payload });
    },
    editReward: (state, action: PayloadAction<Reward>) => {
      const index = state.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    redeemReward: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(r => r.id === action.payload.id);
      if (index !== -1 && state[index].stock > 0) {
        state[index].stock -= 1;
        if (state[index].stock === 0) {
          state[index].status = 'Out of Stock';
        }
      }
    }
  }
});

// 18. NOTIFICATIONS SLICE
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: initialNotifications,
    toasts: [] as { id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }[]
  },
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<AppNotification, 'id' | 'date' | 'read'>>) => {
      const newId = `n${state.list.length + 1}`;
      state.list.unshift({
        id: newId,
        date: new Date().toISOString(),
        read: false,
        ...action.payload
      });
    },
    markAllRead: (state) => {
      state.list.forEach(n => n.read = true);
    },
    addToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'info' | 'warning' | 'error' }>) => {
      const id = `t${Date.now()}`;
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

// 19. SETTINGS SLICE
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    weights: {
      environmental: 40,
      social: 30,
      governance: 30
    },
    autoEmissionCalculation: true,
    requireEvidenceForCSR: true,
    autoAwardBadges: true,
    notificationPreferences: {
      newComplianceIssue: { email: true, inApp: true },
      csrChallengeApprovals: { email: true, inApp: true },
      policyAcknowledgements: { email: false, inApp: true },
      badgeUnlocks: { email: true, inApp: true }
    }
  },
  reducers: {
    updateWeights: (state, action: PayloadAction<{ environmental: number; social: number; governance: number }>) => {
      state.weights = action.payload;
    },
    toggleAutoEmission: (state) => {
      state.autoEmissionCalculation = !state.autoEmissionCalculation;
    },
    toggleRequireEvidence: (state) => {
      state.requireEvidenceForCSR = !state.requireEvidenceForCSR;
    },
    toggleAutoAwardBadges: (state) => {
      state.autoAwardBadges = !state.autoAwardBadges;
    },
    updateNotificationPref: (state, action: PayloadAction<{ key: string; field: 'email' | 'inApp' }>) => {
      const key = action.payload.key as keyof typeof state.notificationPreferences;
      if (state.notificationPreferences[key]) {
        state.notificationPreferences[key][action.payload.field] = !state.notificationPreferences[key][action.payload.field];
      }
    }
  }
});

// 20. UI SLICE
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    activeTab: 'Dashboard',
    filters: {
      department: 'All',
      dateRange: 'All',
      module: 'All',
      employee: 'All',
      challenge: 'All',
      category: 'All'
    }
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.filters = { ...state.filters, [action.payload.key]: action.payload.value };
    },
    resetFilters: (state) => {
      state.filters = {
        department: 'All',
        dateRange: 'All',
        module: 'All',
        employee: 'All',
        challenge: 'All',
        category: 'All'
      };
    }
  }
});

// Combine actions
export const {
  login,
  loginSuccess,
  registerSuccess,
  logout,
  switchUser,
  updateProfile,
  updateXPAndPoints,
  awardBadgesToUser,
  setLoading,
  setError
} = authSlice.actions;

export const { addDepartment, editDepartment, deleteDepartment } = departmentsSlice.actions;
export const { addCategory, editCategory, deleteCategory } = categoriesSlice.actions;
export const { addEmissionFactor, editEmissionFactor, deleteEmissionFactor } = emissionFactorSlice.actions;
export const { addProductProfile, editProductProfile, deleteProductProfile } = productProfileSlice.actions;
export const { addGoal, editGoal, deleteGoal } = goalSlice.actions;
export const { addCarbonTransaction, deleteCarbonTransaction } = carbonTransactionSlice.actions;
export const { addCSRActivity, editCSRActivity, deleteCSRActivity, incrementJoinedCount } = csrActivitySlice.actions;
export const { addParticipation, approveParticipation, rejectParticipation } = employeeParticipationSlice.actions;
export const { addChallenge, editChallenge, deleteChallenge } = challengeSlice.actions;
export const { addChallengeParticipation, updateChallengeProgress, approveChallengeParticipation, rejectChallengeParticipation } = challengeParticipationSlice.actions;
export const { addPolicy, editPolicy, deletePolicy } = policySlice.actions;
export const { addAcknowledgement, acknowledgePolicy } = policyAcknowledgementSlice.actions;
export const { addAudit, editAudit } = auditSlice.actions;
export const { addComplianceIssue, resolveComplianceIssue, editComplianceIssue, deleteComplianceIssue } = complianceIssueSlice.actions;
export const { addBadge } = badgeSlice.actions;
export const { addReward, editReward, redeemReward } = rewardSlice.actions;
export const { addNotification, markAllRead, addToast, removeToast } = notificationsSlice.actions;
export const { updateWeights, toggleAutoEmission, toggleRequireEvidence, toggleAutoAwardBadges, updateNotificationPref } = settingsSlice.actions;
export const { toggleSidebar, setSidebarCollapsed, setActiveTab, updateFilter, resetFilters } = uiSlice.actions;

// Redux store configuration
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    departments: departmentsSlice.reducer,
    categories: categoriesSlice.reducer,
    emissionFactors: emissionFactorSlice.reducer,
    productProfiles: productProfileSlice.reducer,
    goals: goalSlice.reducer,
    carbonTransactions: carbonTransactionSlice.reducer,
    csrActivities: csrActivitySlice.reducer,
    employeeParticipations: employeeParticipationSlice.reducer,
    challenges: challengeSlice.reducer,
    challengeParticipations: challengeParticipationSlice.reducer,
    policies: policySlice.reducer,
    policyAcknowledgements: policyAcknowledgementSlice.reducer,
    audits: auditSlice.reducer,
    complianceIssues: complianceIssueSlice.reducer,
    badges: badgeSlice.reducer,
    rewards: rewardSlice.reducer,
    notifications: notificationsSlice.reducer,
    settings: settingsSlice.reducer,
    ui: uiSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Business rule side-effects runner (Thunks or simulated triggers)
export const handleRedeemRewardThunk = (rewardId: string, userId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const reward = state.rewards.find(r => r.id === rewardId);
  const user = state.auth.users.find(u => u.id === userId);

  if (!reward || !user) return;

  if (reward.stock <= 0) {
    dispatch(addToast({ message: 'This reward is currently out of stock!', type: 'error' }));
    return;
  }

  if (user.points < reward.pointsRequired) {
    dispatch(addToast({ message: `Insufficient points! You need ${reward.pointsRequired} points.`, type: 'error' }));
    return;
  }

  // Deduct points, reduce stock
  dispatch(updateXPAndPoints({ userId, xpToAdd: 0, pointsToAdd: -reward.pointsRequired }));
  dispatch(redeemReward({ id: rewardId }));
  dispatch(addToast({ message: `Successfully redeemed "${reward.name}"!`, type: 'success' }));
  dispatch(addNotification({
    title: 'Reward Redeemed',
    message: `You successfully redeemed points for "${reward.name}".`,
    type: 'general'
  }));
};

export const handleApproveCSRThunk = (participationId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const part = state.employeeParticipations.find(p => p.id === participationId);
  const requireEvidence = state.settings.requireEvidenceForCSR;

  if (!part) return;

  if (requireEvidence && !part.proofFile) {
    dispatch(addToast({ message: 'Evidence is required to approve this CSR participation!', type: 'error' }));
    return;
  }

  dispatch(approveParticipation(participationId));
  dispatch(incrementJoinedCount(part.activityId));

  // Find user and award points
  const user = state.auth.users.find(u => u.name === part.employeeName || u.email === part.employeeEmail);
  if (user) {
    dispatch(updateXPAndPoints({ userId: user.id, xpToAdd: part.pointsEarned * 2, pointsToAdd: part.pointsEarned }));
    dispatch(addToast({ message: `CSR Participation approved! Awarded +${part.pointsEarned * 2} XP and +${part.pointsEarned} Points.`, type: 'success' }));
    
    // Check auto badge
    if (state.settings.autoAwardBadges) {
      // Re-fetch user since we updated state
      const updatedState = getState();
      const updatedUser = updatedState.auth.users.find(u => u.id === user.id)!;
      const approvedCSRCount = updatedState.employeeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const completedChallengesCount = updatedState.challengeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const resolvedIssuesCount = updatedState.complianceIssues.filter(c => c.owner === updatedUser.name && c.status === 'Resolved').length;

      const newBadges = checkBadgeAutoAward(
        updatedUser,
        state.badges,
        completedChallengesCount,
        approvedCSRCount,
        resolvedIssuesCount,
        (title, message, type) => {
          dispatch(addNotification({ title, message, type }));
          dispatch(addToast({ message: title + ' ' + message, type: 'success' }));
        }
      );
      if (newBadges.length > updatedUser.badges.length) {
        dispatch(awardBadgesToUser({ userId: user.id, badgeIds: newBadges }));
      }
    }
  }
};

export const handleApproveChallengeThunk = (participationId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const part = state.challengeParticipations.find(p => p.id === participationId);
  const challenge = state.challenges.find(c => c.id === part?.challengeId);
  const requireEvidence = state.settings.requireEvidenceForCSR;

  if (!part || !challenge) return;

  if (requireEvidence && challenge.evidenceRequired && !part.proofFile) {
    dispatch(addToast({ message: 'Evidence is required to approve this challenge!', type: 'error' }));
    return;
  }

  dispatch(approveChallengeParticipation(participationId));

  // Find user and award XP
  const user = state.auth.users.find(u => u.name === part.employeeName || u.email === part.employeeEmail);
  if (user) {
    dispatch(updateXPAndPoints({ userId: user.id, xpToAdd: challenge.xp, pointsToAdd: Math.round(challenge.xp / 2) }));
    dispatch(addToast({ message: `Challenge approved! Awarded +${challenge.xp} XP and +${Math.round(challenge.xp / 2)} Points.`, type: 'success' }));

    // Check auto badge
    if (state.settings.autoAwardBadges) {
      const updatedState = getState();
      const updatedUser = updatedState.auth.users.find(u => u.id === user.id)!;
      const approvedCSRCount = updatedState.employeeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const completedChallengesCount = updatedState.challengeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const resolvedIssuesCount = updatedState.complianceIssues.filter(c => c.owner === updatedUser.name && c.status === 'Resolved').length;

      const newBadges = checkBadgeAutoAward(
        updatedUser,
        state.badges,
        completedChallengesCount,
        approvedCSRCount,
        resolvedIssuesCount,
        (title, message, type) => {
          dispatch(addNotification({ title, message, type }));
          dispatch(addToast({ message: title + ' ' + message, type: 'success' }));
        }
      );
      if (newBadges.length > updatedUser.badges.length) {
        dispatch(awardBadgesToUser({ userId: user.id, badgeIds: newBadges }));
      }
    }
  }
};

export const handleAddComplianceIssueThunk = (issue: Omit<ComplianceIssue, 'id' | 'status'>) => (dispatch: AppDispatch) => {
  dispatch(addComplianceIssue(issue));
  dispatch(addToast({ message: `New compliance issue raised and assigned to ${issue.owner}`, type: 'warning' }));
  dispatch(addNotification({
    title: 'New Compliance Issue Raised',
    message: `${issue.description} assigned to ${issue.owner}. Due date: ${issue.dueDate}`,
    type: 'compliance'
  }));
};

export const handleResolveComplianceIssueThunk = (issueId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const issue = state.complianceIssues.find(i => i.id === issueId);
  if (!issue) return;

  dispatch(resolveComplianceIssue(issueId));
  dispatch(addToast({ message: `Compliance issue resolved!`, type: 'success' }));

  // Find user and award XP/Points for governance help
  const user = state.auth.users.find(u => u.name === issue.owner);
  if (user) {
    dispatch(updateXPAndPoints({ userId: user.id, xpToAdd: 150, pointsToAdd: 50 }));
    dispatch(addToast({ message: `Owner ${issue.owner} awarded +150 XP for resolving compliance issue.`, type: 'success' }));

    // Check auto badge
    if (state.settings.autoAwardBadges) {
      const updatedState = getState();
      const updatedUser = updatedState.auth.users.find(u => u.id === user.id)!;
      const approvedCSRCount = updatedState.employeeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const completedChallengesCount = updatedState.challengeParticipations.filter(p => (p.employeeEmail === updatedUser.email || p.employeeName === updatedUser.name) && p.approvalStatus === 'Approved').length;
      const resolvedIssuesCount = updatedState.complianceIssues.filter(c => c.owner === updatedUser.name && c.status === 'Resolved').length;

      const newBadges = checkBadgeAutoAward(
        updatedUser,
        state.badges,
        completedChallengesCount,
        approvedCSRCount,
        resolvedIssuesCount,
        (title, message, type) => {
          dispatch(addNotification({ title, message, type }));
          dispatch(addToast({ message: title + ' ' + message, type: 'success' }));
        }
      );
      if (newBadges.length > updatedUser.badges.length) {
        dispatch(awardBadgesToUser({ userId: user.id, badgeIds: newBadges }));
      }
    }
  }
};

export const handleAcknowledgePolicyThunk = (policyId: string, employeeEmail: string) => (dispatch: AppDispatch) => {
  dispatch(acknowledgePolicy({ policyId, employeeEmail }));
  dispatch(addToast({ message: 'Policy successfully acknowledged!', type: 'success' }));
};

export const handleAddCarbonTransactionThunk = (ct: Omit<CarbonTransaction, 'id' | 'co2Calculated'>) => (dispatch: AppDispatch) => {
  dispatch(addCarbonTransaction(ct));
  dispatch(addToast({ message: 'Carbon transaction logged successfully.', type: 'success' }));
};
