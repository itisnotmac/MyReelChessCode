import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Lock } from 'lucide-react';
import { LESSONS, CHAPTERS, SECTIONS } from '../lib/tutorialLessons';
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
    try {return JSON.parse(localStorage.getItem('tutorialCompleted') || '[]');}
    catch {return [];}
  });
  const [showList, setShowList] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [boardKey, setBoardKey] = useState(0);

  const lesson = LESSONS[currentIndex];

  // Non-interactive lessons (informational only, no puzzle) are marked
  // complete automatically when viewed.
  useEffect(() => {
    if (!lesson.interactive) {
      markComplete(lesson.id);
    }
  }, [lesson.id, lesson.interactive]);

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
    setBoardKey((k) => k + 1);
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
  const progress = Math.round(completed.length / LESSONS.length * 100);

  if (showList) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-y-auto">
        {/* Cinematic backdrop — stone amphitheater */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/346b4ca43_generated_image.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.9) 100%)' }} />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 px-5 pt-6 pb-2">
          <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg tracking-[0.12em] [font-family:'Old_Standard_TT',_serif] font-bold"
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
        <div className="relative z-10 px-5 mb-6">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3AAFA9, #A8E6E3)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }} />
            
          </div>
          <p className="text-[10px] text-white/20 mt-1 text-right">{progress}% complete</p>
        </div>

        {/* Lesson list by section — three columns framing the backdrop */}
        <div className="relative z-10 grid grid-cols-3 gap-2 px-2 pb-10 items-start">
          {SECTIONS.map((section, sIdx) => {
            const sectionChapters = section.chapters.filter((ch) => CHAPTERS.includes(ch));
            if (sectionChapters.length === 0) return null;
            const colAlign = ['items-start', 'items-center', 'items-end'][sIdx];
            return (
              <div key={section.name} className={`flex flex-col ${colAlign} gap-2`}>
                {/* Section header */}
                <div className="px-1 pt-1">
                  <p className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#3AAFA9]">{section.name}</p>
                </div>
                {sectionChapters.map((chapter) => {
                  const chapterLessons = LESSONS.filter((l) => l.chapter === chapter);
                  const doneCount = chapterLessons.filter((l) => isCompleted(l.id)).length;
                  const isOpen = expandedChapter === chapter;
                  const moduleHeader = section.moduleHeaders?.[chapter];
                  return (
                    <div key={chapter} className={`flex flex-col ${colAlign}`}>
                {moduleHeader &&
                  <div className="px-1 pt-2">
                    <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/30">{moduleHeader}</p>
                  </div>
                }
                <button
                        onClick={() => setExpandedChapter(isOpen ? null : chapter)}
                        className="rcu-glow w-fit flex items-center gap-3 px-4 py-3 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md text-left hover:bg-white/5 transition-colors">
                        
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#3AAFA9]/60 font-semibold">{chapter}</span>
                  <span className="text-[10px] text-white/20">{doneCount}/{chapterLessons.length}</span>
                  <ChevronRight className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen &&
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden">
                          
                      <div className={`space-y-1.5 pb-3 pt-2 flex flex-col ${colAlign}`}>
                        {chapterLessons.map((l, li) => {
                              const globalIdx = LESSONS.findIndex((x) => x.id === l.id);
                              const done = isCompleted(l.id);
                              return (
                                <motion.button
                                  key={l.id}
                                  onClick={() => goToLesson(globalIdx)}
                                  className="w-fit text-left"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: li * 0.03 }}
                                  whileTap={{ scale: 0.98 }}>
                                  
                              <div className={`rcu-glow relative rounded-lg px-3 py-2.5 border flex items-center gap-3 transition-all ${done ? 'border-[#3AAFA9]/30 bg-[#3AAFA9]/10' : 'border-white/10 bg-black/30'}`}>
                                <span className="text-lg w-6 text-center">{l.icon}</span>
                                <div className="min-w-0">
                                  <p className="text-white/75 text-[13px] font-medium">{l.title}</p>
                                  {l.interactive &&
                                      <p className="text-[9px] text-[#3AAFA9]/40 mt-0.5">Interactive</p>
                                      }
                                </div>
                                {done ?
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3AAFA9] shrink-0" /> :
                                    <ChevronRight className="w-3.5 h-3.5 text-white/15 shrink-0" />
                                    }
                              </div>
                            </motion.button>);

                            })}
                      </div>
                    </motion.div>
                        }
                </AnimatePresence>
              </div>);

                })}
            </div>);

          })}
        </div>
      </div>);

  }

  // ── Single lesson view ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col relative overflow-hidden">
      {/* Cinematic backdrop — stone amphitheater */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/346b4ca43_generated_image.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% 12%, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.9) 100%)' }} />
      </div>

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
        {LESSONS.map((l, i) =>
        <div key={i} className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 h-1.5 bg-[#3AAFA9]' : isCompleted(l.id) ? 'w-1.5 h-1.5 bg-[#3AAFA9]/40' : 'w-1.5 h-1.5 bg-white/10'}`} />
        )}
      </div>

      {/* Lesson content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="relative z-10 flex-1 flex flex-col px-5 pt-2 pb-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}>
          
          {/* Description card */}
          <div className="rcu-glow rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{lesson.icon}</span>
              <p className="text-white/70 text-sm leading-relaxed">{lesson.description}</p>
            </div>
            {lesson.hint &&
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#3AAFA9]/08 border border-[#3AAFA9]/15 px-3 py-2.5">
                <span className="text-[#3AAFA9] text-xs shrink-0 mt-0.5">💡</span>
                <p className="text-[#3AAFA9]/80 text-xs leading-relaxed">{lesson.hint}</p>
              </div>
            }
          </div>

          {/* Board */}
          {lesson.board &&
          <div className="max-w-[320px] w-full mx-auto mb-4">
              <TutorialBoard
              key={boardKey}
              board={lesson.board}
              lesson={lesson}
              onSuccess={handleSuccess} />
            
            </div>
          }

          {/* Completion badge */}
          {isCompleted(lesson.id) &&
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-2 mb-2">
            
              <CheckCircle2 className="w-4 h-4 text-[#3AAFA9]" />
              <span className="text-[#3AAFA9] text-xs font-semibold tracking-wider">LESSON COMPLETE</span>
            </motion.div>
          }

          {/* Nav buttons — sized to content, centered, so the backdrop stays visible */}
          <div className="mt-auto flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md text-white/70 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-black/60 transition-colors">
              
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {!lesson.interactive || isCompleted(lesson.id) ?
            <button
              onClick={currentIndex < LESSONS.length - 1 ? goNext : () => setShowList(true)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-[#0a0a0f] transition-all"
              style={{ background: 'linear-gradient(135deg, #3AAFA9, #2b8a85)' }}>
              
                {currentIndex < LESSONS.length - 1 ?
              <>Next Lesson <ChevronRight className="w-4 h-4" /></> :

              'All Done! 🎉'
              }
              </button> :

            <div className="px-6 py-2.5 rounded-xl border border-[#3AAFA9]/25 bg-[#3AAFA9]/10 backdrop-blur-md text-[#3AAFA9]/70 text-sm font-medium flex items-center justify-center gap-2">
                <span>Complete the exercise</span>
              </div>
            }
          </div>
        </motion.div>
      </AnimatePresence>
    </div>);

}