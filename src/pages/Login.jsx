import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider('google', createPageUrl('Lobby'));
  };

  const handleApple = () => {
    base44.auth.loginWithProvider('apple', createPageUrl('Lobby'));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-2">Sign In</h1>
        <p className="text-white/50 text-center text-sm mb-8">Welcome back to Reel Chess</p>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-2.5 px-4 rounded-lg hover:bg-white/90 transition"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <button
            onClick={handleApple}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-2.5 px-4 rounded-lg hover:bg-white/90 transition"
          >
            <svg width="18" height="18" viewBox="0 0 814 1000"><path fill="#000" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 31 0 108.2 2.6 168.5 80.1zm-198.6-81.5c31.7-37.5 54.3-89.7 54.3-141.9 0-7.1-.6-14.3-1.9-20.1-51.6 2-112.3 34.4-148.4 75.8-28.5 32.4-55.1 84.7-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 46.4 0 102.8-31.1 135.6-68.7z"/></svg>
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-white/30 transition"
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-white/40 text-sm hover:text-white/70 transition">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#c49e2e] disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-white/40 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-white/70 hover:text-white transition">Sign up</Link>
        </p>
      </div>
    </div>
  );
}