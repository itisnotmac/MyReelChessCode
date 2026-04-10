import React from 'react';

// Dark bronze / aged metal figurine aesthetic
// White = polished bright bronze/gold
// Black = dark oxidized bronze/iron

function King({ isWhite }) {
  const id = isWhite ? 'wk' : 'bk';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    skin: '#E8B87A', skinSh: '#A07040',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    skin: '#8A6040', skinSh: '#4A2A10',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/>
          <stop offset="40%" stopColor={b.base}/>
          <stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/>
          <stop offset="50%" stopColor={b.metal}/>
          <stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}sg`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={b.skin}/>
          <stop offset="100%" stopColor={b.skinSh}/>
        </radialGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth base */}
      <ellipse cx="40" cy="94" rx="26" ry="5" fill={b.baseSh} opacity="0.5"/>
      <rect x="14" y="86" width="52" height="10" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="17" y="84" width="46" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Robe / figure base flowing down */}
      <path d="M20 86 Q18 68 22 54 Q26 44 40 42 Q54 44 58 54 Q62 68 60 86 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2" filter={`url(#${id}sh)`}/>
      {/* Robe folds */}
      <path d="M26 56 Q27 70 26 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M33 52 Q34 68 33 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.4"/>
      <path d="M40 50 L40 85" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M47 52 Q46 68 47 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.4"/>
      <path d="M54 56 Q53 70 54 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* Belt / sash */}
      <path d="M22 60 Q40 57 58 60" stroke={b.metalH} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M22 60 Q40 62 58 60" stroke={b.baseSh} strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Arms outstretched regally */}
      <path d="M22 54 Q12 52 8 56 Q8 62 12 62 Q16 60 20 58" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M58 54 Q68 52 72 56 Q72 62 68 62 Q64 60 60 58" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      {/* Hands */}
      <ellipse cx="8" cy="59" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>
      <ellipse cx="72" cy="59" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Orb in left hand */}
      <circle cx="8" cy="59" r="4" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>
      <circle cx="7" cy="58" r="1.5" fill={b.hi} opacity="0.7"/>

      {/* Scepter in right hand */}
      <line x1="72" y1="59" x2="74" y2="30" stroke={`url(#${id}mg)`} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M74 30 L71 25 L74 22 L77 25 Z" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>
      <circle cx="74" cy="22" r="3" fill={b.metalH} stroke={b.outline} strokeWidth="0.7"/>

      {/* Neck */}
      <rect x="36" y="36" width="8" height="8" rx="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Head */}
      <ellipse cx="40" cy="28" rx="12" ry="13" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1.2"/>
      {/* Cheekbones / face structure */}
      <path d="M29 30 Q31 38 40 40 Q49 38 51 30" fill={b.skinSh} opacity="0.3"/>
      {/* Regal beard */}
      <path d="M30 36 Q32 46 40 48 Q48 46 50 36" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      <path d="M32 38 L31 46" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M36 38 L35 46" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M40 38 L40 48" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M44 38 L45 46" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M48 38 L49 46" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      {/* Eyes - commanding */}
      <ellipse cx="35" cy="27" rx="3.5" ry="2.5" fill={b.dark}/>
      <ellipse cx="45" cy="27" rx="3.5" ry="2.5" fill={b.dark}/>
      <circle cx="35.8" cy="26.5" r="1" fill={b.hi} opacity="0.6"/>
      <circle cx="45.8" cy="26.5" r="1" fill={b.hi} opacity="0.6"/>
      {/* Nose */}
      <path d="M38.5 28 Q38 31 40 32 Q42 31 41.5 28" stroke={b.skinSh} strokeWidth="0.8" fill="none"/>
      {/* Stern mouth */}
      <path d="M35.5 34 Q40 35.5 44.5 34" stroke={b.outline} strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Imperial Crown */}
      <path d="M29 24 L31 14 L35 20 L40 10 L45 20 L49 14 L51 24 Z"
        fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="29" y="22" width="22" height="4" rx="2" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Crown gems */}
      <circle cx="40" cy="11" r="2.5" fill={isWhite ? '#FF4444' : '#884400'} stroke={b.outline} strokeWidth="0.6"/>
      <circle cx="32" cy="15" r="1.8" fill={isWhite ? '#4488FF' : '#664400'} stroke={b.outline} strokeWidth="0.5"/>
      <circle cx="48" cy="15" r="1.8" fill={isWhite ? '#4488FF' : '#664400'} stroke={b.outline} strokeWidth="0.5"/>
      {/* Crown highlight */}
      <path d="M31 23 Q40 21 49 23" stroke={b.hi} strokeWidth="0.8" opacity="0.6" fill="none"/>
    </svg>
  );
}

