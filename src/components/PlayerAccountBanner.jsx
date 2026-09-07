import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coins, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useSkin } from '@/lib/skinContext';
import GlowingUsername from '@/components/GlowingUsername';
import { selectPlayerAccount } from '@/lib/playerAccount';

export const PLAYER_ACCOUNT_UPDATED_EVENT = 'reelchess:account-updated';

export default function PlayerAccountBanner() {
  const { user, isAuthenticated } = useAuth();
  const { usernameGlow, setUsernameGlow } = useSkin();
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  const loadAccount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const accounts = await base44.entities.PlayerAccount.filter({ user_id: user.id });
      setAccount(selectPlayerAccount(accounts) || { elo: 1200, currency_balance: 0 });
    } catch (error) {
      console.error('Failed to load account banner:', error);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => { loadAccount(); }, [loadAccount, location.pathname]);

  useEffect(() => {
    const handleAccountUpdated = (event) => {
      if (event.detail?.account) setAccount(event.detail.account);
      else loadAccount();
    };
    window.addEventListener(PLAYER_ACCOUNT_UPDATED_EVENT, handleAccountUpdated);
    return () => window.removeEventListener(PLAYER_ACCOUNT_UPDATED_EVENT, handleAccountUpdated);
  }, [loadAccount]);

  useEffect(() => {
    if (user?.username_glow && user.username_glow !== usernameGlow) setUsernameGlow(user.username_glow);
  }, [user?.username_glow, usernameGlow, setUsernameGlow]);

  if (!isAuthenticated || !user?.username) return null;

  return (
    <div className="sticky top-0 z-[70] border-b border-[#3AAFA9]/20 bg-[#070a0e]/90 px-3 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => navigate('/Profile')}
        className="mx-auto grid min-h-11 w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 px-1 text-left"
        aria-label={`${user.username}, ELO ${account?.elo ?? 1200}, ${account?.currency_balance ?? 0} Tempo. Open profile.`}
      >
        <div className="min-w-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/35">Player</p>
          <GlowingUsername glow={usernameGlow} className="text-xs tracking-wide text-white">{user.username}</GlowingUsername>
        </div>
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <Trophy className="h-3.5 w-3.5 text-[#3AAFA9]" />
          <div><p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/35">ELO</p><p className="text-xs font-black tabular-nums text-white">{account?.elo ?? 1200}</p></div>
        </div>
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
          <div><p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/35">Tempo</p><p className="text-xs font-black tabular-nums text-[#D4AF37]">{(account?.currency_balance ?? 0).toLocaleString()}</p></div>
        </div>
      </button>
    </div>
  );
}
