'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Lenis from 'lenis';

export default function AnimationsDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Anime.js example
  useEffect(() => {
    if (boxRef.current) {
      anime({
        targets: boxRef.current,
        translateX: 250,
        rotate: '1turn',
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
      });
    }
  }, []);

  // GSAP example
  useEffect(() => {
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, repeat: -1, yoyo: true }
      );
    }
  }, []);

  // Lenis smooth scrolling
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      // Lenis cleanup not needed for demo
    };
  }, []);

  return (
    <motion.div
      className="p-4"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div
        ref={boxRef}
        className="w-16 h-16 bg-blue-500 rounded"
      ></div>
    </motion.div>
  );
}
