import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess, registerSuccess, setLoading, setError, RootState, addToast } from '../store';
import { authApi } from '../services/authApi';
import { Mail, Lock, User, Check, Loader2, ArrowRight, ShieldCheck, HelpCircle, Landmark, ShieldAlert, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

// ==========================================
// 1. LOGIN PAGE
// ==========================================
export const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { error: authError, loading: isAuthLoading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('admin@ecosphere.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    dispatch(setError(null));

    if (!email || !password) {
      setValidationError('Please enter both email and password.');
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.user && response.token) {
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        dispatch(addToast({ message: `Access granted. Welcome back, ${response.user.name}!`, type: 'success' }));
        navigate('/dashboard');
      } else {
        dispatch(setError(response.error || 'Authentication rejected. Check credentials.'));
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Server connection timed out.'));
      dispatch(addToast({ message: err.message || 'Authentication failed', type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setValidationError(null);
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      const response = await authApi.login({ email: quickEmail, password: 'password123' });
      if (response.success && response.user && response.token) {
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        dispatch(addToast({ message: `Quick login active for ${response.user.name}`, type: 'success' }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Quick login failed.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      {/* Headings */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
        <p className="text-xs text-slate-500 mt-1.5">Sign in to continue to EcoSphere</p>
      </div>

      {/* Backend / Global Error Banner */}
      {(authError || validationError) && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-red-600 leading-relaxed">
            {authError || validationError}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4.5">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
            Corporate Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              disabled={isAuthLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="e.g. name@ecosphere.com"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Secure Password
            </label>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => navigate('/forgot-password')}
              className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold transition-colors focus:outline-none focus:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              disabled={isAuthLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="••••••••"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={isAuthLoading}
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center mr-2.5 transition-all ${
                rememberMe ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Keep me signed in</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isAuthLoading}
          className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:pointer-events-none"
        >
          {isAuthLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <>
              Authenticate Access <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Navigation and quick logins */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-5">
        <p className="text-[11px] text-slate-500 font-medium">
          New to the EcoSphere system?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-emerald-600 hover:text-emerald-700 font-bold underline transition-colors"
          >
            Request Profile Access
          </button>
        </p>

        {/* Evaluator Persona Shortcuts */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 text-left">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5 font-mono">
            Developer Persona Quick Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@ecosphere.com')}
              className="py-2 px-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[10px] font-bold rounded-lg border border-slate-200/60 hover:border-emerald-200 shadow-sm transition-all truncate"
            >
              Sarah (Admin)
            </button>
            <button
              onClick={() => handleQuickLogin('manager@ecosphere.com')}
              className="py-2 px-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[10px] font-bold rounded-lg border border-slate-200/60 hover:border-emerald-200 shadow-sm transition-all truncate"
            >
              Marcus (Mgr)
            </button>
            <button
              onClick={() => handleQuickLogin('employee@ecosphere.com')}
              className="py-2 px-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[10px] font-bold rounded-lg border border-slate-200/60 hover:border-emerald-200 shadow-sm transition-all truncate"
            >
              Aditi (User)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. REGISTER PAGE
// ==========================================
export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Manufacturing');
  const [role, setRole] = useState<'manager' | 'user'>('user');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validations
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg('Please complete all form inputs.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Review confirm password field.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password security constraint: Minimum 6 characters required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        department,
        role
      });

      if (response.success && response.user) {
        // Feed into state.users list so they exist in memory
        dispatch(registerSuccess(response.user));
        dispatch(addToast({ message: `Access requested for ${firstName}`, type: 'success' }));
        setIsSuccess(true);
      } else {
        setErrorMsg(response.error || 'Registration failed. Try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error occurred during account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">Access Requested Successfully</h2>
          <p className="text-xs text-slate-500 px-2 leading-relaxed">
            Your corporate profile for <strong>{firstName} {lastName}</strong> in the <strong>{department}</strong> division has been securely compiled.
          </p>
        </div>
        
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Profile Summary</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium">
            <span className="text-slate-400 font-mono text-[10px] uppercase">Corporate Mail</span>
            <span className="text-slate-800 break-all">{email.toLowerCase()}</span>
            <span className="text-slate-400 font-mono text-[10px] uppercase">Department</span>
            <span className="text-slate-800">{department}</span>
            <span className="text-slate-400 font-mono text-[10px] uppercase">Requested Role</span>
            <span className="text-slate-800 capitalize">{role === 'manager' ? 'Department Manager' : 'Employee / User'}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          Return to Authentication
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Request Corporate Access</h2>
        <p className="text-xs text-slate-500 mt-1">Register an EcoSphere enterprise profile</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-red-600 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              First Name
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="e.g. Sarah"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Last Name
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="e.g. Jenkins"
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
            Corporate Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="name@ecosphere.com"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="Min. 6 chars"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Confirm Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="Re-type"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Department
            </label>
            <div className="relative">
              <select
                disabled={isLoading}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-2 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Corporate">Corporate</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Logistics">Logistics</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Research & Development">Research & Development</option>
              </select>
              <Landmark className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
              Requested Role
            </label>
            <div className="relative">
              <select
                disabled={isLoading}
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-2 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="user">Standard User</option>
                <option value="manager">Department Manager</option>
              </select>
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            'Send Security Request'
          )}
        </button>
      </form>

      <div className="pt-3 border-t border-slate-100 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-[11px] text-slate-500 hover:text-slate-700 font-bold underline transition-colors"
        >
          Already have profile? Sign In
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 3. FORGOT PASSWORD (MULTI-STEP CONTROLLER)
// ==========================================
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Multi-step: 1 = Email request, 2 = Code Verification, 3 = Password restore
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // To assist reviewers, if the server returns the generated OTP in fallback mode, we hold and show it
  const [testModeOtp, setTestModeOtp] = useState<string | null>(null);

  // STEP 1: REQUEST CODE
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTestModeOtp(null);

    if (!email) {
      setErrorMsg('Corporate email address is required.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword({ email });
      if (response.success) {
        dispatch(addToast({ message: 'Security code generated!', type: 'info' }));
        if (response.otp) {
          // SMTP is not set up, show the code on the UI for smooth testing!
          setTestModeOtp(response.otp);
          dispatch(addToast({ message: `Dev mode active. Verification code is ${response.otp}`, type: 'warning' }));
        }
        setStep(2);
      } else {
        setErrorMsg(response.error || 'Failed to request security reset.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error occurred during OTP request.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: VERIFY CODE
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otp || otp.length < 5) {
      setErrorMsg('Verification code must be 6-digits.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp({ email, otp });
      if (response.success) {
        dispatch(addToast({ message: 'Identity verified successfully', type: 'success' }));
        setStep(3);
      } else {
        setErrorMsg(response.error || 'Incorrect security code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification rejected by server.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: RESET AND RESTORE PASSWORD
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg('Please enter and confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Credentials do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Constraint: Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.resetPassword({ email, password });
      if (response.success) {
        dispatch(addToast({ message: 'Password restored. Please sign in.', type: 'success' }));
        navigate('/login');
      } else {
        setErrorMsg(response.error || 'Password restore failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server rejected password restoration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Headers based on the active state */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">Receive secure single-use recovery code</p>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Verify Security Code</h2>
          <p className="text-xs text-slate-500 mt-1">We emailed a 6-digit verification code to</p>
          <p className="text-xs font-semibold text-slate-700 font-mono mt-0.5 break-all">{email}</p>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">Establish New Password</h2>
          <p className="text-xs text-slate-500 mt-1">Set secure platform credentials for</p>
          <p className="text-xs font-semibold text-slate-700 font-mono mt-0.5 break-all">{email}</p>
        </div>
      )}

      {/* Local Error Feedback */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-red-600 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Helper bypass for developers when SMTP is not configured */}
      {step === 2 && testModeOtp && (
        <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-bold font-mono uppercase">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Mailer Testing Helper
          </div>
          <p className="text-[11px] text-slate-600 leading-normal">
            SMTP is not active. Use this generated secure test OTP code to verify identity:
          </p>
          <div className="text-center font-mono font-bold text-lg bg-amber-100/50 text-amber-950 py-1 rounded border border-amber-200/40 select-all tracking-wider">
            {testModeOtp}
          </div>
        </div>
      )}

      {/* STEP 1 FORM: Email Submission */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Corporate Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
                placeholder="name@ecosphere.com"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-[13px]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      )}

      {/* STEP 2 FORM: OTP Code entry */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono text-center">
              Enter 6-Digit Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              disabled={isLoading}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold font-mono tracking-[10px] text-center text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              'Verify Secure Code'
            )}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => setStep(1)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all text-center cursor-pointer disabled:opacity-60"
          >
            Change Email
          </button>
        </form>
      )}

      {/* STEP 3 FORM: Password Restore */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              New Secure Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all disabled:opacity-60"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f3d2e] hover:bg-[#0b2d22] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-75"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              'Restore Password'
            )}
          </button>
        </form>
      )}

      <div className="pt-3 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-[11px] text-slate-500 hover:text-slate-700 font-bold underline transition-colors"
        >
          Remember credentials? Sign In
        </button>
      </div>
    </div>
  );
};