function Queen({ isWhite }) {
  const id = isWhite ? 'wq' : 'bq';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    skin: '#E8B87A', skinSh: '#A07040',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    skin: '#8A6040', skinSh: '#4A2A10',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/>
          <stop offset="40%" stopColor={b.base}/>
          <stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/><stop offset="50%" stopColor={b.metal}/><stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}sg`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={b.skin}/><stop offset="100%" stopColor={b.skinSh}/>
        </radialGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth base */}
      <ellipse cx="40" cy="94" rx="26" ry="5" fill={b.baseSh} opacity="0.5"/>
      <rect x="14" y="86" width="52" height="10" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="17" y="84" width="46" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Flowing gown */}
      <path d="M18 86 Q16 68 20 54 Q25 44 40 42 Q55 44 60 54 Q64 68 62 86 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2" filter={`url(#${id}sh)`}/>
      {/* Gown folds */}
      <path d="M24 56 Q25 70 24 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M32 50 Q33 68 32 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.4"/>
      <path d="M40 48 L40 85" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M48 50 Q47 68 48 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.4"/>
      <path d="M56 56 Q55 70 56 84" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.5"/>
      {/* Sash */}
      <path d="M20 62 Q40 59 60 62" stroke={b.metalH} strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Arms */}
      <path d="M22 52 Q12 50 8 56 Q8 62 12 62 Q16 60 20 58" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M58 52 Q68 50 72 56 Q72 62 68 62 Q64 60 60 58" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <ellipse cx="8" cy="59" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>
      <ellipse cx="72" cy="59" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Orb in left hand */}
      <circle cx="8" cy="57" r="5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>
      <circle cx="6.5" cy="55.5" r="1.8" fill={b.hi} opacity="0.6"/>
      <path d="M5 57 Q8 54 11 57" stroke={b.metalH} strokeWidth="0.6" fill="none" opacity="0.5"/>

      {/* Scepter */}
      <line x1="72" y1="57" x2="75" y2="28" stroke={`url(#${id}mg)`} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="75" cy="25" r="5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>
      <circle cx="73.5" cy="23.5" r="2" fill={b.hi} opacity="0.6"/>

      {/* Neck */}
      <rect x="36" y="36" width="8" height="8" rx="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Head */}
      <ellipse cx="40" cy="28" rx="11" ry="12" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1.2"/>
      {/* Hair flowing */}
      <path d="M29 30 Q26 42 29 50 Q34 54 40 52 Q46 54 51 50 Q54 42 51 30" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8" opacity="0.85"/>
      <path d="M30 34 L29 50" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M40 32 L40 52" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M50 34 L51 50" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="35" cy="27" rx="3.2" ry="2.5" fill={b.dark}/>
      <ellipse cx="45" cy="27" rx="3.2" ry="2.5" fill={b.dark}/>
      <circle cx="35.8" cy="26.3" r="1" fill={b.hi} opacity="0.6"/>
      <circle cx="45.8" cy="26.3" r="1" fill={b.hi} opacity="0.6"/>
      {/* Nose */}
      <path d="M38.5 28 Q38 31 40 32 Q42 31 41.5 28" stroke={b.skinSh} strokeWidth="0.8" fill="none"/>
      {/* Lips */}
      <path d="M36.5 33.5 Q40 35 43.5 33.5" stroke={b.outline} strokeWidth="1" fill="none" strokeLinecap="round"/>

      {/* Crown with 5 points */}
      <path d="M30 24 L31 13 L36 19 L40 9 L44 19 L49 13 L50 24 Z"
        fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="30" y="22" width="20" height="4" rx="2" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Crown gems */}
      <circle cx="40" cy="10" r="2.5" fill={isWhite ? '#FF4488' : '#881133'} stroke={b.outline} strokeWidth="0.6"/>
      <circle cx="32" cy="14" r="1.8" fill={isWhite ? '#FF88AA' : '#663344'} stroke={b.outline} strokeWidth="0.5"/>
      <circle cx="48" cy="14" r="1.8" fill={isWhite ? '#FF88AA' : '#663344'} stroke={b.outline} strokeWidth="0.5"/>
      <path d="M32 23 Q40 21 48 23" stroke={b.hi} strokeWidth="0.8" opacity="0.6" fill="none"/>
    </svg>
  );
}

