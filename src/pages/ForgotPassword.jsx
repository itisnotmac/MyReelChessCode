import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight, Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
      setSubmitted(true);
    } catch (err) {
      // Always show generic success — the API hides whether the email exists.
      setSubmitted(true);
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
          <p className="text-white/40 text-sm">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-[#111118] border border-[#3AAFA9]/15 rounded-2xl p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#3AAFA9]/15 flex items-center justify-center">
                <Mail className="w-7 h-7 text-[#3AAFA9]" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                If an account exists for{' '}
                <span className="text-[#3AAFA9] font-medium">{email || 'that email'}</span>,
                a password reset link has been sent. Check your inbox and follow the link to set a new password.
              </p>
              <Link to="/login"
                className="inline-flex items-center gap-2 text-[#3AAFA9]/70 hover:text-[#3AAFA9] text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-white/50 text-sm mb-6 text-center">
                Enter your email and we'll send you a link to reset your password.
              </p>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3AAFA9 0%, #2d8a85 100%)', color: '#0a0a0f' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
              <div className="text-center mt-6">
                <Link to="/login"
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}