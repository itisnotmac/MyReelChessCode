import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSeo } from '@/lib/useSeo';

export default function DeleteAccount() {
  const navigate = useNavigate();
  useSeo(
    'Delete Account – Reel Chess',
    'Request deletion of your Reel Chess account and all associated data.'
  );

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/f/mljgypjb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, username, reason }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-teal-400 mb-6 hover:text-teal-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="flex items-center gap-3 mb-1">
        <Trash2 className="w-6 h-6 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Delete Account</h1>
      </div>
      <p className="text-teal-400 text-sm mb-8">Reel Chess · Account & Data Removal</p>

      {/* Warning box */}
      <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-8">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-semibold text-red-400">This action is permanent and cannot be undone.</p>
          <p>Submitting this form will permanently delete:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2 text-gray-400">
            <li>Your Reel Chess account and login credentials</li>
            <li>Your game history and statistics</li>
            <li>Your Tempo balance and purchased cosmetics</li>
            <li>Your ELO rating and achievements</li>
            <li>All personal data associated with your account</li>
          </ul>
          <p className="mt-2 text-gray-400">We will process your request within <span className="text-white font-medium">30 days</span>.</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-teal-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Request Received</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            We've received your deletion request and will process it within 30 days.
            You'll receive a confirmation at the email address you provided.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="The email used to create your account"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your Reel Chess username"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">
              Reason for leaving <span className="text-white/40 font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Help us improve Reel Chess..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-teal-400/50 transition-colors resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">
              Something went wrong. Please try again or email us directly at{' '}
              <a href="mailto:support@reelchess.org" className="underline">support@reelchess.org</a>.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-sm tracking-wider hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'submitting'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              : <><Trash2 className="w-4 h-4" /> Submit Deletion Request</>
            }
          </button>

          <p className="text-center text-xs text-white/40">
            Or email us directly at{' '}
            <a href="mailto:support@reelchess.org" className="text-teal-400 hover:text-teal-300">
              support@reelchess.org
            </a>
          </p>
        </form>
      )}

      <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-xs space-y-2">
        <p>© 2026 Reel Chess. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/privacy-policy" className="text-teal-400 hover:text-teal-300 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="text-teal-400 hover:text-teal-300 transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}