function Knight({ isWhite }) {
  const id = isWhite ? 'wn' : 'bn';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    horse: '#B8A070', horseH: '#D8C090', horseSh: '#685030',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    horse: '#181410', horseH: '#282018', horseSh: '#080604',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/><stop offset="40%" stopColor={b.base}/><stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/><stop offset="50%" stopColor={b.metal}/><stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}hg`} cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor={b.horseH}/><stop offset="100%" stopColor={b.horseSh}/>
        </radialGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth */}
      <ellipse cx="40" cy="94" rx="26" ry="5" fill={b.baseSh} opacity="0.5"/>
      <rect x="14" y="86" width="52" height="10" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="17" y="84" width="46" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Horse body rearing */}
      <path d="M14 84 Q16 68 20 58 Q22 50 20 40 Q18 30 24 22 Q28 16 32 20 Q34 15 38 14 Q44 14 46 20 Q52 18 54 26 Q58 32 54 44 Q52 54 56 68 Q58 76 60 84 Z"
        fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1.2" filter={`url(#${id}sh)`}/>

      {/* Armor barding on horse */}
      <path d="M28 50 Q40 47 52 50 Q52 58 40 60 Q28 58 28 50 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8" opacity="0.8"/>

      {/* Horse neck & head */}
      <path d="M20 40 Q16 28 18 18 Q20 10 26 8 Q32 6 36 12 Q40 10 44 14"
        fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1.2"/>
      {/* Muzzle */}
      <path d="M18 18 Q14 20 14 26 Q16 30 20 28" fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1"/>
      <ellipse cx="15" cy="24" rx="2" ry="1.5" fill={b.horseSh}/>
      {/* Horse eye */}
      <circle cx="26" cy="14" r="2.5" fill={b.dark} stroke={b.outline} strokeWidth="0.7"/>
      <circle cx="26.8" cy="13.2" r="0.8" fill={b.hi} opacity="0.7"/>
      {/* Mane */}
      <path d="M26 8 Q22 2 20 0 Q24 4 26 6 Q28 2 30 0 Q30 5 28 8 Q30 4 32 4 Q30 8 28 10"
        fill={b.dark} stroke={b.outline} strokeWidth="0.6"/>
      {/* Bridle */}
      <path d="M18 18 Q22 16 28 14" stroke={`url(#${id}mg)`} strokeWidth="1.5" fill="none"/>
      <path d="M18 22 Q22 22 26 20" stroke={`url(#${id}mg)`} strokeWidth="1.5" fill="none"/>

      {/* Front raised legs */}
      <path d="M22 62 Q16 70 14 80 Q16 82 18 80 Q20 74 24 66" fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1"/>
      <rect x="13" y="78" width="7" height="6" rx="2" fill={b.horseSh} stroke={b.outline} strokeWidth="0.8"/>
      <path d="M36 58 Q30 66 28 78 Q30 80 33 78 Q34 72 38 64" fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1"/>
      <rect x="27" y="76" width="7" height="6" rx="2" fill={b.horseSh} stroke={b.outline} strokeWidth="0.8"/>
      {/* Back legs */}
      <rect x="44" y="62" width="8" height="24" rx="3" fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1"/>
      <rect x="54" y="62" width="8" height="24" rx="3" fill={`url(#${id}hg)`} stroke={b.outline} strokeWidth="1"/>
      <rect x="43" y="82" width="10" height="6" rx="2" fill={b.horseSh} stroke={b.outline} strokeWidth="0.8"/>
      <rect x="53" y="82" width="10" height="6" rx="2" fill={b.horseSh} stroke={b.outline} strokeWidth="0.8"/>
      {/* Tail */}
      <path d="M58 68 Q68 60 70 52 Q72 44 68 38" stroke={b.dark} strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M58 68 Q70 65 72 56 Q74 48 70 42" stroke={b.horseSh} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* Rider torso - armored */}
      <path d="M28 32 Q28 24 40 22 Q52 24 52 32 L50 50 Q40 48 30 50 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <path d="M34 26 Q40 24 46 26 L45 44 Q40 42 35 44 Z" fill={b.metalH} stroke="none" opacity="0.25"/>
      {/* Pauldrons */}
      <ellipse cx="26" cy="28" rx="6" ry="4" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8" transform="rotate(-20 26 28)"/>
      <ellipse cx="54" cy="28" rx="6" ry="4" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8" transform="rotate(20 54 28)"/>
      {/* Sword arm */}
      <path d="M52 30 Q60 24 64 16" stroke={`url(#${id}mg)`} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <line x1="63" y1="18" x2="74" y2="2" stroke={b.metalH} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M62 20 L59 16 L65 16 Z" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>
      {/* Shield arm */}
      <path d="M28 30 Q20 34 16 42" stroke={`url(#${id}mg)`} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M12 38 Q8 46 12 54 Q18 56 24 50 Q26 44 24 38 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M14 42 Q12 46 14 50 Q18 51 21 48 Q22 45 21 42 Z" fill={b.metalH} stroke="none" opacity="0.3"/>

      {/* Helmet */}
      <ellipse cx="40" cy="18" rx="11" ry="10" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="31" y="18" width="18" height="4" rx="1.5" fill={b.metalSh} stroke={b.outline} strokeWidth="0.8"/>
      <rect x="38" y="19" width="4" height="8" rx="1.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>
      {/* Plume */}
      <path d="M40 10 Q36 4 32 2 Q35 6 36 10" fill={isWhite ? '#DD2222' : '#222244'} stroke={b.outline} strokeWidth="0.7"/>
      <path d="M40 10 Q40 3 38 1 Q41 5 42 10" fill={isWhite ? '#FF4444' : '#444488'} stroke={b.outline} strokeWidth="0.7" opacity="0.8"/>
      <path d="M32 10 Q40 8 48 10" stroke={b.metalH} strokeWidth="1" fill="none"/>
    </svg>
  );
}

