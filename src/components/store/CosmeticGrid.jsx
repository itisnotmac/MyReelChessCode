import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Coins } from 'lucide-react';
import EffectPreview from './EffectPreview';

/**
 * Reusable grid for Tempo-purchasable cosmetics.
 * variant: 'color' (glow/trail swatches) or 'avatar' (grandmaster portraits)
 */
export default function CosmeticGrid({
  items,
  ownedIds,
  equippedId,
  onEquip,
  onPurchase,
  purchasingId,
  coinBalance,
  variant,
}) {
  const showNone = variant !== 'avatar';
  const noneEquipped = !equippedId;
  const noneItem = { id: '', name: 'None', color: '', image: '', price: 0 };

  return (
    <div className="grid grid-cols-2 gap-3">
      {showNone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-xl p-3 pb-14 border backdrop-blur-md transition-colors ${
            noneEquipped ? 'border-[#3AAFA9] bg-[#3AAFA9]/15' : 'border-white/15 bg-black/40'
          }`}
          style={{ minHeight: 140 }}
        >
          <div className="flex justify-center mb-2" style={{ height: variant === 'ambient' ? 90 : 72 }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-dashed border-white/15 bg-black/30">
              <span className="text-white/30 text-[10px] font-bold tracking-wider">OFF</span>
            </div>
          </div>
          <p className="text-sm font-bold text-white text-center mb-0.5">None</p>
          <div className="absolute bottom-3 left-3 right-3">
            {noneEquipped ? (
              <div className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40">
                <Check className="w-3.5 h-3.5 text-[#3AAFA9]" />
                <span className="text-[11px] font-bold text-[#3AAFA9] tracking-wider">EQUIPPED</span>
              </div>
            ) : (
              <button
                onClick={() => onEquip(noneItem)}
                className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors"
              >
                UNEQUIP
              </button>
            )}
          </div>
        </motion.div>
      )}
      {items.map((item, i) => {
        const owned = ownedIds.has(item.id);
        const equipped = ['color'].includes(variant)
          ? equippedId === item.color
          : ['avatar'].includes(variant)
            ? equippedId === item.image
            : equippedId === item.id;
        const canAfford = (coinBalance || 0) >= item.price;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`relative rounded-xl p-3 pb-14 border backdrop-blur-md transition-colors ${
              equipped ? 'border-[#3AAFA9] bg-[#3AAFA9]/15' : 'border-white/15 bg-black/40'
            }`}
            style={{ minHeight: 140 }}
          >
            {/* Preview */}
            <div className="flex justify-center mb-2" style={{ height: variant === 'ambient' ? 90 : 72 }}>
              {variant === 'color' ? (
                <div
                  className="w-14 h-14 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 24px ${item.color}80, inset 0 0 12px rgba(255,255,255,0.2)`,
                  }}
                />
              ) : variant === 'avatar' ? (
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border border-white/10"
                  style={{ boxShadow: '0 0 12px rgba(58,175,169,0.2)' }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <span className="text-white/30 text-lg font-bold">{item.name[0]}</span>
                    </div>
                  )}
                </div>
              ) : variant === 'ambient' ? (
                <EffectPreview item={item} variant={variant} />
              ) : (
                <EffectPreview item={item} variant={variant} />
              )}
            </div>

            {/* Name */}
            <p className="text-sm font-bold text-white text-center mb-0.5">{item.name}</p>

            {/* Action */}
            <div className="absolute bottom-3 left-3 right-3">
              {equipped ? (
                <div className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40">
                  <Check className="w-3.5 h-3.5 text-[#3AAFA9]" />
                  <span className="text-[11px] font-bold text-[#3AAFA9] tracking-wider">EQUIPPED</span>
                </div>
              ) : owned ? (
                <button
                  onClick={() => onEquip(item)}
                  className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold tracking-wider hover:bg-white/10 transition-colors"
                >
                  EQUIP
                </button>
              ) : (
                <button
                  onClick={() => onPurchase(item)}
                  disabled={purchasingId === item.id || !canAfford}
                  className="w-full py-2 rounded-lg bg-[#3AAFA9]/15 border border-[#3AAFA9]/40 text-[#3AAFA9] text-[11px] font-bold tracking-wider hover:bg-[#3AAFA9]/25 transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {purchasingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Coins className="w-3 h-3" />
                      {item.price}
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}