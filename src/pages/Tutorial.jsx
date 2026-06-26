import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Lock } from 'lucide-react';
import { LESSONS, CHAPTERS } from '../lib/tutorialLessons';
import TutorialBoard from '../components/tutorial/TutorialBoard';
import { useSeo } from '@/lib/useSeo';

export default function Tutorial() {
  const navigate = useNavigate();
  useSeo(
    'Learn Chess – Free Interactive Chess Tutorial | Reel Chess',
    'Learn how to play chess with Reel Chess free interactive tutorial. Step-by-step lessons cover piece movement, castling, en passant, check, checkmate, and basic chess strategy for beginners.'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tutorialCompleted') || '[]'); }
    catch { return []; }
  });
  const [showList, setShowList] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [boardKey, setBoardKey] = useState(0);

  const lesson = LESSONS[currentIndex];

  const markComplete = (id) => {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next);
    localStorage.setItem('tutorialCompleted', JSON.stringify(next));
  };

  const handleSuccess = () => {
    markComplete(lesson.id);
  };

  const goToLesson = (index) => {
    setCurrentIndex(index);
    setShowList(false);
    setBoardKey(k => k + 1);
  };

  const goNext = () => {
    if (currentIndex < LESSONS.length - 1) {
      goToLesson(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goToLesson(currentIndex - 1);
    }
  };

  const isCompleted = (id) => completed.includes(id);
  const progress = Math.round((completed.length / LESSONS.length) * 100);

  if (showList) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto">
        {/* Background */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '40px 40px' }} />

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-2">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-black tracking-[0.12em]"
              style={{ backgroundImage: 'linear-gradient(135deg, #3AAFA9, #A8E6E3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              REEL CHESS UNIVERSITY
            </h1>
            <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase font-medium">from beginner to winner</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-4 h-4 text-[#3AAFA9]/60" />
            <span className="text-xs text-white/30">{completed.length}/{LESSONS.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-5 mb-6">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3AAFA9, #A8E6E3)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-white/20 mt-1 text-right">{progress}% complete</p>
        </div>

        {/* Lesson list by chapter (collapsible) */}
        <div className="px-5 space-y-2 pb-10">
          {CHAPTERS.map((chapter, ci) => {
            const chapterLessons = LESSONS.filter(l => l.chapter === chapter);
            const doneCount = chapterLessons.filter(l => isCompleted(l.id)).length;
            const isOpen = expandedChapter === chapter;
            return (
              <div key={chapter} className="rounded-xl border border-white/6 bg-white/3 overflow-hidden">
                <button
                  onClick={() => setExpandedChapter(isOpen ? null : chapter)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#3AAFA9]/60 font-semibold flex-1">{chapter}</span>
                  <span className="text-[10px] text-white/20">{doneCount}/{chapterLessons.length}</span>
                  <ChevronRight className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5 px-3 pb-3">
                        {chapterLessons.map((l, li) => {
                          const globalIdx = LESSONS.findIndex(x => x.id === l.id);
                          const done = isCompleted(l.id);
                          return (
                            <motion.button
                              key={l.id}
                              onClick={() => goToLesson(globalIdx)}
                              className="w-full text-left"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: li * 0.03 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`relative rounded-lg px-3 py-2.5 border flex items-center gap-3 transition-all ${done ? 'border-[#3AAFA9]/25 bg-[#3AAFA9]/05' : 'border-white/5 bg-white/2'}`}>
                                <span className="text-lg w-6 text-center">{l.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white/75 text-[13px] font-medium truncate">{l.title}</p>
                                  {l.interactive && (
                                    <p className="text-[9px] text-[#3AAFA9]/40 mt-0.5">Interactive</p>
                                  )}
                                </div>
                                {done
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3AAFA9] shrink-0" />
                                  : <ChevronRight className="w-3.5 h-3.5 text-white/15 shrink-0" />
                                }
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Single lesson view ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: `repeating-conic-gradient(#3AAFA9 0% 25%, transparent 0% 50%)`, backgroundSize: '40px 40px' }} />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-2 shrink-0">
        <button onClick={() => setShowList(true)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#3AAFA9]/50">{lesson.chapter}</p>
          <h2 className="text-sm font-bold text-white/90 tracking-wide">{lesson.title}</h2>
        </div>
        <span className="text-xs text-white/20">{currentIndex + 1}/{LESSONS.length}</span>
      </div>

      {/* Step dots */}
      <div className="relative z-10 flex items-center justify-center gap-1 py-2 shrink-0">
        {LESSONS.map((l, i) => (
          <div key={i} className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 h-1.5 bg-[#3AAFA9]' : isCompleted(l.id) ? 'w-1.5 h-1.5 bg-[#3AAFA9]/40' : 'w-1.5 h-1.5 bg-white/10'}`} />
        ))}
      </div>

      {/* Lesson content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="relative z-10 flex-1 flex flex-col px-5 pt-2 pb-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Description card */}
          <div className="rounded-2xl border border-white/6 bg-white/3 p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{lesson.icon}</span>
              <p className="text-white/70 text-sm leading-relaxed">{lesson.description}</p>
            </div>
            {lesson.hint && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#3AAFA9]/08 border border-[#3AAFA9]/15 px-3 py-2.5">
                <span className="text-[#3AAFA9] text-xs shrink-0 mt-0.5">💡</span>
                <p className="text-[#3AAFA9]/80 text-xs leading-relaxed">{lesson.hint}</p>
              </div>
            )}
          </div>

          {/* Board */}
          {lesson.board && (
            <div className="max-w-[320px] w-full mx-auto mb-4">
              <TutorialBoard
                key={boardKey}
                board={lesson.board}
                lesson={lesson}
                onSuccess={handleSuccess}
              />
            </div>
          )}

          {/* Completion badge */}
          {isCompleted(lesson.id) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-2 mb-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#3AAFA9]" />
              <span className="text-[#3AAFA9] text-xs font-semibold tracking-wider">LESSON COMPLETE</span>
            </motion.div>
          )}

          {/* Nav buttons */}
          <div className="mt-auto flex gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex-1 py-3 rounded-xl border border-white/8 bg-white/3 text-white/40 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-white/6 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {!lesson.interactive || isCompleted(lesson.id) ? (
              <button
                onClick={currentIndex < LESSONS.length - 1 ? goNext : () => setShowList(true)}
                className="flex-[2] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-[#0a0a0f] transition-all"
                style={{ background: 'linear-gradient(135deg, #3AAFA9, #2b8a85)' }}
              >
                {currentIndex < LESSONS.length - 1 ? (
                  <>Next Lesson <ChevronRight className="w-4 h-4" /></>
                ) : (
                  'All Done! 🎉'
                )}
              </button>
            ) : (
              <div className="flex-[2] py-3 rounded-xl border border-[#3AAFA9]/20 bg-[#3AAFA9]/05 text-[#3AAFA9]/50 text-sm font-medium flex items-center justify-center gap-2">
                <span>Complete the exercise</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}