function Bishop({ isWhite }) {
  const id = isWhite ? 'wb' : 'bb';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    skin: '#E8B87A', skinSh: '#A07040',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    skin: '#8A6040', skinSh: '#4A2A10',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/><stop offset="40%" stopColor={b.base}/><stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/><stop offset="50%" stopColor={b.metal}/><stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}sg`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={b.skin}/><stop offset="100%" stopColor={b.skinSh}/>
        </radialGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth */}
      <ellipse cx="40" cy="94" rx="26" ry="5" fill={b.baseSh} opacity="0.5"/>
      <rect x="14" y="86" width="52" height="10" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="17" y="84" width="46" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Wide flowing robes */}
      <path d="M10 86 Q8 64 18 50 Q24 42 40 40 Q56 42 62 50 Q72 64 70 86 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2" filter={`url(#${id}sh)`}/>
      {/* Robe folds */}
      <path d="M16 54 Q18 70 16 84" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M26 48 Q28 66 26 84" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M40 46 L40 85" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M54 48 Q52 66 54 84" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M64 54 Q62 70 64 84" stroke={b.metalH} strokeWidth="0.7" fill="none" opacity="0.4"/>
      {/* Ornamental hem border */}
      <path d="M10 80 Q40 76 70 80" stroke={b.metalH} strokeWidth="1.5" fill="none"/>
      {/* Cross on chest */}
      <line x1="40" y1="48" x2="40" y2="60" stroke={b.metalH} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="53" x2="46" y2="53" stroke={b.metalH} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="53" r="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.6"/>

      {/* Arms with staff */}
      <path d="M22 50 Q14 55 12 64" stroke={`url(#${id}mg)`} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M58 50 Q66 55 68 64" stroke={`url(#${id}mg)`} strokeWidth="6" strokeLinecap="round" fill="none"/>
      <ellipse cx="11" cy="65" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.7"/>
      <ellipse cx="69" cy="65" rx="4" ry="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.7"/>

      {/* Crozier staff */}
      <line x1="69" y1="65" x2="72" y2="20" stroke={`url(#${id}mg)`} strokeWidth="3" strokeLinecap="round"/>
      {/* Staff crook */}
      <path d="M72 20 Q72 10 66 8 Q60 8 60 14 Q60 20 66 20 Q70 20 72 20" fill="none" stroke={`url(#${id}mg2)`} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="66" cy="10" r="3" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>

      {/* Neck */}
      <rect x="36" y="32" width="8" height="9" rx="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Head */}
      <ellipse cx="40" cy="25" rx="11" ry="12" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1.2"/>
      {/* Beard */}
      <path d="M30 34 Q32 44 40 46 Q48 44 50 34" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8" opacity="0.9"/>
      <path d="M32 36 Q31 44 32 44" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M40 36 L40 46" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      <path d="M48 36 Q49 44 48 44" stroke={b.metalH} strokeWidth="0.6" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="35" cy="24" rx="3.2" ry="2.5" fill={b.dark}/>
      <ellipse cx="45" cy="24" rx="3.2" ry="2.5" fill={b.dark}/>
      <circle cx="35.8" cy="23.3" r="1" fill={b.hi} opacity="0.5"/>
      <circle cx="45.8" cy="23.3" r="1" fill={b.hi} opacity="0.5"/>
      <path d="M38 28 Q38.5 30 40 31 Q41.5 30 42 28" stroke={b.skinSh} strokeWidth="0.8" fill="none"/>
      <path d="M36 32 Q40 33.5 44 32" stroke={b.outline} strokeWidth="0.9" fill="none" strokeLinecap="round"/>

      {/* Tall mitre hat */}
      <path d="M30 20 Q28 8 40 2 Q52 8 50 20 Z" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="29" y="18" width="22" height="4" rx="2" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Mitre cross */}
      <line x1="40" y1="6" x2="40" y2="16" stroke={b.metalH} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <line x1="36" y1="10" x2="44" y2="10" stroke={b.metalH} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
      <path d="M31 19 Q40 17 49 19" stroke={b.hi} strokeWidth="0.7" opacity="0.6" fill="none"/>
    </svg>
  );
}

