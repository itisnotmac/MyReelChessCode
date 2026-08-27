import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Lock, Loader2, ShoppingBag, Crown, Coins } from 'lucide-react';
import { ITEM_COST_COINS } from '@/lib/dailyChallenges';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useSkin } from '@/lib/skinContext';
import { BOARD_SKINS, PIECE_SETS, USERNAME_GLOW_COLORS, MOVE_TRAIL_COLORS, GRANDMASTER_AVATARS, PARTICLE_EFFECTS, BOARD_BORDERS, AVATAR_FRAMES, AMBIENT_EFFECTS } from '@/lib/storeCatalog';
import { renderPieceSet } from '@/components/chess/PieceSets';
import CosmeticGrid from '@/components/store/CosmeticGrid';
import { getLocalProfile, setLocalProfile } from '@/lib/profileUtils';
import { useToast } from "@/components/ui/use-toast";
import StoreCardSkeleton from '@/components/StoreCardSkeleton';
import TempoBundles from '@/components/store/TempoBundles';
import BoardAnimation from '@/components/effects/BoardAnimation';

function BoardPreview({ skin }) {
  return (
    <div className="relative rounded-md overflow-hidden" style={{ width: 72, height: 72, border: `1px solid ${skin.border}`, boxShadow: `0 0 12px ${skin.glow}` }}>
      {skin.animation && <BoardAnimation animation={skin.animation} />}
      <div className="relative grid grid-cols-4 grid-rows-4 w-full h-full">
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const isLight = (row + col) % 2 === 0;
          return <div key={i} style={{ backgroundColor: isLight ? skin.light : skin.dark }} />;
        })}
      </div>
    </div>
  );
}

function PiecePreview({ setId }) {
  const pieces = ['K', 'Q', 'R', 'B', 'N', 'P'];
  return (
    <div className="flex items-center justify-center" style={{ height: 72 }}>
      {pieces.map(p => (
        <div key={p} style={{ width: 26, height: 26 }}>
          {renderPieceSet(setId, { piece: p, isWhite: true, size: 'small' })}
        </div>
      ))}
    </div>
  );
}

