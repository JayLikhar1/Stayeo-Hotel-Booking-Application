import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hotel, Heart, Calendar, User, LogOut, Settings,
  Menu, X, ChevronDown, Shield, Bell, LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { success } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { label: 'Hotels', href: '/hotels' },
    { label: 'Destinations', href: '/hotels?featured=true' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/90 backdrop-blur-xl border-b border-white/5 shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">StayEo</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`btn-ghost text-sm ${
                  location.pathname === link.href ? 'text-white bg-white/5' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" className="btn-ghost p-2 relative">
                  <Heart className="w-5 h-5" />
                  {user?.wishlist?.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                      {user.wishlist.length}
                    </span>
                  )}
                </Link>

                {/* My Bookings */}
                <Link to="/my-bookings" className="btn-ghost p-2">
                  <Calendar className="w-5 h-5" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white/80 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass rounded-xl shadow-card-hover border border-white/10 overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <LayoutDashboard className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link to="/my-bookings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <Calendar className="w-4 h-4" /> My Bookings
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                            <Heart className="w-4 h-4" /> Wishlist
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                              <Shield className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <div className="border-t border-white/10 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            >
                              <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden btn-ghost p-2"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-950/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/my-bookings" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">My Bookings</Link>
                  <Link to="/dashboard" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">My Dashboard</Link>
                  <Link to="/wishlist" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">Wishlist</Link>
                  <Link to="/profile" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all">Profile</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-violet-400 hover:bg-violet-500/10 transition-all">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" className="flex-1 btn-secondary text-center text-sm py-2.5">Sign In</Link>
                  <Link to="/register" className="flex-1 btn-primary text-center text-sm py-2.5">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
