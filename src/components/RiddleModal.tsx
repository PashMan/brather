import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, ArrowRight, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { City } from '../data/quest';

interface RiddleModalProps {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
  onSolve: () => void;
}

export function RiddleModal({ city, isOpen, onClose, onSolve }: RiddleModalProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAnswer('');
      setError(false);
      setIsSolved(false);
      setShowHints(false);
      setRevealedHints(0);
    }
  }, [isOpen]);

  const cleanAnswer = (input: string) => {
    const junkWords = ['матч', 'фк', 'против', 'игра', 'с', 'и', 'vs', 'football', 'club', 'футбол', 'футбольный', 'клуб'];
    let cleaned = input.toLowerCase();
    
    // Remove punctuation
    cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
    
    // Remove junk words
    junkWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      cleaned = cleaned.replace(regex, '');
    });
    
    // Normalize spaces
    return cleaned.replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!city) return;

    // Special case for empty answer (skip level like Warsaw)
    if (city.answer.length === 1 && city.answer[0] === '') {
      setIsSolved(true);
      setTimeout(() => {
        onSolve();
      }, 1500);
      return;
    }

    const cleanedInput = cleanAnswer(answer);
    const isCorrect = city.answer.some(a => cleanedInput.includes(a.toLowerCase()));

    if (isCorrect) {
      setIsSolved(true);
      
      // Only auto-close if there are no reward images
      if (!city.rewardImages || city.rewardImages.length === 0) {
        setTimeout(() => {
          onSolve();
        }, 1500);
      }
    } else {
      setError(true);
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
    }
  };

  if (!city) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            {/* Media Section (Left) */}
            <div className="w-full md:w-1/2 bg-black relative shrink-0 min-h-[300px] md:h-auto md:min-h-full flex items-center justify-center overflow-hidden">
              {city.riddleVideoUrl ? (
                <iframe 
                  src={(() => {
                    let url = city.riddleVideoUrl;
                    if (url.includes('shorts/')) {
                      url = url.replace('shorts/', 'embed/');
                    } else if (url.includes('watch?v=')) {
                      url = url.replace('watch?v=', 'embed/');
                    }
                    // Ensure query params like ?feature=share don't break the embed path
                    if (url.includes('?')) {
                        const [base, query] = url.split('?');
                        // If it was a short, the base is now .../embed/ID
                        return `${base}?${query}`;
                    }
                    return url;
                  })()}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  title={city.name}
                />
              ) : (
                <>
                  <img 
                    src={city.image || 'https://via.placeholder.com/600x300'} 
                    alt={city.name}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-3xl font-bold text-white">{city.name}</h2>
                  </div>
                </>
              )}
            </div>

            {/* Content Section (Right) */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col max-h-[60vh] md:max-h-[90vh]">
              {city.riddleVideoUrl && (
                <h2 className="text-2xl font-bold text-slate-900 mb-4 md:hidden">{city.name}</h2>
              )}
              
              {isSolved ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Правильно!</h3>
                  
                  {city.rewardImages && city.rewardImages.length > 0 ? (
                    <>
                      <div className="space-y-4 my-6">
                        {city.rewardImages.map((img, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative group"
                          >
                            <img 
                              src={img} 
                              className="rounded-xl shadow-lg w-full h-auto border-4 border-white"
                              alt="Reward"
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      <button
                        onClick={onSolve}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                      >
                        {city.id === 'borisov' ? 'Конец' : 'Продолжить путь'}
                      </button>
                    </>
                  ) : (
                    <p className="text-slate-600">Открываем следующий город...</p>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0 hidden sm:block">
                      <HelpCircle size={24} />
                    </div>
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2 sm:hidden">
                        <HelpCircle size={20} className="text-indigo-600" />
                        Загадка
                      </h3>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 hidden sm:block">Загадка</h3>
                      
                      <div className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {city.riddle.includes('***') ? (
                          <>
                            <div className="whitespace-pre-wrap italic border-l-4 border-indigo-200 pl-4 mb-4 text-slate-500 bg-slate-50 p-3 rounded-r-lg">
                              {city.riddle.split('***')[0].trim()}
                            </div>
                            <div className="font-medium text-slate-800">
                              {city.riddle.split('***')[1].trim()}
                            </div>
                          </>
                        ) : (
                          <div className="whitespace-pre-wrap">{city.riddle}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hints Section */}
                  {city.hints && city.hints.length > 0 && (
                    <div className="border border-amber-200 bg-amber-50 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowHints(!showHints)}
                        className="w-full flex items-center justify-between p-3 text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <Lightbulb size={18} />
                          <span>Подсказки (юзай в крайнем случае)</span>
                        </div>
                        {showHints ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      
                      <AnimatePresence>
                        {showHints && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 space-y-2 border-t border-amber-100">
                              {city.hints.map((hint, index) => (
                                index < revealedHints && (
                                  <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-2 text-sm text-amber-800 bg-white/50 p-2 rounded-lg"
                                  >
                                    <span className="font-bold shrink-0 text-amber-600">{index + 1}.</span>
                                    <span>{hint}</span>
                                  </motion.div>
                                )
                              ))}
                              
                              {revealedHints < city.hints.length && (
                                <button
                                  type="button"
                                  onClick={() => setRevealedHints(prev => prev + 1)}
                                  className="w-full py-2 mt-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-200 border-dashed"
                                >
                                  Показать подсказку {revealedHints + 1}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="answer" className="block text-sm font-medium text-slate-700">
                      Твой ответ
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={`
                          block w-full rounded-xl border-2 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all
                          ${error 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200 animate-shake' 
                            : 'border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-200'
                          }
                        `}
                        placeholder="Введи ответ здесь..."
                        autoComplete="off"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 font-medium ml-1">
                        Неверно, попробуй еще раз!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-[0.98]"
                  >
                    Проверить
                    <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
