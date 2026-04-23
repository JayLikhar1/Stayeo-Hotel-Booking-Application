import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Hotel, ArrowRight, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { success } = useToastStore();

  // Pre-fill email if coming from register page
  const fromRegister = location.state?.email || '';
  const registerMsg  = location.state?.message || '';

  const [form, setForm]         = useState({ email: fromRegister, password: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldError, setFieldError] = useState({ email: '', password: '', general: '' });
  const [attempts, setAttempts] = useState(0);

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const clearErrors = () => setFieldError({ email: '', password: '', general: '' });

  const validate = () => {
    const errs = { email: '', password: '', general: '' };
    if (!form.email.trim())               errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password)                   errs.password = 'Password is required';
    else if (form.password.length < 6)    errs.password = 'Password must be at least 6 characters';
    setFieldError(errs);
    return !errs.email && !errs.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    const result = await login(form);

    if (result.success) {
      success(`Welcome back, ${result.user?.name?.split(' ')[0] || 'there'}! 👋`);
      // Redirect admin to admin panel, regular users to dashboard
      const dest = result.user?.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dest, { replace: true });
    } else {
      setAttempts(a => a + 1);
      // Map backend error messages to specific field errors
      const msg = result.message || '';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('user')) {
        setFieldError(f => ({ ...f, email: 'No account found with this email' }));
      } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('invalid')) {
        setFieldError(f => ({ ...f, password: 'Incorrect password. Please try again.' }));
      } else {
        setFieldError(f => ({ ...f, general: msg || 'Sign in failed. Please try again.' }));
      }
    }
  };

  const fillDemo = (role) => {
    clearErrors();
    if (role === 'admin') setForm({ email: 'admin@stayeo.com', password: 'Admin@123' });
    else                  setForm({ email: 'user@stayeo.com',  password: 'User@123' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">StayEo</span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-white/40 mb-6">Sign in to continue your journey</p>

          {/* ── Success banner from register ──────────────────── */}
          <AnimatePresence>
            {registerMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 mb-6">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">Account created successfully!</p>
                  <p className="text-xs text-emerald-300/70 mt-0.5">{registerMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── General error banner ───────────────────────────── */}
          <AnimatePresence>
            {fieldError.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-4 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300">Sign in failed</p>
                  <p className="text-xs text-red-300/70 mt-0.5">{fieldError.general}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Too many attempts warning */}
          <AnimatePresence>
            {attempts >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-6">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80">
                  Multiple failed attempts. Make sure you're using the correct email and password.
                  Try the <button onClick={() => fillDemo('user')} className="underline font-medium">Demo User</button> credentials to test.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo credentials */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('user')}
              className="flex-1 text-xs py-2 glass rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all">
              Demo User
            </button>
            <button onClick={() => fillDemo('admin')}
              className="flex-1 text-xs py-2 glass rounded-lg text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
              Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldError.email ? 'text-red-400' : 'text-white/30'}`} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setFieldError(f => ({ ...f, email: '' })); }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-dark pl-10 transition-all ${fieldError.email ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                />
              </div>
              <AnimatePresence>
                {fieldError.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{fieldError.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-white/60">Password</label>
                <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${fieldError.password ? 'text-red-400' : 'text-white/30'}`} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setFieldError(f => ({ ...f, password: '' })); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-dark pl-10 pr-10 transition-all ${fieldError.password ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {fieldError.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{fieldError.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.3)_0%,transparent_70%)]" />
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          alt="Hotel" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-4xl font-black text-white mb-4">
              Your next adventure<br />starts here
            </h2>
            <p className="text-white/50 text-lg max-w-sm">
              Discover premium hotels, seamless bookings, and unforgettable experiences.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
