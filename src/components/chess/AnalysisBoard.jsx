import React from 'react';

const PIECE_UNICODE = {
  K: '\u265A', Q: '\u265B', R: '\u265C', B: '\u265D', N: '\u265E', P: '\u265F',
  k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F',
};

export default function AnalysisBoard({ board, playedMove, bestMove, showBest = true }) {
  const sameAsPlayed = playedMove && bestMove &&
    playedMove.from[0] === bestMove.from[0] && playedMove.from[1] === bestMove.from[1] &&
    playedMove.to[0] === bestMove.to[0] && playedMove.to[1] === bestMove.to[1];

  const getHighlight = (row, col) => {
    const isPlayedFrom = playedMove && row === playedMove.from[0] && col === playedMove.from[1];
    const isPlayedTo = playedMove && row === playedMove.to[0] && col === playedMove.to[1];
    const isBestFrom = showBest && bestMove && !sameAsPlayed && row === bestMove.from[0] && col === bestMove.from[1];
    const isBestTo = showBest && bestMove && !sameAsPlayed && row === bestMove.to[0] && col === bestMove.to[1];
    if (isBestFrom || isBestTo) return 'best';
    if (isPlayedFrom || isPlayedTo) return 'played';
    return null;
  };

  return (
    <div className="inline-block rounded-lg overflow-hidden border border-white/10 shadow-xl">
      {board.map((row, r) => (
        <div key={r} className="flex">
          {row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const hl = getHighlight(r, c);
            return (
              <div
                key={c}
                className="flex items-center justify-center"
                style={{
                  width: 'clamp(28px, 9vw, 38px)',
                  height: 'clamp(28px, 9vw, 38px)',
                  backgroundColor: hl === 'best'
                    ? 'rgba(212,175,55,0.35)'
                    : hl === 'played'
                      ? 'rgba(58,175,169,0.3)'
                      : isLight ? '#3d3d52' : '#252535',
                }}
              >
                {piece && (
                  <span style={{
                    fontSize: 'clamp(20px, 6.5vw, 28px)',
                    lineHeight: 1,
                    color: piece === piece.toUpperCase() ? '#f5f5f0' : '#8888aa',
                    textShadow: piece === piece.toUpperCase()
                      ? '0 1px 2px rgba(0,0,0,0.6)'
                      : '0 0 1px rgba(255,255,255,0.3)',
                  }}>
                    {PIECE_UNICODE[piece]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}