function Rook({ isWhite }) {
  const id = isWhite ? 'wr' : 'br';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    skin: '#E8B87A', skinSh: '#A07040',
    fur: '#C8A060', furSh: '#886030',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    skin: '#8A6040', skinSh: '#4A2A10',
    fur: '#1A1410', furSh: '#0A0808',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/><stop offset="40%" stopColor={b.base}/><stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/><stop offset="50%" stopColor={b.metal}/><stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}sg`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={b.skin}/><stop offset="100%" stopColor={b.skinSh}/>
        </radialGradient>
        <linearGradient id={`${id}fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={b.fur}/><stop offset="100%" stopColor={b.furSh}/>
        </linearGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth */}
      <ellipse cx="40" cy="94" rx="26" ry="5" fill={b.baseSh} opacity="0.5"/>
      <rect x="14" y="86" width="52" height="10" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="17" y="84" width="46" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Legs - wide powerful stance */}
      <path d="M22 60 Q20 70 18 86 Q22 88 26 86 Q26 76 28 62 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M58 60 Q60 70 62 86 Q58 88 54 86 Q54 76 52 62 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      {/* Fur boots */}
      <path d="M16 76 Q14 84 20 88 Q28 88 28 82 Q26 76 20 74 Z" fill={`url(#${id}fg)`} stroke={b.outline} strokeWidth="0.8"/>
      <path d="M64 76 Q66 84 60 88 Q52 88 52 82 Q54 76 60 74 Z" fill={`url(#${id}fg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Fur texture */}
      <path d="M17 78 Q19 76 21 78" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      <path d="M17 81 Q19 79 21 81" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      <path d="M63 78 Q61 76 59 78" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      {/* Knee guards */}
      <ellipse cx="24" cy="64" rx="6" ry="5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <ellipse cx="56" cy="64" rx="6" ry="5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>

      {/* Massive barrel torso */}
      <ellipse cx="40" cy="48" rx="22" ry="18" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.5" filter={`url(#${id}sh)`}/>
      {/* Fur cloak collar */}
      <path d="M18 42 Q40 36 62 42 Q60 50 40 52 Q20 50 18 42 Z" fill={`url(#${id}fg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Fur texture */}
      <path d="M24 42 Q26 38 30 40" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      <path d="M34 38 Q36 34 40 36" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      <path d="M44 38 Q46 34 50 36" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      <path d="M52 42 Q54 38 58 40" stroke={b.furSh} strokeWidth="0.6" fill="none"/>
      {/* Belt */}
      <rect x="20" y="58" width="40" height="5" rx="2" fill={`url(#${id}fg)`} stroke={b.outline} strokeWidth="0.8"/>
      <rect x="37" y="58" width="6" height="5" rx="1.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>
      <circle cx="40" cy="60.5" r="1.5" fill={isWhite ? '#FFD700' : '#AA2200'} stroke={b.outline} strokeWidth="0.4"/>

      {/* Right arm — battle axe raised high */}
      <path d="M20 42 Q10 34 6 24" stroke={`url(#${id}mg)`} strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* Axe shaft */}
      <line x1="6" y1="24" x2="2" y2="6" stroke={b.furSh} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Massive axe head */}
      <path d="M2 6 Q-4 0 -2 10 Q0 16 4 16 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <path d="M2 6 Q10 0 10 8 Q10 14 4 16 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <path d="M-1 8 Q-2 6 0 10" stroke={b.hi} strokeWidth="1" fill="none" opacity="0.7"/>
      {/* Left arm — round shield */}
      <path d="M60 42 Q70 38 74 44" stroke={`url(#${id}mg)`} strokeWidth="9" strokeLinecap="round" fill="none"/>
      <circle cx="76" cy="44" r="10" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <circle cx="76" cy="44" r="7" fill="none" stroke={b.metalH} strokeWidth="1"/>
      <circle cx="76" cy="44" r="2.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>
      <circle cx="74.5" cy="42.5" r="1.5" fill={b.hi} opacity="0.5"/>

      {/* Neck */}
      <rect x="34" y="28" width="12" height="10" rx="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1"/>

      {/* Big square head */}
      <rect x="26" y="14" width="28" height="26" rx="6" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1.2"/>
      <path d="M26 30 Q28 40 40 42 Q52 40 54 30" fill={b.skinSh} opacity="0.25"/>

      {/* Viking helmet */}
      <path d="M26 20 Q26 8 40 6 Q54 8 54 20" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.5"/>
      <rect x="23" y="19" width="34" height="4" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1"/>
      <rect x="38" y="21" width="4" height="8" rx="1.5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.7"/>
      {/* Viking horns */}
      <path d="M26 16 Q16 6 12 10 Q14 18 22 20 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M54 16 Q64 6 68 10 Q66 18 58 20 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <ellipse cx="12" cy="10" rx="2.5" ry="3" fill={b.metalH} stroke={b.outline} strokeWidth="0.7" transform="rotate(-20 12 10)"/>
      <ellipse cx="68" cy="10" rx="2.5" ry="3" fill={b.metalH} stroke={b.outline} strokeWidth="0.7" transform="rotate(20 68 10)"/>
      <line x1="28" y1="12" x2="52" y2="12" stroke={b.metalH} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Eyes — fierce */}
      <ellipse cx="33" cy="26" rx="4" ry="3" fill="white" stroke={b.outline} strokeWidth="0.7"/>
      <ellipse cx="47" cy="26" rx="4" ry="3" fill="white" stroke={b.outline} strokeWidth="0.7"/>
      <circle cx="34" cy="26.5" r="2.5" fill={isWhite ? '#4A2000' : '#880000'}/>
      <circle cx="48" cy="26.5" r="2.5" fill={isWhite ? '#4A2000' : '#880000'}/>
      <circle cx="35" cy="25.7" r="0.8" fill="white"/>
      <circle cx="49" cy="25.7" r="0.8" fill="white"/>
      <path d="M29 23 Q33 21 37 23" stroke={b.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M43 23 Q47 21 51 23" stroke={b.outline} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M38 28 Q38 31 40 32 Q42 31 42 28" stroke={b.skinSh} strokeWidth="0.9" fill="none"/>
      <path d="M33 35 Q40 38 47 35" fill={b.skinSh} stroke={b.outline} strokeWidth="0.8" opacity="0.6"/>
      <path d="M35 35 Q40 36.5 45 35" fill="white" stroke={b.outline} strokeWidth="0.5" opacity="0.4"/>

      {/* Massive beard */}
      <path d="M26 34 Q28 46 30 52 Q35 58 40 58 Q45 58 50 52 Q52 46 54 34"
        fill={`url(#${id}fg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M30 38 Q32 48 30 54" stroke={b.furSh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M40 36 L40 56" stroke={b.furSh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M50 38 Q48 48 50 54" stroke={b.furSh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

function Pawn({ isWhite }) {
  const id = isWhite ? 'wp' : 'bp';
  const b = isWhite ? {
    base: '#C8960C', baseH: '#F0C040', baseSh: '#7A5A00',
    metal: '#D4A820', metalH: '#FFE066', metalSh: '#8B6500',
    skin: '#E8B87A', skinSh: '#A07040',
    dark: '#5A3A00', outline: '#2A1A00', hi: '#FFF0A0'
  } : {
    base: '#2A2018', baseH: '#4A3828', baseSh: '#0A0806',
    metal: '#1E1A14', metalH: '#3A3028', metalSh: '#080604',
    skin: '#8A6040', skinSh: '#4A2A10',
    dark: '#080604', outline: '#000000', hi: '#5A4830'
  };

  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}mg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={b.baseH}/><stop offset="40%" stopColor={b.base}/><stop offset="100%" stopColor={b.baseSh}/>
        </linearGradient>
        <linearGradient id={`${id}mg2`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={b.metalH}/><stop offset="50%" stopColor={b.metal}/><stop offset="100%" stopColor={b.metalSh}/>
        </linearGradient>
        <radialGradient id={`${id}sg`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={b.skin}/><stop offset="100%" stopColor={b.skinSh}/>
        </radialGradient>
        <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={b.dark} floodOpacity="0.7"/>
        </filter>
      </defs>

      {/* Plinth */}
      <ellipse cx="40" cy="94" rx="22" ry="4.5" fill={b.baseSh} opacity="0.5"/>
      <rect x="18" y="86" width="44" height="9" rx="3" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <rect x="21" y="84" width="38" height="6" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Legs */}
      <path d="M26 60 Q24 70 22 86 Q26 88 30 86 Q30 76 32 62 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      <path d="M54 60 Q56 70 58 86 Q54 88 50 86 Q50 76 48 62 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1"/>
      {/* Greaves */}
      <rect x="21" y="68" width="11" height="16" rx="2.5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      <rect x="48" y="68" width="11" height="16" rx="2.5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      <path d="M22 70 Q26 68 31 70" stroke={b.metalH} strokeWidth="0.5" opacity="0.5" fill="none"/>
      {/* Boot toes */}
      <ellipse cx="26" cy="84" rx="7" ry="3" fill={b.metalSh} stroke={b.outline} strokeWidth="0.8"/>
      <ellipse cx="54" cy="84" rx="7" ry="3" fill={b.metalSh} stroke={b.outline} strokeWidth="0.8"/>
      {/* Knee cops */}
      <circle cx="28" cy="64" rx="5" ry="5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      <circle cx="52" cy="64" rx="5" ry="5" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>

      {/* Torso armor */}
      <path d="M24 58 Q24 44 40 42 Q56 44 56 58 L54 70 Q40 68 26 70 Z"
        fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2" filter={`url(#${id}sh)`}/>
      <path d="M32 46 Q40 44 48 46 L47 66 Q40 64 33 66 Z" fill={b.metalH} stroke="none" opacity="0.2"/>
      <line x1="40" y1="43" x2="40" y2="68" stroke={b.metalH} strokeWidth="0.8" opacity="0.4"/>
      {/* Pauldrons */}
      <ellipse cx="23" cy="44" rx="7" ry="4.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1" transform="rotate(-15 23 44)"/>
      <ellipse cx="57" cy="44" rx="7" ry="4.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1" transform="rotate(15 57 44)"/>
      {/* Belt */}
      <rect x="26" y="60" width="28" height="4.5" rx="2" fill={b.metal} stroke={b.outline} strokeWidth="0.8"/>
      <rect x="37.5" y="60" width="5" height="4.5" rx="1.5" fill={isWhite ? '#FFD700' : '#882200'} stroke={b.outline} strokeWidth="0.5"/>

      {/* Spear arm */}
      <path d="M56 44 Q64 38 68 28" stroke={`url(#${id}mg)`} strokeWidth="7" strokeLinecap="round" fill="none"/>
      <line x1="66" y1="30" x2="74" y2="8" stroke={b.furSh || b.baseSh} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M74 8 L70 14 L72 10 L68 16 Z" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="0.8"/>
      <path d="M73 9 Q75 7 74 11" stroke={b.hi} strokeWidth="0.8" fill="none" opacity="0.7"/>

      {/* Shield arm */}
      <path d="M24 44 Q16 48 12 56" stroke={`url(#${id}mg)`} strokeWidth="7" strokeLinecap="round" fill="none"/>
      <circle cx="8" cy="58" r="11" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      <circle cx="8" cy="58" r="8" fill="none" stroke={b.metalH} strokeWidth="1"/>
      <circle cx="8" cy="58" r="4.5" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.8"/>
      <circle cx="8" cy="58" r="2" fill={b.metalH}/>
      <circle cx="6.5" cy="56.5" r="1.5" fill={b.hi} opacity="0.5"/>

      {/* Neck */}
      <rect x="36" y="32" width="8" height="10" rx="3" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="0.8"/>
      {/* Gorget */}
      <path d="M32 36 Q40 34 48 36 Q48 40 40 41 Q32 40 32 36 Z" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="0.7"/>

      {/* Head */}
      <ellipse cx="40" cy="24" rx="11" ry="12" fill={`url(#${id}sg)`} stroke={b.outline} strokeWidth="1.2"/>

      {/* Kettle helmet */}
      <path d="M30 22 Q30 10 40 8 Q50 10 50 22" fill={`url(#${id}mg)`} stroke={b.outline} strokeWidth="1.2"/>
      {/* Wide brim */}
      <rect x="27" y="20" width="26" height="4" rx="2" fill={`url(#${id}mg2)`} stroke={b.outline} strokeWidth="1"/>
      <line x1="32" y1="14" x2="48" y2="14" stroke={b.metalH} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      {/* Mail coif */}
      <path d="M30 24 Q28 30 30 36" stroke={b.metal} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M50 24 Q52 30 50 36" stroke={b.metal} strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Eyes */}
      <ellipse cx="35" cy="23" rx="3" ry="2.5" fill={b.dark}/>
      <ellipse cx="45" cy="23" rx="3" ry="2.5" fill={b.dark}/>
      <circle cx="35.8" cy="22.3" r="1" fill={b.hi} opacity="0.5"/>
      <circle cx="45.8" cy="22.3" r="1" fill={b.hi} opacity="0.5"/>
      <path d="M38 27 Q38.5 29 40 30 Q41.5 29 42 27" stroke={b.skinSh} strokeWidth="0.7" fill="none"/>
      <path d="M37 31 Q40 32.5 43 31" stroke={b.outline} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      {/* Stubble */}
      <path d="M33 29 Q36 32 40 32 Q44 32 47 29" stroke={b.skinSh} strokeWidth="0.5" fill="none" opacity="0.4"/>
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

  const isFill = size === 'fill';
  const px = isFill ? null : (SIZE_PX[size] ?? 62);

  return (
    <span
      className="inline-flex items-center justify-center select-none"
      style={isFill ? { width: '100%', height: '100%', display: 'block' } : { width: px, height: px }}
    >
      <Component isWhite={isWhite} />
    </span>
  );
}