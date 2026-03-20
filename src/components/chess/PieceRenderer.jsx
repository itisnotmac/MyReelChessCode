import React from 'react';

// ─── SHARED GRADIENT DEFS ─────────────────────────────────────────────────────
// Each SVG inlines its own <defs> so gradients are self-contained.

function King({ isWhite }) {
  const id = isWhite ? 'wk' : 'bk';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574', hair:'#8B6914', robe:'#FFFFFF', robeD:'#C8C8C8',
    throne:'#E0E0E0', throneH:'#FFFFFF', gem:'#AAAAAA', crown:'#F0F0F0', crownH:'#FFFFFF',
    metal:'#D0D0D0', outline:'#333333', shadow:'rgba(0,0,0,0.4)'
  } : {
    skin:'#C68642', skinD:'#8B5E2A', hair:'#111111', robe:'#111111', robeD:'#000000',
    throne:'#1A1A1A', throneH:'#333333', gem:'#444444', crown:'#222222', crownH:'#444444',
    metal:'#2A2A2A', outline:'#000000', shadow:'rgba(0,0,0,0.8)'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={g.skin}/>
          <stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}robe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.robe}/>
          <stop offset="100%" stopColor={g.robeD}/>
        </linearGradient>
        <linearGradient id={`${id}throne`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.throneH}/>
          <stop offset="100%" stopColor={g.throne}/>
        </linearGradient>
        <linearGradient id={`${id}crown`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.crownH}/>
          <stop offset="100%" stopColor={g.crown}/>
        </linearGradient>
        <filter id={`${id}glow`}><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Throne back panel */}
      <rect x="10" y="18" width="60" height="52" rx="5" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.5"/>
      <rect x="13" y="21" width="54" height="46" rx="3" fill={`url(#${id}robe)`} stroke={g.outline} strokeWidth="0.8" opacity="0.7"/>
      {/* Throne side pillars */}
      <rect x="10" y="18" width="10" height="52" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
      <rect x="60" y="18" width="10" height="52" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Throne top arch */}
      <path d="M10 22 Q40 8 70 22" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.5"/>
      {/* Jewels on throne */}
      <circle cx="40" cy="14" r="3" fill={g.gem} stroke={g.outline} strokeWidth="0.8"/>
      <ellipse cx="20" cy="22" rx="2" ry="2" fill={g.gem} stroke={g.outline} strokeWidth="0.6"/>
      <ellipse cx="60" cy="22" rx="2" ry="2" fill={g.gem} stroke={g.outline} strokeWidth="0.6"/>

      {/* Body / robes */}
      <path d="M24 68 Q25 48 40 46 Q55 48 56 68 Z" fill={`url(#${id}robe)`} stroke={g.outline} strokeWidth="1"/>
      {/* Robe folds */}
      <path d="M30 55 L27 68" stroke={g.outline} strokeWidth="0.6" opacity="0.4"/>
      <path d="M40 52 L40 68" stroke={g.outline} strokeWidth="0.6" opacity="0.4"/>
      <path d="M50 55 L53 68" stroke={g.outline} strokeWidth="0.6" opacity="0.4"/>
      {/* Belt / sash */}
      <path d="M27 54 Q40 52 53 54" stroke={g.metal} strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Arms resting on throne arms */}
      <path d="M20 46 Q18 52 19 58" stroke={g.outline} strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.15"/>
      <path d="M20 46 Q18 52 19 58" stroke={g.robe} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M60 46 Q62 52 61 58" stroke={g.outline} strokeWidth="5" strokeLinecap="round" fill="none" strokeOpacity="0.15"/>
      <path d="M60 46 Q62 52 61 58" stroke={g.robe} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Hands */}
      <ellipse cx="19" cy="59" rx="3" ry="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="61" cy="59" rx="3" ry="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Neck */}
      <rect x="36" y="38" width="8" height="9" rx="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Head */}
      <ellipse cx="40" cy="33" rx="12" ry="13" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="1"/>
      {/* Ear */}
      <ellipse cx="28.5" cy="33" rx="2.5" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="51.5" cy="33" rx="2.5" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      {/* Hair / beard */}
      <path d="M29 28 Q31 22 40 21 Q49 22 51 28" fill={g.hair} stroke={g.outline} strokeWidth="0.7"/>
      <path d="M30 38 Q33 45 40 46 Q47 45 50 38" fill={g.hair} stroke={g.outline} strokeWidth="0.7"/>
      <path d="M30 40 Q35 48 40 48 Q45 48 50 40" fill={g.hair} opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="35.5" cy="32" rx="3" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      <ellipse cx="44.5" cy="32" rx="3" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      <circle cx="36" cy="32.5" r="1.8" fill={isWhite ? '#4A3020' : '#5C0A8C'}/>
      <circle cx="45" cy="32.5" r="1.8" fill={isWhite ? '#4A3020' : '#5C0A8C'}/>
      <circle cx="36.7" cy="31.8" r="0.6" fill="white"/>
      <circle cx="45.7" cy="31.8" r="0.6" fill="white"/>
      {/* Eyebrows */}
      <path d="M33 29.5 Q35.5 28.5 38 29.5" stroke={g.hair} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M42 29.5 Q44.5 28.5 47 29.5" stroke={g.hair} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M39 33 Q38.5 36 40 37 Q41.5 36 41 33" stroke={g.skinD} strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      {/* Mouth / stern expression */}
      <path d="M36 39 Q40 40.5 44 39" stroke={g.outline} strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Crown */}
      <path d="M29 26 L32 18 L37 23 L40 15 L43 23 L48 18 L51 26 Z" fill={`url(#${id}crown)`} stroke={g.outline} strokeWidth="1.2" filter={`url(#${id}glow)`}/>
      <rect x="29" y="24" width="22" height="4" rx="1.5" fill={`url(#${id}crown)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Crown gems */}
      <circle cx="40" cy="16" r="2.2" fill={g.gem} stroke={g.outline} strokeWidth="0.7"/>
      <circle cx="32" cy="19" r="1.5" fill={isWhite ? '#3498DB' : '#FFD700'} stroke={g.outline} strokeWidth="0.6"/>
      <circle cx="48" cy="19" r="1.5" fill={isWhite ? '#3498DB' : '#FFD700'} stroke={g.outline} strokeWidth="0.6"/>

      {/* Base */}
      <rect x="8" y="68" width="64" height="8" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
      <rect x="12" y="70" width="56" height="4" rx="2" fill={g.metal} opacity="0.3"/>
    </svg>
  );
}

function Queen({ isWhite }) {
  const id = isWhite ? 'wq' : 'bq';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574', hair:'#8B6914', robe:'#FFFFFF', robeD:'#DDDDDD',
    throne:'#E8E8E8', throneH:'#FFFFFF', gem:'#BBBBBB', crown:'#F0F0F0', crownH:'#FFFFFF',
    metal:'#D0D0D0', gown:'#F5F5F5', outline:'#333333', shadow:'rgba(0,0,0,0.4)'
  } : {
    skin:'#C68642', skinD:'#8B5E2A', hair:'#111111', robe:'#111111', robeD:'#000000',
    throne:'#1A1A1A', throneH:'#333333', gem:'#333333', crown:'#1A1A1A', crownH:'#333333',
    metal:'#222222', gown:'#0A0A0A', outline:'#000000', shadow:'rgba(0,0,0,0.8)'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor={g.skin}/>
          <stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}gown`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={g.gown}/>
          <stop offset="100%" stopColor={g.robe}/>
        </linearGradient>
        <linearGradient id={`${id}throne`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={g.throneH}/>
          <stop offset="100%" stopColor={g.throne}/>
        </linearGradient>
        <radialGradient id={`${id}hair`} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={isWhite ? '#C87941' : '#3D0050'}/>
          <stop offset="100%" stopColor={g.hair}/>
        </radialGradient>
        <filter id={`${id}glow`}><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Throne */}
      <rect x="10" y="18" width="60" height="52" rx="5" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.5"/>
      <rect x="10" y="18" width="10" height="52" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
      <rect x="60" y="18" width="10" height="52" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
      <path d="M10 22 Q40 8 70 22" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.5"/>
      <circle cx="40" cy="13" r="3.5" fill={g.gem} stroke={g.outline} strokeWidth="0.8"/>
      <circle cx="20" cy="21" r="2" fill={isWhite ? '#9B59B6' : '#FFD700'} stroke={g.outline} strokeWidth="0.6"/>
      <circle cx="60" cy="21" r="2" fill={isWhite ? '#9B59B6' : '#FFD700'} stroke={g.outline} strokeWidth="0.6"/>

      {/* Wide elegant gown */}
      <path d="M20 70 Q18 52 40 48 Q62 52 60 70 Z" fill={`url(#${id}gown)`} stroke={g.outline} strokeWidth="1"/>
      {/* Gown layers / folds */}
      <path d="M25 58 Q40 55 55 58 Q54 64 40 66 Q26 64 25 58 Z" fill={g.robe} stroke={g.outline} strokeWidth="0.6" opacity="0.6"/>
      <path d="M22 65 Q40 62 58 65" stroke={g.metal} strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M22 68 Q40 65 58 68" stroke={g.metal} strokeWidth="1" fill="none" opacity="0.5"/>
      {/* Bodice */}
      <path d="M29 48 Q40 46 51 48 L51 55 Q40 53 29 55 Z" fill={g.robe} stroke={g.outline} strokeWidth="0.8"/>
      <path d="M34 49 L34 55" stroke={g.metal} strokeWidth="0.7" opacity="0.6"/>
      <path d="M40 48 L40 55" stroke={g.metal} strokeWidth="0.7" opacity="0.6"/>
      <path d="M46 49 L46 55" stroke={g.metal} strokeWidth="0.7" opacity="0.6"/>

      {/* Arms - graceful pose */}
      <path d="M29 49 Q22 52 20 58" stroke={g.gown} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M51 49 Q58 52 60 58" stroke={g.gown} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <ellipse cx="19.5" cy="59" rx="3.5" ry="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="60.5" cy="59" rx="3.5" ry="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Neck */}
      <path d="M36 40 Q40 38 44 40 L44 48 Q40 46 36 48 Z" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      {/* Necklace */}
      <path d="M36 42 Q40 45 44 42" stroke={g.metal} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="44.5" r="1.5" fill={g.gem} stroke={g.outline} strokeWidth="0.5"/>

      {/* Head */}
      <ellipse cx="40" cy="33" rx="11.5" ry="12.5" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="1"/>
      <ellipse cx="29" cy="33" rx="2" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="51" cy="33" rx="2" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Hair - flowing */}
      <path d="M29 28 Q31 20 40 19 Q49 20 51 28" fill={`url(#${id}hair)`} stroke={g.outline} strokeWidth="0.8"/>
      <path d="M29 30 Q26 40 27 48" stroke={`url(#${id}hair)`} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M51 30 Q54 40 53 48" stroke={`url(#${id}hair)`} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M29 30 Q27 38 28 46" fill={g.hair} stroke={g.outline} strokeWidth="0.5" opacity="0.7"/>

      {/* Eyes */}
      <ellipse cx="36" cy="31.5" rx="3.2" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      <ellipse cx="44" cy="31.5" rx="3.2" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      {/* Lashes */}
      <path d="M33 30 Q34 28.5 36 29.5" stroke={g.outline} strokeWidth="0.8" fill="none"/>
      <path d="M47 30 Q46 28.5 44 29.5" stroke={g.outline} strokeWidth="0.8" fill="none"/>
      <circle cx="36.5" cy="32" r="1.8" fill={isWhite ? '#6B3A2A' : '#6A0DAD'}/>
      <circle cx="44.5" cy="32" r="1.8" fill={isWhite ? '#6B3A2A' : '#6A0DAD'}/>
      <circle cx="37.2" cy="31.3" r="0.6" fill="white"/>
      <circle cx="45.2" cy="31.3" r="0.6" fill="white"/>
      {/* Eyebrows - arched */}
      <path d="M33.5 29 Q36 27.5 38.5 29" stroke={g.hair} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M41.5 29 Q44 27.5 46.5 29" stroke={g.hair} strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M39 33 Q38.5 35.5 40 36.5 Q41.5 35.5 41 33" stroke={g.skinD} strokeWidth="0.7" fill="none"/>
      {/* Lips */}
      <path d="M36.5 38.5 Q40 40.5 43.5 38.5" fill={isWhite ? '#C0392B' : '#E91E8C'} stroke={g.outline} strokeWidth="0.5"/>
      <path d="M36.5 38.5 Q40 37 43.5 38.5" fill={isWhite ? '#E8998D' : '#F48FB1'} stroke={g.outline} strokeWidth="0.5"/>

      {/* Tiara / crown */}
      <path d="M29 26 L31 19 L34.5 23 L37 17 L40 14 L43 17 L45.5 23 L49 19 L51 26 Z" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1" filter={`url(#${id}glow)`}/>
      <rect x="29" y="24" width="22" height="3.5" rx="1.5" fill={g.metal} stroke={g.outline} strokeWidth="0.7"/>
      <circle cx="40" cy="14.5" r="2.5" fill={g.gem} stroke={g.outline} strokeWidth="0.7"/>
      <circle cx="34.5" cy="18" r="1.5" fill={isWhite ? '#2980B9' : '#FFD700'} stroke={g.outline} strokeWidth="0.5"/>
      <circle cx="45.5" cy="18" r="1.5" fill={isWhite ? '#2980B9' : '#FFD700'} stroke={g.outline} strokeWidth="0.5"/>

      {/* Base */}
      <rect x="8" y="68" width="64" height="8" rx="3" fill={`url(#${id}throne)`} stroke={g.outline} strokeWidth="1.2"/>
    </svg>
  );
}

