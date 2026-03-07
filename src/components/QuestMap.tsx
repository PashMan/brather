import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Lock, Check, Play } from 'lucide-react';
import { City } from '../data/quest';

interface QuestMapProps {
  cities: City[];
  currentStage: number;
  onCityClick: (index: number) => void;
  mapImage: string;
}

export function QuestMap({ cities, currentStage, onCityClick, mapImage }: QuestMapProps) {
  return (
    <div className="relative w-full aspect-[16/9] bg-slate-200 rounded-xl overflow-hidden shadow-2xl border-4 border-white group">
      {/* Фоновая карта с улучшением четкости */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={mapImage} 
          alt="Map" 
          className="w-full h-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      </div>
      
      {/* Точки городов */}
      {cities.map((city, index) => {
        const status = index < currentStage ? 'completed' : index === currentStage ? 'current' : 'locked';
        
        return (
          <motion.button
            key={city.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            onClick={() => onCityClick(index)}
            disabled={status === 'locked'}
            whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
            whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2
              ${status === 'completed' ? 'bg-green-500 border-white text-white' : ''}
              ${status === 'current' ? 'bg-indigo-600 border-white text-white' : ''}
              ${status === 'locked' ? 'bg-slate-400 border-slate-200 text-slate-200 cursor-not-allowed' : ''}
            `}>
              {status === 'completed' && <Check size={24} />}
              {status === 'current' && <MapPin size={24} />}
              {status === 'locked' && <Lock size={20} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