function StoreCard({ item, owned, selected, onSelect, onPurchase, purchasing, coinBalance, onCoinPurchase, coinPurchasing }) {
  const isFree = item.price === 0;
  const canAffordCoins = (coinBalance || 0) >= (item.price || ITEM_COST_COINS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl p-3 pb-14 border backdrop-blur-md transition-colors ${
        selected
          ? 'border-[#3AAFA9] bg-[#3AAFA9]/15'
          : owned
            ? 'border-white/15 bg-black/40'
            : 'border-white/15 bg-black/40'
      }`}
      style={{ minHeight: 140 }}
    >
      {/* Preview */}
      <div className="flex justify-center mb-2">
        {item.category === 'board'
          ? <BoardPreview skin={item} />
          : <PiecePreview setId={item.id} />
        }
      </div>

      {/* Name */}
      <p className="text-sm font-bold text-white text-center mb-0.5">{item.name}</p>
      <p className="text-[10px] text-white/60 text-center mb-2">{item.description}</p>

      {/* Action */}
      <div className="absolute bottom-3 left-3 right-3">
        {selected ? (
          <div className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40">
            <Check className="w-3.5 h-3.5 text-[#3AAFA9]" />
            <span className="text-[11px] font-bold text-[#3AAFA9] tracking-wider">SELECTED</span>
          </div>
        ) : owned ? (
          <button
            onClick={() => onSelect(item)}
            className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors"
          >
            SELECT
          </button>
        ) : (
          <button
            onClick={() => onCoinPurchase(item)}
            disabled={coinPurchasing || !canAffordCoins}
            className="w-full py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9] text-[11px] font-bold tracking-wider hover:bg-[#3AAFA9]/25 transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            title={canAffordCoins ? `Buy with ${item.price || ITEM_COST_COINS} Tempo` : `Need ${item.price || ITEM_COST_COINS} Tempo`}
          >
            {coinPurchasing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Coins className="w-3 h-3" />
                {item.price || ITEM_COST_COINS}
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Store() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { boardSkin, pieceSet, setBoardSkin, setPieceSet, usernameGlow, moveTrailColor, setUsernameGlow, setMoveTrailColor, boardBorder, particleEffect, avatarFrame, ambientEffect, setBoardBorder, setParticleEffect, setAvatarFrame, setAmbientEffect } = useSkin();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [coinPurchasing, setCoinPurchasing] = useState(null);
  const [justPurchased, setJustPurchased] = useState(null);
  const [tempoPurchased, setTempoPurchased] = useState(null);

  const loadPurchases = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      const [purchaseRes, accountRes] = await Promise.all([
        base44.entities.UserPurchase.list(),
        base44.entities.PlayerAccount.list(),
      ]);
      setPurchases(purchaseRes || []);
      setCoinBalance(accountRes?.[0]?.currency_balance || 0);
    } catch (e) {
      console.error('Failed to load store data:', e);
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  // Check for purchase success redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const purchased = params.get('purchased');
    if (purchased) {
      setJustPurchased(purchased);
      // Clear the URL param
      navigate('/Store', { replace: true });
      // Reload purchases after a brief delay (webhook may still be processing)
      setTimeout(() => loadPurchases(), 1500);
      setTimeout(() => setJustPurchased(null), 4000);
    }
    const tempo = params.get('tempo');
    if (tempo) {
      setTempoPurchased(tempo);
      navigate('/Store', { replace: true });
      setTimeout(() => loadPurchases(), 1500);
      setTimeout(() => setTempoPurchased(null), 4000);
    }
  }, [location.search]);

  const isAdmin = user?.role === 'admin';
  const ANIMATED_SKIN_IDS = ['cosmic', 'lava', 'ocean', 'neonGrid'];
  const isOwned = (itemId) => {
    if (isAdmin) return true;
    if (ANIMATED_SKIN_IDS.includes(itemId)) {
      return purchases.some(p => p.item_id === itemId);
    }
    return true;
  };
  // Admin sees all items as owned; everyone else only what they've purchased
  const getOwnedIds = (itemType, items) =>
    isAdmin ? new Set(items.map(i => i.id)) : new Set(purchases.filter(p => p.item_type === itemType).map(p => p.item_id));

  const handlePurchase = async (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (window.self !== window.top) {
      toast({ title: 'Checkout unavailable', description: 'Please open the app directly to purchase.' });
      return;
    }
    setPurchasing(item.id);
    try {
      const res = await base44.functions.invoke('createCosmeticCheckout', {
        item_id: item.id,
        item_type: item.category,
        item_name: item.name,
      });
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      toast({ title: 'Checkout failed', description: 'Please try again.' });
    }
    setPurchasing(null);
  };

  const handleSelect = (item) => {
    if (!isOwned(item.id)) return;
    if (item.category === 'board') setBoardSkin(item.id);
    else setPieceSet(item.id);
  };

  const handleEquipGlow = (item) => {
    setUsernameGlow(item.color);
    toast({ title: item.color ? 'Glow equipped' : 'Glow unequipped', description: item.name });
  };

  const handleEquipTrail = (item) => {
    setMoveTrailColor(item.color);
    toast({ title: item.color ? 'Trail equipped' : 'Trail unequipped', description: item.name });
  };

  const handleEquipAvatar = async (item) => {
    if (!item.image) {
      toast({ title: 'Coming soon', description: 'This avatar is not yet available.' });
      return;
    }
    try {
      await base44.auth.updateMe({ avatar_url: item.image });
      const profile = getLocalProfile();
      if (profile) setLocalProfile({ ...profile, avatar_url: item.image });
      toast({ title: 'Avatar equipped', description: item.name });
    } catch (e) {
      console.error('Avatar equip error:', e);
      toast({ title: 'Failed to equip avatar', description: 'Please try again.' });
    }
  };

  const handleEquipParticle = (item) => {
    setParticleEffect(item.id);
    toast({ title: item.id ? 'Particle effect equipped' : 'Particle effect unequipped', description: item.name });
  };

  const handleEquipBorder = (item) => {
    setBoardBorder(item.id);
    toast({ title: item.id ? 'Border equipped' : 'Border unequipped', description: item.name });
  };

  const handleEquipFrame = (item) => {
    setAvatarFrame(item.id);
    toast({ title: item.id ? 'Frame equipped' : 'Frame unequipped', description: item.name });
  };

  const handleEquipAmbient = (item) => {
    setAmbientEffect(item.id);
    toast({ title: item.id ? 'Ambient effect equipped' : 'Ambient effect unequipped', description: item.name });
  };

  const handleCoinPurchase = async (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCoinPurchasing(item.id);
    try {
      const res = await base44.functions.invoke('purchaseWithCurrency', {
        item_id: item.id,
        item_type: item.category,
        item_name: item.name,
      });
     if (res?.data?.success) {
  setCoinBalance(res.data.new_balance);
  setJustPurchased(item.id);
  setTimeout(() => loadPurchases(), 500);
  setTimeout(() => setJustPurchased(null), 4000);
}
    } catch (e) {
      console.error('Coin purchase error:', e);
      const msg = e?.data?.error || e?.message || 'Failed to purchase with Tempo.';
      toast({ title: 'Purchase failed', description: msg });
    }
    setCoinPurchasing(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-8 relative">
      {/* Cinematic backdrop — treasure vault */}
      <div className="absolute inset-0 z-0">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/7579a6cd0_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.85) 100%)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-6 pb-4">
        <button aria-label="Go back" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#3AAFA9]" />
          <h1 className="text-xl font-bold tracking-wider">STORE</h1>
        </div>
        {isAuthenticated && (
          <button onClick={() => navigate('/DailyChallenges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[11px] font-bold tracking-wider tabular-nums hover:bg-[#D4AF37]/20 transition-colors">
            <Coins className="w-3.5 h-3.5" />
            {coinBalance}
          </button>
        )}
      </div>

      {/* Purchase success banner */}
      {justPurchased && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-4 mb-4 p-3 rounded-xl bg-[#3AAFA9]/10 border border-[#3AAFA9]/30 flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-[#3AAFA9]" />
          <span className="text-sm text-[#3AAFA9]">Purchase successful! Your item is now available.</span>
        </motion.div>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="relative z-10 mx-4 mb-4 p-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#D4AF37]/60" />
          <span className="text-xs text-[#D4AF37]/70">Log in to purchase and save your cosmetics.</span>
        </div>
      )}

      {/* Tempo purchased banner */}
      {tempoPurchased && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-4 mb-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center gap-2"
        >
          <Coins className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm text-[#D4AF37]">{Number(tempoPurchased).toLocaleString()} Tempo added to your balance!</span>
        </motion.div>
      )}

      {/* Buy Tempo bundles */}
      <div className="relative z-10 px-4 mb-8">
        <TempoBundles />
      </div>

      {/* Board Styles */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          BOARD STYLES
        </h2>
        <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
          Choose your board's look from these classic static styles.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(BOARD_SKINS).filter(s => !s.animated).map(skin => {
            const item = { ...skin, category: 'board', price: 0 };
            return (
              <StoreCard
                key={skin.id}
                item={item}
                owned={isOwned(skin.id)}
                selected={boardSkin === skin.id}
                onSelect={handleSelect}
                onPurchase={handlePurchase}
                purchasing={purchasing === skin.id}
                coinBalance={coinBalance}
                onCoinPurchase={handleCoinPurchase}
                coinPurchasing={coinPurchasing === skin.id}
              />
            );
          })}
        </div>
      </div>

      {/* Animated Board Styles */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          ANIMATED BOARD STYLES
        </h2>
        <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
          Premium skins with live animated backgrounds — drifting stars, flowing lava, rolling waves, and pulsing neon grids.
        </p>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.values(BOARD_SKINS).filter(s => s.animated).map(skin => {
              const item = { ...skin, category: 'board', price: skin.price };
              return (
                <StoreCard
                  key={skin.id}
                  item={item}
                  owned={isOwned(skin.id)}
                  selected={boardSkin === skin.id}
                  onSelect={handleSelect}
                  onPurchase={handlePurchase}
                  purchasing={purchasing === skin.id}
                  coinBalance={coinBalance}
                  onCoinPurchase={handleCoinPurchase}
                  coinPurchasing={coinPurchasing === skin.id}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Piece Sets */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          PIECE SETS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(PIECE_SETS).map(set => {
            const item = { ...set, category: 'pieces', price: 0 };
            return (
              <StoreCard
                key={set.id}
                item={item}
                owned={isOwned(set.id)}
                selected={pieceSet === set.id}
                onSelect={handleSelect}
                onPurchase={handlePurchase}
                purchasing={purchasing === set.id}
                coinBalance={coinBalance}
                onCoinPurchase={handleCoinPurchase}
                coinPurchasing={coinPurchasing === set.id}
              />
            );
          })}
        </div>
      </div>

      {/* Username Glow */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          USERNAME GLOW
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={USERNAME_GLOW_COLORS}
            ownedIds={getOwnedIds('username_glow', USERNAME_GLOW_COLORS)}
            equippedId={usernameGlow}
            onEquip={handleEquipGlow}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="color"
          />
        )}
      </div>

      {/* Move Trail */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          MOVE TRAIL
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={MOVE_TRAIL_COLORS}
            ownedIds={getOwnedIds('move_trail', MOVE_TRAIL_COLORS)}
            equippedId={moveTrailColor}
            onEquip={handleEquipTrail}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="color"
          />
        )}
      </div>

      {/* Grandmaster Avatars */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          GRANDMASTER AVATARS
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={GRANDMASTER_AVATARS}
            ownedIds={getOwnedIds('avatar', GRANDMASTER_AVATARS)}
            equippedId={user?.avatar_url}
            onEquip={handleEquipAvatar}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="avatar"
          />
        )}
      </div>

      {/* Particle Effects */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          PARTICLE EFFECTS
        </h2>
        <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
          A burst of glowing particles erupts at the board square whenever you capture a piece. Equipped effect plays in classic AI and local games.
        </p>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={PARTICLE_EFFECTS}
            ownedIds={getOwnedIds('particle_effect', PARTICLE_EFFECTS)}
            equippedId={particleEffect}
            onEquip={handleEquipParticle}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="particle"
          />
        )}
      </div>

      {/* Board Borders */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          BOARD BORDERS
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={BOARD_BORDERS}
            ownedIds={getOwnedIds('board_border', BOARD_BORDERS)}
            equippedId={boardBorder}
            onEquip={handleEquipBorder}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="border"
          />
        )}
      </div>

      {/* Avatar Frames */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          AVATAR FRAMES
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={AVATAR_FRAMES}
            ownedIds={getOwnedIds('avatar_frame', AVATAR_FRAMES)}
            equippedId={avatarFrame}
            onEquip={handleEquipFrame}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="frame"
          />
        )}
      </div>

      {/* Ambient Effects */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          AMBIENT EFFECTS
        </h2>
        <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
          An animated atmospheric layer — rain, snow, embers, fireflies, aurora, or stardust — drifts behind the board during classic AI and local games.
        </p>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map(i => <StoreCardSkeleton key={i} />)}
          </div>
        ) : (
          <CosmeticGrid
            items={AMBIENT_EFFECTS}
            ownedIds={getOwnedIds('ambient_effect', AMBIENT_EFFECTS)}
            equippedId={ambientEffect}
            onEquip={handleEquipAmbient}
            onPurchase={handleCoinPurchase}
            purchasingId={coinPurchasing}
            coinBalance={coinBalance}
            variant="ambient"
          />
        )}
      </div>

      {/* Footer note */}
      <div className="relative z-10 px-4 text-center">
        <p className="text-[10px] text-white/50 tracking-wider">
          All cosmetics are purchased with Tempo. Earn Tempo through daily challenges or buy bundles above.
        </p>
      </div>
    </div>
  );
}