function Knight({ isWhite }) {
  const id = isWhite ? 'wn' : 'bn';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574',
    armor:'#F0F0F0', armorD:'#C0C0C0', armorH:'#FFFFFF',
    horse:'#C8BEB0', horseD:'#A09080', horseMane:'#888080',
    accent:'#D8D8D8', plume:'#E0E0E0',
    outline:'#333333', cloth:'#C0C0C0'
  } : {
    skin:'#C68642', skinD:'#8B5E2A',
    armor:'#111111', armorD:'#000000', armorH:'#2A2A2A',
    horse:'#1A1410', horseD:'#0A0A08', horseMane:'#050505',
    accent:'#222222', plume:'#1A1A1A',
    outline:'#000000', cloth:'#111111'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor={g.skin}/><stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}armor`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={g.armorH}/><stop offset="60%" stopColor={g.armor}/><stop offset="100%" stopColor={g.armorD}/>
        </linearGradient>
        <radialGradient id={`${id}horse`} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor={g.horse}/><stop offset="100%" stopColor={g.horseD}/>
        </radialGradient>
      </defs>

      {/* Horse body (rearing pose) */}
      <path d="M12 72 Q14 58 18 50 Q20 44 18 38 Q17 30 22 24 Q26 20 28 26 Q30 22 34 22 Q38 20 40 24 Q44 20 46 26 Q50 28 48 36 Q46 44 48 54 Q52 62 54 72 Z"
        fill={`url(#${id}horse)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Horse head */}
      <path d="M18 38 Q14 30 16 22 Q18 16 22 14 Q26 12 28 16 Q32 14 34 18 Q38 16 38 22 Q36 26 32 28 Q28 32 28 36 Q24 40 20 40 Z"
        fill={`url(#${id}horse)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Horse nostril */}
      <ellipse cx="22" cy="22" rx="1.5" ry="1" fill={g.horseD} stroke={g.outline} strokeWidth="0.5"/>
      {/* Horse eye */}
      <circle cx="30" cy="19" r="2" fill={g.horseMane} stroke={g.outline} strokeWidth="0.7"/>
      <circle cx="30.6" cy="18.4" r="0.7" fill="white" opacity="0.8"/>
      {/* Horse mouth */}
      <path d="M18 24 Q20 26 22 24" stroke={g.outline} strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Mane */}
      <path d="M28 16 Q26 10 24 8 Q28 9 30 12 Q32 8 34 7 Q35 12 34 16 Q32 14 30 16 Q29 13 28 16"
        fill={g.horseMane} stroke={g.outline} strokeWidth="0.7"/>
      {/* Horse forelegs raised */}
      <path d="M22 50 Q18 58 16 66 Q18 68 20 66 Q22 60 25 54" fill={g.horse} stroke={g.outline} strokeWidth="1" strokeLinejoin="round"/>
      <path d="M36 52 Q32 60 30 68 Q32 70 34 68 Q36 62 38 56" fill={g.horse} stroke={g.outline} strokeWidth="1" strokeLinejoin="round"/>
      {/* Hind legs */}
      <rect x="40" y="58" width="7" height="14" rx="2" fill={g.horse} stroke={g.outline} strokeWidth="1"/>
      <rect x="50" y="58" width="7" height="14" rx="2" fill={g.horse} stroke={g.outline} strokeWidth="1"/>
      {/* Hooves */}
      <rect x="14" y="64" width="8" height="5" rx="2" fill={g.horseD} stroke={g.outline} strokeWidth="0.8"/>
      <rect x="28" y="66" width="8" height="5" rx="2" fill={g.horseD} stroke={g.outline} strokeWidth="0.8"/>
      <rect x="39" y="70" width="9" height="5" rx="2" fill={g.horseD} stroke={g.outline} strokeWidth="0.8"/>
      <rect x="49" y="70" width="9" height="5" rx="2" fill={g.horseD} stroke={g.outline} strokeWidth="0.8"/>
      {/* Tail */}
      <path d="M54 60 Q62 55 64 48 Q66 42 62 38" stroke={g.horseMane} strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M54 60 Q64 58 66 52 Q68 46 64 40" stroke={g.horseMane} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Rider - sitting astride */}
      {/* Rider legs */}
      <path d="M30 48 Q24 52 22 60" stroke={g.armor} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M46 48 Q52 52 54 60" stroke={g.armor} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Knee guards */}
      <circle cx="23" cy="58" r="3.5" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      <circle cx="53" cy="58" r="3.5" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Torso armor - breastplate */}
      <path d="M28 30 Q28 24 38 22 Q48 24 48 30 L46 46 Q40 44 34 46 Z"
        fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Breastplate detail */}
      <path d="M33 26 Q38 24.5 43 26 L42 40 Q38 38.5 34 40 Z" fill={g.armorH} stroke={g.outline} strokeWidth="0.5" opacity="0.5"/>
      <line x1="38" y1="24" x2="38" y2="42" stroke={g.outline} strokeWidth="0.8" opacity="0.4"/>
      {/* Pauldrons */}
      <ellipse cx="27" cy="28" rx="5" ry="3.5" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1" transform="rotate(-20 27 28)"/>
      <ellipse cx="49" cy="28" rx="5" ry="3.5" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1" transform="rotate(20 49 28)"/>
      {/* Sword arm */}
      <path d="M48 30 Q54 26 58 20" stroke={`url(#${id}armor)`} strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Sword */}
      <line x1="56" y1="22" x2="68" y2="6" stroke={g.armorH} strokeWidth="2" strokeLinecap="round"/>
      <path d="M56 22 L52 20 L54 24 Z" fill={g.accent} stroke={g.outline} strokeWidth="0.7"/>
      <rect x="57" y="19" width="6" height="1.5" rx="0.5" fill={g.accent} stroke={g.outline} strokeWidth="0.5" transform="rotate(-45 60 20)"/>
      {/* Shield arm */}
      <path d="M28 30 Q22 34 20 40" stroke={`url(#${id}armor)`} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M16 36 Q13 42 16 48 Q22 50 26 46 Q28 40 26 36 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M19 38 Q16 42 19 46 Q22 47 24 44 Q25 41 24 38 Z" fill={g.accent} stroke={g.outline} strokeWidth="0.5" opacity="0.6"/>

      {/* Helmet */}
      <ellipse cx="38" cy="20" rx="10" ry="9" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Visor */}
      <rect x="30" y="20" width="16" height="4" rx="1.5" fill={g.armorD} stroke={g.outline} strokeWidth="0.8"/>
      <line x1="30.5" y1="22" x2="45.5" y2="22" stroke={g.armorH} strokeWidth="0.5" opacity="0.5"/>
      {/* Cheek guards */}
      <path d="M30 20 Q27 24 28 30" stroke={g.armorD} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M46 20 Q49 24 48 30" stroke={g.armorD} strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Plume */}
      <path d="M38 12 Q34 6 30 4 Q33 8 34 12" fill={g.plume} stroke={g.outline} strokeWidth="0.8"/>
      <path d="M38 12 Q38 5 36 2 Q39 6 40 12" fill={isWhite ? '#E74C3C' : '#9B59B6'} stroke={g.outline} strokeWidth="0.8" opacity="0.8"/>
      {/* Helmet ridge */}
      <path d="M30 16 Q38 14 46 16" stroke={g.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function Bishop({ isWhite }) {
  const id = isWhite ? 'wb' : 'bb';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574',
    robe:'#F5F5F5', robeD:'#D0D0D0', robeH:'#FFFFFF',
    hood:'#E0E0E0', hoodD:'#BBBBBB',
    accent:'#D0D0D0', staff:'#B8B8B8',
    gem:'#CCCCCC', eye:'#E8E8E8',
    outline:'#333333'
  } : {
    skin:'#C68642', skinD:'#8B5E2A',
    robe:'#0A0A0A', robeD:'#000000', robeH:'#1A1A1A',
    hood:'#080808', hoodD:'#000000',
    accent:'#222222', staff:'#111111',
    gem:'#1A1A1A', eye:'#888888',
    outline:'#000000'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={g.skin}/><stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}robe`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={g.robeH}/><stop offset="50%" stopColor={g.robe}/><stop offset="100%" stopColor={g.robeD}/>
        </linearGradient>
        <linearGradient id={`${id}hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.hoodD}/><stop offset="100%" stopColor={g.hood}/>
        </linearGradient>
        <filter id={`${id}glow`}><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id={`${id}eyeGlow`}><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Wide flowing robe base */}
      <path d="M8 76 Q10 52 40 48 Q70 52 72 76 Z" fill={`url(#${id}robe)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Robe folds / depth */}
      <path d="M16 65 Q40 60 64 65 Q62 72 40 74 Q18 72 16 65 Z" fill={g.robeD} stroke={g.outline} strokeWidth="0.5" opacity="0.5"/>
      <path d="M20 70 L18 76" stroke={g.robe} strokeWidth="1" opacity="0.4"/>
      <path d="M32 62 L30 76" stroke={g.robe} strokeWidth="1" opacity="0.3"/>
      <path d="M40 60 L40 76" stroke={g.robe} strokeWidth="1" opacity="0.3"/>
      <path d="M48 62 L50 76" stroke={g.robe} strokeWidth="1" opacity="0.3"/>
      <path d="M60 70 L62 76" stroke={g.robe} strokeWidth="1" opacity="0.4"/>
      {/* Upper robe */}
      <path d="M22 48 Q22 40 40 38 Q58 40 58 48 L56 60 Q40 57 24 60 Z" fill={`url(#${id}robe)`} stroke={g.outline} strokeWidth="1"/>
      {/* Robe trim / border */}
      <path d="M22 48 Q40 44 58 48" stroke={g.accent} strokeWidth="1.5" fill="none"/>
      <path d="M24 55 Q40 51 56 55" stroke={g.accent} strokeWidth="1" fill="none" opacity="0.7"/>
      {/* Cross / holy symbol */}
      <line x1="40" y1="44" x2="40" y2="56" stroke={g.accent} strokeWidth="2" strokeLinecap="round"/>
      <line x1="35" y1="48" x2="45" y2="48" stroke={g.accent} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="40" cy="48" r="1.5" fill={g.gem} filter={`url(#${id}glow)`}/>

      {/* Arms beneath robe - hands clasped */}
      <path d="M22 48 Q16 52 14 58" stroke={g.robe} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M58 48 Q64 52 66 58" stroke={g.robe} strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Hands */}
      <ellipse cx="14" cy="59" rx="3.5" ry="2.5" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="66" cy="59" rx="3.5" ry="2.5" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Staff */}
      <line x1="66" y1="12" x2="70" y2="76" stroke={g.staff} strokeWidth="3" strokeLinecap="round"/>
      <line x1="66" y1="12" x2="70" y2="76" stroke={g.accent} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      {/* Staff top orb */}
      <circle cx="66" cy="12" r="6" fill={g.accent} stroke={g.outline} strokeWidth="1"/>
      <circle cx="66" cy="12" r="3.5" fill={g.gem} stroke={g.outline} strokeWidth="0.7" filter={`url(#${id}glow)`}/>
      <circle cx="64.5" cy="10.5" r="1.2" fill="white" opacity="0.6"/>

      {/* Deep hood - the defining feature */}
      <path d="M20 42 Q20 20 40 12 Q60 20 60 42 Q60 50 40 52 Q20 50 20 42 Z"
        fill={`url(#${id}hood)`} stroke={g.outline} strokeWidth="1.5"/>
      {/* Hood shadow interior */}
      <path d="M25 40 Q25 24 40 18 Q55 24 55 40 Q55 47 40 49 Q25 47 25 40 Z"
        fill={g.robeD} opacity="0.8"/>
      {/* Hood drape folds */}
      <path d="M20 42 Q16 50 18 60" stroke={g.hood} strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M60 42 Q64 50 62 60" stroke={g.hood} strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Hood peak */}
      <path d="M34 16 Q40 4 46 16" fill={g.hoodD} stroke={g.outline} strokeWidth="1"/>

      {/* Face peering from hood shadow */}
      <ellipse cx="40" cy="36" rx="10" ry="11" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Deep shadow above eyes from hood */}
      <path d="M30 30 Q40 26 50 30 Q50 28 40 27 Q30 28 30 30 Z" fill="rgba(0,0,0,0.5)"/>
      {/* Nose */}
      <path d="M38.5 34 Q38 37 40 38 Q42 37 41.5 34" stroke={g.skinD} strokeWidth="0.8" fill="none"/>
      {/* Mouth - thin, serious */}
      <path d="M35.5 41 Q40 42 44.5 41" stroke={g.outline} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Glowing eyes */}
      <ellipse cx="35.5" cy="33" rx="3.5" ry="2.5" fill="black"/>
      <ellipse cx="44.5" cy="33" rx="3.5" ry="2.5" fill="black"/>
      <circle cx="35.5" cy="33" r="2.2" fill={g.eye} opacity="0.9" filter={`url(#${id}eyeGlow)`}/>
      <circle cx="44.5" cy="33" r="2.2" fill={g.eye} opacity="0.9" filter={`url(#${id}eyeGlow)`}/>
      <circle cx="36.2" cy="32.2" r="0.8" fill="white" opacity="0.8"/>
      <circle cx="45.2" cy="32.2" r="0.8" fill="white" opacity="0.8"/>
      {/* Eyebrows - furrowed */}
      <path d="M32 30.5 Q35.5 29 38 30.5" stroke={g.hoodD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M42 30.5 Q44.5 29 48 30.5" stroke={g.hoodD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* Base */}
      <rect x="8" y="74" width="64" height="6" rx="3" fill={g.hoodD} stroke={g.outline} strokeWidth="1"/>
      <rect x="12" y="75" width="56" height="3" rx="1.5" fill={g.accent} opacity="0.3"/>
    </svg>
  );
}

