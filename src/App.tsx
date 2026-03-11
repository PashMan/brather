/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestMap } from './components/QuestMap';
import { RiddleModal } from './components/RiddleModal';
import { questData } from './data/quest';
import { Play } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFinalVideo, setShowFinalVideo] = useState(false);

  useEffect(() => {
    alert("удели внимание видео");
  }, []);

  useEffect(() => {
    if (showFinalVideo) {
      alert("сорян должен был быть денежный приз, но я в говне(");
    }
  }, [showFinalVideo]);

  // Карта, которую скинул пользователь
  const mapImage = "https://i.postimg.cc/bJ5fh6HD/photo-2026-03-07-23-18-07.jpg"; 

  const handleCityClick = (index: number) => {
    // Можно кликнуть только на текущий открытый город или уже пройденные
    if (index > currentStage) return;
    
    setSelectedCityIndex(index);
    
    // Если город уже пройден, просто показываем инфо (или ничего не делаем)
    // Если это текущий уровень - открываем загадку
    if (index === currentStage) {
      setIsModalOpen(true);
    }
  };

  const handleSolve = () => {
    setIsModalOpen(false);
    
    // Если это был последний город
    if (currentStage === questData.length - 1) {
      setTimeout(() => setShowFinalVideo(true), 500);
    } else {
      setCurrentStage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <main className="relative container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        <AnimatePresence mode="wait">
          {!showFinalVideo ? (
            <motion.div 
              key="map-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                  Твой Путь
                </h1>
              </div>

              <div className="w-full">
                <QuestMap 
                  cities={questData} 
                  currentStage={currentStage} 
                  onCityClick={handleCityClick}
                  mapImage={mapImage}
                />
              </div>

              <div className="text-center text-slate-500 text-sm">
                Прогресс: {currentStage} / {questData.length}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="final-view"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl text-center space-y-8"
            >
              <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {questData[questData.length - 1].videoUrl ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`${questData[questData.length - 1].videoUrl}?autoplay=1&mute=1`} 
                    title="Birthday Video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Play size={48} className="mb-4 opacity-50" />
                    <p>Видео не найдено</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
              >
                Пройти еще раз
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <RiddleModal 
          city={selectedCityIndex !== null ? questData[selectedCityIndex] : null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSolve={handleSolve}
        />
      </main>
    </div>
  );
}

