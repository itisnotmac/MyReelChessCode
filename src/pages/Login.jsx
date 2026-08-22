import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight, Loader2 } from 'lucide-react';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import { Button } from '@/components/ui/button';
import { safeReturnTo } from '@/lib/authReturnTo';

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
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(58,175,169,0.06) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-[0.15em] mb-1"
            style={{
              backgroundImage: 'linear-gradient(135deg, #3AAFA9 0%, #A8E6E3 50%, #3AAFA9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            REEL CHESS
          </h1>
          <p className="text-white/40 text-sm">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-[#3AAFA9]/15 rounded-2xl p-8 shadow-2xl">
          <SocialAuthButtons />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#3AAFA9]/15" />
            <span className="text-white/30 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-[#3AAFA9]/15" />
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
              className="w-full bg-white/5 border border-[#3AAFA9]/15 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3AAFA9]/50 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-[#3AAFA9]/15 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3AAFA9]/50 transition-colors"
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-[#3AAFA9]/60 text-sm hover:text-[#3AAFA9] transition-colors">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="chess-primary"
              className="w-full justify-center gap-2 font-bold text-sm tracking-wider uppercase py-3 rounded-xl active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-white/40 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#3AAFA9] hover:text-[#A8E6E3] transition-colors font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}