'use client';

import { useState, useEffect, useCallback } from 'react';
import { CodeDisplay } from '@/components/molecules/CodeDisplay';
import { Stats } from '@/components/molecules/Stats';
import { Text } from '@/components/atoms/Text';
import { codeSnippets } from '@/utils/codeSnippets';
import { processCode } from '@/utils/codeProcessor';
import { Character } from '@/types/Character';
import { initHighlighter } from '@/utils/highlighter';

const IGNORE_KEYS = [
  'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 
  'Escape', 'ArrowLeft', 'ArrowRight', 
  'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 
  'PageDown', 'Insert', 'Delete', 'F1', 'F2', 'F3', 
  'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
];

export const TypingPractice = () => {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const currentSnippet = codeSnippets[currentSnippetIndex];

  // 하이라이터 초기화 및 초기 코드 처리
  useEffect(() => {
    const init = async () => {
      try {
        await initHighlighter();
        const chars = await processCode(currentSnippet.code, 'typescript');
        setCharacters(chars);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };
    init();
  }, [currentSnippet.code]);

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const typedCount = characters.filter(char => char.typedValue !== null).length;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = typedCount / 5;
    const currentWpm = Math.round(wordsTyped / timeElapsed);

    const correctCount = characters.filter(char => char.isCorrect).length;
    const currentAccuracy = (correctCount / typedCount) * 100;

    setWpm(currentWpm);
    setAccuracy(currentAccuracy || 100);
  }, [startTime, characters]);

  // 타이머 시작
  useEffect(() => {
    if (startTime && !timer) {
      const newTimer = setInterval(calculateStats, 1000);
      setTimer(newTimer);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    };
  }, [startTime, calculateStats, timer]);

  // 코드 스니펫 변경 시 처리
  const handleComplete = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (currentSnippetIndex < codeSnippets.length - 1) {
      setCurrentSnippetIndex(prev => prev + 1);
      setCurrentIndex(0);
      setIsLoading(true);
      processCode(codeSnippets[currentSnippetIndex + 1].code, 'typescript')
        .then(chars => {
          setCharacters(chars);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to process code:', error);
        });
      setStartTime(null);
      setWpm(0);
      setAccuracy(100);
    }
  }, [currentSnippetIndex, timer]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // 새로고침 단축키 허용
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      return;
    }

    e.preventDefault();

    if (IGNORE_KEYS.includes(e.key)) return;
    if (!startTime) setStartTime(Date.now());

    if (currentIndex < characters.length) {
      if (e.key === 'Backspace') {
        if (currentIndex > 0 && !characters[currentIndex - 1].isIndent) {
          setCharacters(prev => {
            const newChars = [...prev];
            newChars[currentIndex - 1].typedValue = null;
            return newChars;
          });
          setCurrentIndex(prev => prev - 1);
        }
      } else if (e.key === 'Tab' && characters[currentIndex].isIndent) {
        setCharacters(prev => {
          const newChars = [...prev];
          let i = currentIndex;
          while (i < newChars.length && newChars[i].isIndent) {
            newChars[i].typedValue = ' ';
            i++;
          }
          return newChars;
        });
        setCurrentIndex(prev => {
          let i = prev;
          while (i < characters.length && characters[i].isIndent) {
            i++;
          }
          return i;
        });
      } else if (e.key === 'Enter') {
        const currentChar = characters[currentIndex];
        if (currentChar.isNewline) {
          setCharacters(prev => {
            const newChars = [...prev];
            newChars[currentIndex].typedValue = '\n';
            return newChars;
          });
          setCurrentIndex(prev => {
            let i = prev + 1;
            while (i < characters.length && characters[i].isIndent) {
              characters[i].typedValue = ' ';
              i++;
            }
            return i;
          });
        }
      } else if (e.key.length === 1) {
        if (!characters[currentIndex].isNewline) {
          setCharacters(prev => {
            const newChars = [...prev];
            newChars[currentIndex].typedValue = e.key;
            return newChars;
          });
          setCurrentIndex(prev => prev + 1);
        }
      }
    } else {
      handleComplete();
    }
  }, [currentIndex, characters, startTime, handleComplete]);

  useEffect(() => {
    // keypress 대신 keydown 사용 (백스페이스 감지를 위해)
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (startTime) {
      calculateStats();
    }
  }, [characters, calculateStats, startTime]);

  const progress = (currentIndex / characters.length) * 100;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">{currentSnippet.title}</h2>
        <Text variant="caption">출처: {currentSnippet.source}</Text>
      </div>
      <Stats 
        wpm={wpm}
        accuracy={accuracy}
        progress={progress}
      />
      <CodeDisplay 
        characters={characters}
        currentIndex={currentIndex}
      />
    </div>
  );
}; 