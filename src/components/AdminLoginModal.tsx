import React, { useState } from 'react';
import { Lock, User, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  isDarkMode?: boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.adminLogin(username, password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A35]/60 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md rounded-3xl border border-[#102A35]/10 shadow-[0_25px_70px_rgba(16,42,53,0.18)] p-6 sm:p-8 bg-white text-[#102A35] transition-all"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#102A35]/8">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#102A35] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-heading font-bold text-lg text-[#102A35]">Owner & Admin Access</h3>
              <p className="text-xs text-[#60747B]">FR Stickers Hub Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#60747B] hover:text-[#102A35] hover:bg-[#F8F7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#60747B] mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60747B]" />
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] border border-[#102A35]/15 text-[#102A35] text-sm focus:outline-none focus:border-[#102A35]"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#60747B] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60747B]" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F7F2] border border-[#102A35]/15 text-[#102A35] text-sm focus:outline-none focus:border-[#102A35]"
                placeholder="••••••••••••"
              />
            </div>
            <p className="text-[11px] text-[#60747B] mt-1.5">
              Default master password: <code className="text-[#102A35] bg-[#EBF5F7] px-1.5 py-0.5 rounded font-mono">frstickers2026</code>
            </p>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-xl bg-[#102A35] hover:bg-[#183E4E] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#102A35]/15 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
