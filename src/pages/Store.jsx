import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Lock, Loader2, ShoppingBag, Crown, Coins } from 'lucide-react';
import { ITEM_COST_COINS } from '@/lib/dailyChallenges';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useSkin } from '@/lib/skinContext';
import { BOARD_SKINS, PIECE_SETS } from '@/lib/storeCatalog';
import { renderPieceSet } from '@/components/chess/PieceSets';

function BoardPreview({ skin }) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 rounded-md overflow-hidden" style={{ width: 72, height: 72, border: `1px solid ${skin.border}`, boxShadow: `0 0 12px ${skin.glow}` }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const isLight = (row + col) % 2 === 0;
        return <div key={i} style={{ backgroundColor: isLight ? skin.light : skin.dark }} />;
      })}
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
  const canAffordCoins = (coinBalance || 0) >= ITEM_COST_COINS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl p-3 pb-14 border backdrop-blur-md transition-all ${
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
      <p className="text-[10px] text-white/40 text-center mb-2">{item.description}</p>

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
          <div className="flex gap-1.5">
            <button
              onClick={() => onPurchase(item)}
              disabled={purchasing}
              className="flex-1 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold tracking-wider hover:bg-[#D4AF37]/25 transition-colors flex items-center justify-center gap-1"
            >
              {purchasing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  $0.99
                </>
              )}
            </button>
            <button
              onClick={() => onCoinPurchase(item)}
              disabled={coinPurchasing || !canAffordCoins}
              className="flex-1 py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9] text-[11px] font-bold tracking-wider hover:bg-[#3AAFA9]/25 transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              title={canAffordCoins ? `Buy with ${ITEM_COST_COINS} coins` : `Need ${ITEM_COST_COINS} coins`}
            >
              {coinPurchasing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Coins className="w-3 h-3" />
                  {ITEM_COST_COINS}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Store() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { boardSkin, pieceSet, setBoardSkin, setPieceSet } = useSkin();
  const [purchases, setPurchases] = useState([]);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [coinPurchasing, setCoinPurchasing] = useState(null);
  const [justPurchased, setJustPurchased] = useState(null);

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
  }, [location.search]);

  const isOwned = (itemId) => itemId === 'classic' || purchases.some(p => p.item_id === itemId);

  const handlePurchase = async (item) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (window.self !== window.top) {
      alert('Checkout works only from a published app. Please open the app directly to purchase.');
      return;
    }
    setPurchasing(item.id);
    try {
      const res = await base44.functions.invoke('createCosmeticCheckout', {
        item_id: item.id,
        item_type: item.category,
        item_name: item.name,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      alert('Failed to start checkout. Please try again.');
    }
    setPurchasing(null);
  };

  const handleSelect = (item) => {
    if (!isOwned(item.id)) return;
    if (item.category === 'board') setBoardSkin(item.id);
    else setPieceSet(item.id);
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
      if (res.data?.success) {
        setCoinBalance(res.data.new_balance);
        setJustPurchased(item.id);
        setTimeout(() => loadPurchases(), 500);
        setTimeout(() => setJustPurchased(null), 4000);
      }
    } catch (e) {
      console.error('Coin purchase error:', e);
      const msg = e?.response?.data?.error || 'Failed to purchase with coins.';
      alert(msg);
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
        <button onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#3AAFA9]" />
          <h1 className="text-xl font-bold tracking-wider">STORE</h1>
        </div>
        {isAuthenticated && (
          <button onClick={() => navigate('/DailyChallenges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-[11px] font-bold tracking-wider hover:bg-[#D4AF37]/20 transition-colors">
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

      {/* Board Styles */}
      <div className="relative z-10 px-4 mb-8">
        <h2 className="text-sm font-bold tracking-wider text-[#3AAFA9]/70 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-[#3AAFA9]/50" />
          BOARD STYLES
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#3AAFA9]/50 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.values(BOARD_SKINS).map(skin => {
              const item = { ...skin, category: 'board', price: skin.id === 'classic' ? 0 : 99 };
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
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#3AAFA9]/50 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.values(PIECE_SETS).map(set => {
              const item = { ...set, category: 'pieces', price: set.id === 'classic' ? 0 : 99 };
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
        )}
      </div>

      {/* Footer note */}
      <div className="relative z-10 px-4 text-center">
        <p className="text-[10px] text-white/20 tracking-wider">
          All cosmetics are one-time purchases. $0.99 each, or can be purchased with in-game currency, earned from playing the game.
        </p>
      </div>
    </div>
  );
}