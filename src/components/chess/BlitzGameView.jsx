import React from 'react';
import ChessBoard from './ChessBoard';
import AmbientOverlay from '@/components/effects/AmbientOverlay';
import CapturedPieces from './CapturedPieces';
import GameOverModal from './GameOverModal';
import TurnIndicator from './TurnIndicator';
import GameMenu from './GameMenu';
import BlitzTimer from './BlitzTimer';
import { isInCheck } from './ChessLogic';

// Shared presentational view for the "playing" phase of BlitzSchach.
// Used by all three modes (online, ai, local) so the board, timers, and
// captured-pieces layout stay identical across variants.
export default function BlitzGameView({
  board, selectedSquare, legalMoves, onSquareClick, lastMove,
  isWhiteTurn, checkSquare, shouldFlip,
  capturedWhite, capturedBlack, moveCount,
  whiteRemaining, blackRemaining, whiteLimit, blackLimit,
  gameOver, eloDelta, onRematch, onHome,
  soundEnabled, onToggleSound,
  isThinking,
  roleIcon: RoleIcon, roleLabel,
  turnIndicatorMode = 'online',
  mode = 'online',
}) {
  const inCheck = isInCheck(board, isWhiteTurn);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative">
      <AmbientOverlay />
      <div className="relative z-10 flex flex-col flex-1">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <GameMenu
          onHome={onHome}
          onReset={() => {}}
          soundEnabled={soundEnabled}
          onToggleSound={onToggleSound}
        />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-red-400/60 font-medium">BLITZSCHACH</p>
          <p className="text-[10px] text-white/20">Move {moveCount}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
          {RoleIcon && <RoleIcon className="w-3 h-3 text-red-400" />}
          <span className="text-[10px] text-white/40 tracking-wider">{roleLabel}</span>
        </div>
      </div>

      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedBlack : capturedWhite} color={shouldFlip ? 'black' : 'white'} />
      </div>

      <div className="px-4 pb-1 flex justify-between gap-2">
        <BlitzTimer
          remaining={shouldFlip ? whiteRemaining : blackRemaining}
          limit={shouldFlip ? whiteLimit : blackLimit}
          isActive={shouldFlip ? isWhiteTurn : !isWhiteTurn}
          label={shouldFlip ? 'White' : 'Black'}
        />
        <BlitzTimer
          remaining={shouldFlip ? blackRemaining : whiteRemaining}
          limit={shouldFlip ? blackLimit : whiteLimit}
          isActive={shouldFlip ? !isWhiteTurn : isWhiteTurn}
          label={shouldFlip ? 'Black' : 'White'}
        />
      </div>

      <div className="px-4 py-2">
        <TurnIndicator
          isWhiteTurn={isWhiteTurn}
          isCheck={inCheck}
          mode={turnIndicatorMode}
          isThinking={isThinking && !gameOver}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div style={{ width: 'min(92vw, 92vh, 480px)', height: 'min(92vw, 92vh, 480px)' }}>
          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            onSquareClick={onSquareClick}
            lastMove={lastMove}
            isCheck={inCheck}
            checkSquare={checkSquare}
            flipped={shouldFlip}
            tournamentMode={true}
          />
        </div>
      </div>

      <div className="px-4 py-1">
        <CapturedPieces pieces={shouldFlip ? capturedWhite : capturedBlack} color={shouldFlip ? 'white' : 'black'} />
      </div>

      <div className="h-6" />

      {gameOver && (
        <GameOverModal
          result={gameOver}
          eloDelta={eloDelta}
          onRematch={onRematch}
          onHome={onHome}
          mode={mode}
        />
      )}
      </div>
    </div>
  );
}