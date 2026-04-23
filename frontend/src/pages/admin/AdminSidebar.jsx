import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, LayoutDashboard, Calendar, Users, LogOut, Plus, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Hotels', href: '/admin/hotels', icon: Hotel },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { success } = useToastStore();

  const handleLogout = () => {
    logout();
    success('Logged out');
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-dark-900/50 border-r border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold gradient-text">StayEo</span>
            <p className="text-[10px] text-white/30 -mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/admin' && location.pathname.startsWith(item.href));
          return (
            <Link key={item.href} to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-white/5 mt-4">
          <Link to="/admin/hotels/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-400 hover:bg-violet-500/10 transition-all">
            <Plus className="w-4 h-4" /> Add Hotel
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all mb-1">
          <Settings className="w-4 h-4" /> View Site
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
