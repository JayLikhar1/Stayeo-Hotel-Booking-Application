import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const { success, error } = useToastStore();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      success('Profile updated successfully!');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) return error('Passwords do not match');
    if (passForm.newPassword.length < 6) return error('Password must be at least 6 characters');

    setIsChangingPass(true);
    try {
      await authAPI.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          {/* Avatar */}
          <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl font-black text-white shadow-glow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center hover:bg-violet-500 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-white/50 text-sm">{user?.email}</p>
              <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-purple' : 'badge-green'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-5">Personal Information</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={profileForm.name}
                    onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    className="input-dark pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={user?.email} disabled
                    className="input-dark pl-10 opacity-50 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="tel" value={profileForm.phone}
                    onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210" className="input-dark pl-10" />
                </div>
              </div>
              <button type="submit" disabled={isSaving}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password Form */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { key: 'currentPassword', label: 'Current Password' },
                { key: 'newPassword', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm text-white/60 mb-1.5">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="password" value={passForm[key]}
                      onChange={(e) => setPassForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder="••••••••" className="input-dark pl-10" />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={isChangingPass}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50">
                <Lock className="w-4 h-4" />
                {isChangingPass ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
