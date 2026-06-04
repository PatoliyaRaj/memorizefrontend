'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Home, Compass } from 'lucide-react';

export default function NotFound() {
  // Generate random positions for floating particles/nodes
  const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  React.useEffect(() => {
    const items = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // -50% to 50%
      y: Math.random() * 100 - 50,
      size: Math.random() * 6 + 2, // 2px to 8px
      delay: Math.random() * 5,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="min-h-screen bg-surface-void flex items-center justify-center p-4 relative overflow-hidden select-none font-display">
      {/* Dynamic Animated Ambient Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      {/* Floating Glowing Aura Blobs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.12, 0.05],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" 
      />

      {/* Floating Synapse Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
              x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
              y: [`${p.y}vh`, `${p.y + (Math.random() * 10 - 5)}vh`],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-primary"
            style={{
              width: p.size,
              height: p.size,
              top: '50%',
              left: '50%',
              boxShadow: '0 0 12px var(--primary)',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-xl text-center relative z-10 p-6 md:p-8 flex flex-col items-center">
        
        {/* Animated Synaptic Circle Visualization */}
        <div className="relative size-36 mb-8 flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-primary/20"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -inset-4 rounded-full border border-teal-500/10 border-dashed"
          />

          {/* Connected/Disconnected Synapse Lines */}
          <svg className="absolute inset-0 size-full pointer-events-none" viewBox="0 0 144 144">
            {/* Center Hub */}
            <circle cx="72" cy="72" r="5" className="fill-primary" style={{ filter: 'drop-shadow(0 0 4px var(--primary))' }} />
            
            {/* Synapse line 1 */}
            <motion.line 
              x1="72" y1="72" x2="35" y2="40" 
              stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3"
              animate={{ strokeDashoffset: [0, -10] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <circle cx="35" cy="40" r="3" className="fill-[#6BD8CB]" />

            {/* Synapse line 2 */}
            <motion.line 
              x1="72" y1="72" x2="110" y2="45" 
              stroke="var(--primary)" strokeWidth="1.5" opacity="0.4"
              animate={{ stroke: ['var(--primary)', 'rgba(239, 68, 68, 0.2)', 'var(--primary)'] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <circle cx="110" cy="45" r="3.5" className="fill-primary" />

            {/* Disconnected line */}
            <motion.line 
              x1="72" y1="72" x2="72" y2="120" 
              stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" strokeDasharray="4,4"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.circle 
              cx="72" cy="120" r="4.5" className="fill-red-500" 
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' }}
            />
          </svg>

          {/* Center Brain Icon */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              filter: [
                'drop-shadow(0 0 8px rgba(107, 216, 203, 0.3))',
                'drop-shadow(0 0 16px rgba(107, 216, 203, 0.6))',
                'drop-shadow(0 0 8px rgba(107, 216, 203, 0.3))'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-surface-base/80 text-primary z-10 backdrop-blur-sm"
          >
            <Brain className="size-8 animate-pulse" />
          </motion.div>
        </div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#9BBFBB] font-black bg-primary/10 border border-primary/20 px-3 py-1 rounded-full inline-block">
            Error Coordinates: 404
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight font-display mt-2 leading-none">
            Cognitive Path <span className="text-primary bg-gradient-to-r from-primary to-[#6BD8CB] bg-clip-text text-transparent">Decayed</span>
          </h1>
          <p className="font-body text-xs md:text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto">
            The synaptic route you requested does not exist or has faded from memory. The neural consolidation coordinates could not be aligned.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full mt-10 max-w-2xl sm:max-w-none justify-center px-4 sm:px-0"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-primary text-on-primary hover:bg-[#6bd8cb] hover:text-[#0b111e] font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(107,216,203,0.2)] hover:shadow-[0_0_30px_rgba(107,216,203,0.35)] hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center gap-2 h-11 text-xs text-center font-body"
          >
            <ArrowLeft className="size-4 shrink-0" />
            Return to Dashboard
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto border border-border-default hover:border-primary/50 text-text-secondary hover:text-text-primary hover:bg-surface-hover/50 font-bold px-6 py-3 rounded-xl hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center gap-2 h-11 text-xs text-center font-body"
          >
            <Home className="size-4 shrink-0" />
            Home Interface
          </Link>
        </motion.div>

        {/* Console status footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 font-mono text-[9px] text-text-tertiary flex items-center gap-1.5 uppercase tracking-widest border border-border-subtle/50 px-3 py-1 rounded-md bg-surface-base/30"
        >
          <Compass className="size-3" />
          <span>Status: Decoupled Workspace</span>
        </motion.div>
        
      </div>
    </div>
  );
}
