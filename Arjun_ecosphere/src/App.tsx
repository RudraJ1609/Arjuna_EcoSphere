import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store';

// Layouts
import { AppLayout } from './components/AppLayout';
import { AuthLayout } from './components/AuthLayout';

// Auth Pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';

// Dashboard
import { DashboardPage } from './pages/DashboardPage';

// Environmental Pages
import { EnvironmentalPages } from './pages/EnvironmentalPages';

// Social Pages
import { SocialPages } from './pages/SocialPages';

// Governance Pages
import { GovernancePages } from './pages/GovernancePages';

// Gamification Pages
import { GamificationPages } from './pages/GamificationPages';

// Reports Pages
import { ReportsPages } from './pages/ReportsPages';

// Settings Pages
import { SettingsPages } from './pages/SettingsPages';

// Profile & Error Pages
import { ProfilePage, ForbiddenPage, NotFoundPage } from './pages/ProfileAndErrorPages';

// Strict Route Guarding Component
interface ProtectedRouteProps {
  allow: ('admin' | 'manager' | 'user')[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allow, children }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(currentUser.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Layout Group */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Secure Workspace AppLayout Group */}
          <Route element={<AppLayout />}>
            {/* Index redirection */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard & Profile */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Environmental Sub-routes */}
            <Route path="/environmental" element={<Navigate to="/environmental/emission-factors" replace />} />
            <Route path="/environmental/emission-factors" element={<EnvironmentalPages />} />
            <Route path="/environmental/product-esg-profiles" element={<EnvironmentalPages />} />
            <Route path="/environmental/carbon-transactions" element={<EnvironmentalPages />} />
            <Route path="/environmental/goals" element={<EnvironmentalPages />} />

            {/* Social Sub-routes */}
            <Route path="/social" element={<Navigate to="/social/csr-activities" replace />} />
            <Route path="/social/csr-activities" element={<SocialPages />} />
            <Route path="/social/employee-participation" element={<SocialPages />} />
            <Route path="/social/diversity-dashboard" element={<SocialPages />} />

            {/* Governance Sub-routes */}
            <Route path="/governance" element={<Navigate to="/governance/policies" replace />} />
            <Route path="/governance/policies" element={<GovernancePages />} />
            <Route path="/governance/policy-acknowledgements" element={<GovernancePages />} />
            <Route path="/governance/audits" element={<GovernancePages />} />
            <Route path="/governance/compliance-issues" element={<GovernancePages />} />

            {/* Gamification Sub-routes */}
            <Route path="/gamification" element={<Navigate to="/gamification/challenges" replace />} />
            <Route path="/gamification/challenges" element={<GamificationPages />} />
            <Route path="/gamification/challenge-participation" element={<GamificationPages />} />
            <Route path="/gamification/badges" element={<GamificationPages />} />
            <Route path="/gamification/rewards" element={<GamificationPages />} />
            <Route path="/gamification/leaderboard" element={<GamificationPages />} />

            {/* Reports (Guarded: Admin & Manager Roles) */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <Navigate to="/reports/environmental" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/environmental"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <ReportsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/social"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <ReportsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/governance"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <ReportsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/esg-summary"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <ReportsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/custom-builder"
              element={
                <ProtectedRoute allow={['admin', 'manager']}>
                  <ReportsPages />
                </ProtectedRoute>
              }
            />

            {/* Settings (Guarded: Admin Role Only) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allow={['admin']}>
                  <Navigate to="/settings/departments" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/departments"
              element={
                <ProtectedRoute allow={['admin']}>
                  <SettingsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/categories"
              element={
                <ProtectedRoute allow={['admin']}>
                  <SettingsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/esg-configuration"
              element={
                <ProtectedRoute allow={['admin']}>
                  <SettingsPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/notifications"
              element={
                <ProtectedRoute allow={['admin']}>
                  <SettingsPages />
                </ProtectedRoute>
              }
            />

            {/* Error fallback routes */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