function Rook({ isWhite }) {
  const id = isWhite ? 'wr' : 'br';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574', skinShadow:'rgba(0,0,0,0.2)',
    armor:'#F0F0F0', armorD:'#C8C8C8', armorH:'#FFFFFF',
    fur:'#DDDDDD', furD:'#BBBBBB',
    accent:'#E0E0E0', blood:'#CCCCCC',
    beard:'#DDDDDD', beardD:'#BBBBBB',
    outline:'#333333', cloth:'#D0D0D0'
  } : {
    skin:'#C68642', skinD:'#8B5E2A', skinShadow:'rgba(0,0,0,0.6)',
    armor:'#111111', armorD:'#000000', armorH:'#222222',
    fur:'#0A0A0A', furD:'#000000',
    accent:'#1A1A1A', blood:'#0A0A0A',
    beard:'#111111', beardD:'#080808',
    outline:'#000000', cloth:'#0A0A0A'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={g.skin}/><stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}armor`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={g.armorH}/><stop offset="50%" stopColor={g.armor}/><stop offset="100%" stopColor={g.armorD}/>
        </linearGradient>
        <linearGradient id={`${id}fur`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.fur}/><stop offset="100%" stopColor={g.furD}/>
        </linearGradient>
      </defs>

      {/* Legs - powerful, wide stance */}
      <path d="M20 56 Q18 64 16 76 Q20 78 24 76 Q24 68 26 58 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M60 56 Q62 64 64 76 Q60 78 56 76 Q56 68 54 58 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      {/* Boots / fur boots */}
      <path d="M14 70 Q14 76 20 78 Q28 78 28 72 Q26 68 20 68 Z" fill={`url(#${id}fur)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M66 70 Q66 76 60 78 Q52 78 52 72 Q54 68 60 68 Z" fill={`url(#${id}fur)`} stroke={g.outline} strokeWidth="1"/>
      {/* Knee armor */}
      <ellipse cx="22" cy="60" rx="5" ry="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <ellipse cx="58" cy="60" rx="5" ry="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>

      {/* Huge barrel chest */}
      <ellipse cx="40" cy="46" rx="20" ry="17" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.5"/>
      {/* Chest fur collar */}
      <path d="M20 40 Q40 34 60 40 Q58 46 40 48 Q22 46 20 40 Z" fill={`url(#${id}fur)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Chest hair texture */}
      <path d="M26 40 Q28 36 32 38" stroke={g.furD} strokeWidth="0.7" fill="none"/>
      <path d="M34 37 Q36 33 40 35" stroke={g.furD} strokeWidth="0.7" fill="none"/>
      <path d="M42 37 Q44 33 48 35" stroke={g.furD} strokeWidth="0.7" fill="none"/>
      <path d="M50 40 Q52 36 56 38" stroke={g.furD} strokeWidth="0.7" fill="none"/>
      {/* Battle scars */}
      <path d="M44 38 Q46 42 44 46" stroke={g.accent} strokeWidth="0.8" fill="none" opacity="0.6"/>
      {/* Belt */}
      <rect x="22" y="56" width="36" height="5" rx="1.5" fill={g.fur} stroke={g.outline} strokeWidth="1"/>
      <rect x="37" y="56" width="6" height="5" rx="1" fill={g.accent} stroke={g.outline} strokeWidth="0.8"/>
      <circle cx="40" cy="58.5" r="1.5" fill={isWhite ? '#FFD700' : '#C0392B'}/>

      {/* Right arm - holding axe HIGH */}
      <path d="M20 38 Q12 30 8 22" stroke={`url(#${id}armor)`} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d="M20 38 Q12 30 8 22" stroke={g.outline} strokeWidth="9.5" strokeLinecap="round" fill="none" opacity="0.2"/>
      {/* Axe handle */}
      <line x1="8" y1="22" x2="4" y2="6" stroke={g.cloth} strokeWidth="3" strokeLinecap="round"/>
      {/* Axe head - massive */}
      <path d="M4 6 Q-2 2 0 10 Q2 14 6 14 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M4 6 Q10 0 10 6 Q10 12 6 14 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      {/* Axe highlight */}
      <path d="M2 8 Q0 6 2 10" stroke={g.armorH} strokeWidth="0.8" fill="none" opacity="0.8"/>
      {/* Blood on axe */}
      <path d="M0 8 Q-1 10 1 12" stroke={g.blood} strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* Left arm - shield arm */}
      <path d="M60 38 Q68 34 72 40" stroke={`url(#${id}armor)`} strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* Round shield */}
      <circle cx="74" cy="40" r="9" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      <circle cx="74" cy="40" r="6" fill="none" stroke={g.accent} strokeWidth="1"/>
      <circle cx="74" cy="40" r="2" fill={g.accent} stroke={g.outline} strokeWidth="0.7"/>
      {/* Shield battle dents */}
      <path d="M68 34 Q70 36 69 38" stroke={g.armorD} strokeWidth="1" fill="none" opacity="0.6"/>
      <path d="M78 38 Q76 40 77 42" stroke={g.armorD} strokeWidth="1" fill="none" opacity="0.6"/>

      {/* Neck - thick */}
      <rect x="34" y="27" width="12" height="10" rx="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="1"/>

      {/* Head - massive, square jawed */}
      <rect x="26" y="14" width="28" height="26" rx="6" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Jaw definition */}
      <path d="M26 30 Q28 40 40 42 Q52 40 54 30" fill={g.skinD} stroke={g.outline} strokeWidth="0.6" opacity="0.5"/>

      {/* Viking helmet */}
      <path d="M26 20 Q26 8 40 6 Q54 8 54 20" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.5"/>
      {/* Helmet brim */}
      <rect x="23" y="19" width="34" height="4" rx="2" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Nose guard */}
      <rect x="38" y="21" width="4" height="9" rx="1.5" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Horns */}
      <path d="M26 16 Q18 8 14 12 Q16 18 22 20 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M54 16 Q62 8 66 12 Q64 18 58 20 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      {/* Horn tips */}
      <ellipse cx="14" cy="11.5" rx="2" ry="3" fill={g.armorH} stroke={g.outline} strokeWidth="0.7" transform="rotate(-20 14 12)"/>
      <ellipse cx="66" cy="11.5" rx="2" ry="3" fill={g.armorH} stroke={g.outline} strokeWidth="0.7" transform="rotate(20 66 12)"/>
      {/* Helmet ridge */}
      <line x1="28" y1="12" x2="52" y2="12" stroke={g.accent} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Eyes - furious */}
      <ellipse cx="33" cy="26" rx="4" ry="3" fill="white" stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="47" cy="26" rx="4" ry="3" fill="white" stroke={g.outline} strokeWidth="0.7"/>
      <circle cx="34" cy="26.5" r="2.5" fill={isWhite ? '#3D2B1A' : '#8B0000'}/>
      <circle cx="48" cy="26.5" r="2.5" fill={isWhite ? '#3D2B1A' : '#8B0000'}/>
      <circle cx="35" cy="25.5" r="0.8" fill="white"/>
      <circle cx="49" cy="25.5" r="0.8" fill="white"/>
      {/* Angry brows */}
      <path d="M29 23 Q33 21 37 23" stroke={g.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M43 23 Q47 21 51 23" stroke={g.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M38 28 Q38 31 40 32 Q42 31 42 28" stroke={g.skinD} strokeWidth="0.9" fill="none"/>
      {/* Snarling mouth */}
      <path d="M33 35 Q40 38 47 35" fill={g.skinD} stroke={g.outline} strokeWidth="0.8"/>
      <path d="M35 35 Q40 36.5 45 35" fill="white" stroke={g.outline} strokeWidth="0.5"/>
      {/* Teeth */}
      <line x1="37" y1="35" x2="37" y2="37" stroke={g.outline} strokeWidth="0.5"/>
      <line x1="40" y1="35" x2="40" y2="37" stroke={g.outline} strokeWidth="0.5"/>
      <line x1="43" y1="35" x2="43" y2="37" stroke={g.outline} strokeWidth="0.5"/>

      {/* Massive beard */}
      <path d="M26 34 Q28 44 30 50 Q35 55 40 55 Q45 55 50 50 Q52 44 54 34"
        fill={g.beard} stroke={g.outline} strokeWidth="1"/>
      {/* Beard texture */}
      <path d="M30 38 Q32 46 30 52" stroke={g.beardD} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M35 36 Q36 44 35 52" stroke={g.beardD} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M40 36 L40 54" stroke={g.beardD} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M45 36 Q44 44 45 52" stroke={g.beardD} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M50 38 Q48 46 50 52" stroke={g.beardD} strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Braids */}
      <path d="M28 42 Q26 48 28 54" stroke={g.furD} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M52 42 Q54 48 52 54" stroke={g.furD} strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function Pawn({ isWhite }) {
  const id = isWhite ? 'wp' : 'bp';
  const g = isWhite ? {
    skin:'#F2C98A', skinD:'#D4A574',
    armor:'#F0F0F0', armorD:'#C8C8C8', armorH:'#FFFFFF',
    cloth:'#E8E8E8', clothD:'#C8C8C8',
    accent:'#D8D8D8',
    outline:'#333333'
  } : {
    skin:'#C68642', skinD:'#8B5E2A',
    armor:'#111111', armorD:'#000000', armorH:'#222222',
    cloth:'#0A0A0A', clothD:'#000000',
    accent:'#1A1A1A',
    outline:'#000000'
  };
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}skin`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={g.skin}/><stop offset="100%" stopColor={g.skinD}/>
        </radialGradient>
        <linearGradient id={`${id}armor`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={g.armorH}/><stop offset="55%" stopColor={g.armor}/><stop offset="100%" stopColor={g.armorD}/>
        </linearGradient>
        <linearGradient id={`${id}cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={g.cloth}/><stop offset="100%" stopColor={g.clothD}/>
        </linearGradient>
      </defs>

      {/* Legs */}
      <path d="M24 58 Q22 66 20 76 Q24 78 28 76 Q28 68 30 60 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      <path d="M56 58 Q58 66 60 76 Q56 78 52 76 Q52 68 50 60 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      {/* Greaves (lower leg armor) */}
      <rect x="19" y="65" width="10" height="12" rx="2" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      <rect x="51" y="65" width="10" height="12" rx="2" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Boot toes */}
      <ellipse cx="23" cy="77" rx="6" ry="2.5" fill={g.armorD} stroke={g.outline} strokeWidth="0.8"/>
      <ellipse cx="57" cy="77" rx="6" ry="2.5" fill={g.armorD} stroke={g.outline} strokeWidth="0.8"/>
      {/* Knee cops */}
      <circle cx="25" cy="61" r="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      <circle cx="55" cy="61" r="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>

      {/* Cloth undershirt / tabard */}
      <path d="M22 56 Q22 44 40 42 Q58 44 58 56 L56 70 Q40 67 24 70 Z" fill={`url(#${id}cloth)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Tabard cross / emblem */}
      <line x1="40" y1="46" x2="40" y2="60" stroke={g.accent} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="34" y1="52" x2="46" y2="52" stroke={g.accent} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Breastplate over tabard */}
      <path d="M26 44 Q26 38 40 36 Q54 38 54 44 L52 56 Q40 54 28 56 Z"
        fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Breastplate ridge */}
      <line x1="40" y1="37" x2="40" y2="54" stroke={g.armorH} strokeWidth="0.8" opacity="0.5"/>
      <path d="M30 42 Q40 40 50 42" stroke={g.armorH} strokeWidth="0.6" opacity="0.4"/>
      {/* Pauldrons */}
      <ellipse cx="25" cy="40" rx="6" ry="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1" transform="rotate(-15 25 40)"/>
      <ellipse cx="55" cy="40" rx="6" ry="4" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1" transform="rotate(15 55 40)"/>
      {/* Belt */}
      <rect x="26" y="55" width="28" height="4" rx="1.5" fill={g.accent} stroke={g.outline} strokeWidth="0.8"/>
      <rect x="37.5" y="55" width="5" height="4" rx="1" fill={isWhite ? '#FFD700' : '#C0392B'} stroke={g.outline} strokeWidth="0.5"/>

      {/* SPEAR arm - right (thrust forward) */}
      <path d="M54 40 Q60 34 64 26" stroke={`url(#${id}armor)`} strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Spear shaft */}
      <line x1="62" y1="28" x2="72" y2="6" stroke={g.cloth} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Spearhead */}
      <path d="M72 6 L68 12 L70 8 L66 14 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.8"/>
      <path d="M72 6 Q74 4 73 8 Q72 10 70 10 Z" fill={g.armorH} stroke={g.outline} strokeWidth="0.5"/>

      {/* SHIELD arm - left */}
      <path d="M26 40 Q20 44 16 50" stroke={`url(#${id}armor)`} strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* Round shield */}
      <circle cx="12" cy="52" r="10" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      <circle cx="12" cy="52" r="7" fill="none" stroke={g.accent} strokeWidth="1"/>
      <circle cx="12" cy="52" r="4" fill={g.cloth} stroke={g.outline} strokeWidth="0.8"/>
      <circle cx="12" cy="52" r="1.8" fill={g.accent}/>
      {/* Shield emblem */}
      <line x1="12" y1="45" x2="12" y2="59" stroke={g.accent} strokeWidth="0.8" opacity="0.5"/>
      <line x1="5" y1="52" x2="19" y2="52" stroke={g.accent} strokeWidth="0.8" opacity="0.5"/>

      {/* Neck */}
      <rect x="36" y="30" width="8" height="8" rx="2" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.8"/>
      {/* Gorget (neck armor) */}
      <path d="M32 34 Q40 32 48 34 Q48 38 40 39 Q32 38 32 34 Z" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Head */}
      <ellipse cx="40" cy="22" rx="11" ry="12" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="1"/>
      {/* Ears */}
      <ellipse cx="29.5" cy="22" rx="2" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>
      <ellipse cx="50.5" cy="22" rx="2" ry="3" fill={`url(#${id}skin)`} stroke={g.outline} strokeWidth="0.7"/>

      {/* Kettle helmet */}
      <path d="M29 20 Q29 8 40 6 Q51 8 51 20" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1.2"/>
      {/* Wide brim */}
      <rect x="26" y="18" width="28" height="4" rx="2" fill={`url(#${id}armor)`} stroke={g.outline} strokeWidth="1"/>
      {/* Coif / mail below helmet */}
      <path d="M29 22 Q28 28 30 34" stroke={g.armorD} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M51 22 Q52 28 50 34" stroke={g.armorD} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Helmet ridge */}
      <line x1="31" y1="12" x2="49" y2="12" stroke={g.accent} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>

      {/* Eyes */}
      <ellipse cx="35.5" cy="21" rx="3" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      <ellipse cx="44.5" cy="21" rx="3" ry="2.5" fill="white" stroke={g.outline} strokeWidth="0.6"/>
      <circle cx="36" cy="21.5" r="1.8" fill={isWhite ? '#4A3020' : '#2C1A0A'}/>
      <circle cx="45" cy="21.5" r="1.8" fill={isWhite ? '#4A3020' : '#2C1A0A'}/>
      <circle cx="36.8" cy="20.8" r="0.6" fill="white"/>
      <circle cx="45.8" cy="20.8" r="0.6" fill="white"/>
      {/* Brows - determined */}
      <path d="M33 19 Q35.5 18 38 19" stroke={g.armorD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M42 19 Q44.5 18 47 19" stroke={g.armorD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M38.5 23 Q38 25.5 40 26.5 Q42 25.5 41.5 23" stroke={g.skinD} strokeWidth="0.7" fill="none"/>
      {/* Mouth - set firm */}
      <path d="M36.5 28.5 Q40 29.5 43.5 28.5" stroke={g.outline} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Stubble */}
      <path d="M33 27 Q36 30 40 30 Q44 30 47 27" stroke={g.skinD} strokeWidth="0.5" fill="none" opacity="0.4"/>
    </svg>
  );
}

// ─── SIZE MAP ─────────────────────────────────────────────────────────────────
const SIZE_PX = {
  tiny:   24,
  small:  36,
  normal: 62,
  large:  88,
  huge:   120,
  battle: 160,
};

const PIECE_COMPONENTS = { K: King, Q: Queen, R: Rook, B: Bishop, N: Knight, P: Pawn };

export default function PieceRenderer({ piece, size = 'normal' }) {
  if (!piece) return null;

  const isWhite = piece === piece.toUpperCase();
  const type    = piece.toUpperCase();
  const Component = PIECE_COMPONENTS[type];
  if (!Component) return null;

  const px = SIZE_PX[size] ?? 62;

  return (
    <span
      className="inline-flex items-center justify-center select-none"
      style={{
        width:  px,
        height: px,
        filter: isWhite
          ? 'drop-shadow(0 3px 8px rgba(255,255,255,0.5)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 3px 8px rgba(0,0,0,0.9)) drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
      }}
    >
      <Component isWhite={isWhite} />
    </span>
  );
}