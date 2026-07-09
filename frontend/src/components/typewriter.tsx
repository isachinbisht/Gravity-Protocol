'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  phrases,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
  className,
  style,
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      const fullPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        setCurrentText(prev => prev.substring(0, prev.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          timeout = setTimeout(handleTyping, typingSpeed); // Pause before typing next
        } else {
          timeout = setTimeout(handleTyping, deletingSpeed);
        }
      } else {
        setCurrentText(fullPhrase.substring(0, currentText.length + 1));
        if (currentText === fullPhrase) {
          timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        } else {
          timeout = setTimeout(handleTyping, typingSpeed);
        }
      }
    };

    timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className} style={style}>
      {currentText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        style={{ display: 'inline-block', width: '4px', backgroundColor: 'currentColor', marginLeft: '4px', verticalAlign: 'middle', height: '0.9em' }}
      />
    </span>
  );
};
