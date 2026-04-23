import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Hotel, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number',     pass: /\d/.test(password) },
    { label: 'Contains a letter',     pass: /[a-zA-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={`text-[10px] flex items-center gap-1 ${c.pass ? 'text-emerald-400' : 'text-white/25'}`}>
              <CheckCircle className="w-2.5 h-2.5" />{c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-[10px] font-semibold ${colors[score - 1].replace('bg-', 'text-')}`}>{labels[score - 1]}</span>}
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { error } = useToastStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())  return error('Full name is required');
    if (!form.email.trim()) return error('Email is required');
    if (!form.password)     return error('Password is required');
    if (form.password.length < 6) return error('Password must be at least 6 characters');
    if (!/\S+@\S+\.\S+/.test(form.email)) return error('Please enter a valid email address');

    const result = await register(form);
    if (result.success) {
      // Show success state briefly, then redirect to login with email pre-filled
      setRegistered(true);
      setTimeout(() => {
        navigate('/login', {
          state: {
            email:   form.email,
            message: `Account created! Sign in to continue, ${form.name.split(' ')[0]}.`,
          },
        });
      }, 1800);
    } else {
      error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.3)_0%,transparent_70%)]" />
        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
          alt="Hotel" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative flex flex-col items-center justify-center p-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-4xl font-black text-white mb-4">
              Join 50,000+<br />happy travelers
            </h2>
            <p className="text-white/50 text-lg max-w-sm">
              Create your free account and start booking premium hotels with AI-powered recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md">

          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">StayEo</span>
          </Link>

          {/* ── Success state ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {registered ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">Account Created!</h2>
                <p className="text-white/50 mb-1">Welcome to StayEo, <span className="text-white font-semibold">{form.name.split(' ')[0]}</span>!</p>
                <p className="text-white/30 text-sm">Redirecting you to sign in...</p>
                <div className="flex justify-center mt-4">
                  <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-black text-white mb-2">Create account</h1>
                <p className="text-white/40 mb-8">Start your journey with StayEo today</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Doe" className="input-dark pl-10"
                        autoComplete="name" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="email" value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com" className="input-dark pl-10"
                        autoComplete="email" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="tel" value={form.phone}
                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210" className="input-dark pl-10"
                        autoComplete="tel" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type={showPass ? 'text' : 'password'} value={form.password}
                        onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Min. 6 characters" className="input-dark pl-10 pr-10"
                        autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>

                  <motion.button type="submit" disabled={isLoading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
