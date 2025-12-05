"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface SimpleTTSPlayerProps {
  text: string;
  articleTitle: string;
}

export function SimpleTTSPlayer({ text, articleTitle }: SimpleTTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;
    
    if (!synth) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const cleanText = text
      .replace(/[#*_>`\-\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const fullText = `${articleTitle}. ${cleanText}`;
    
    const newUtterance = new SpeechSynthesisUtterance(fullText);
    newUtterance.rate = playbackRate;
    newUtterance.lang = "en-US";

    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onerror = () => setIsPlaying(false);

    setUtterance(newUtterance);

    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, [text, articleTitle, playbackRate]);

  const handlePlayPause = () => {
    if (typeof window === "undefined") return;
    
    const synth = window.speechSynthesis;
    if (!synth || !utterance) return;

    if (isPlaying) {
      synth.pause();
      setIsPlaying(false);
    } else {
      if (synth.speaking) {
        synth.resume();
      } else {
        synth.speak(utterance);
      }
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined") return;
    
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.cancel();
    setIsPlaying(false);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    
    if (isPlaying) {
      handleStop();
      setTimeout(() => {
        handlePlayPause();
      }, 100);
    }
  };

  if (isSupported === false || isSupported === null) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2">
      {/* Divider */}
      <div className="w-px h-4 bg-black dark:bg-gray-600" />
      
      {/* Volume icon */}
      <div className="flex items-center gap-1">
        <Volume2 className="w-3.5 h-3.5 text-black dark:text-gray-400" />
      </div>
      
      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 transition-colors group"
        title={isPlaying ? "" : ""}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-medium">Pause</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5  ml-0.5" />
            <span className="text-sm font-medium">Listen</span>
          </>
        )}
      </button>
      
      {/* Speed selector dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="text-sm font-sans text-black dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 px-1.5 py-0.5 transition-colors"
          title="Playback speed"
        >
          {playbackRate} x
        </button>
        
        {showSpeedMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50 min-w-[80px]">
            {[0.5, 0.75, 1, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  playbackRate === rate
                    ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}