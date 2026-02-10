import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const phases = [
  { name: "Breathe In", duration: 4, instruction: "Inhale slowly..." },
  { name: "Hold", duration: 4, instruction: "Hold your breath..." },
  { name: "Breathe Out", duration: 4, instruction: "Exhale slowly..." },
  { name: "Hold", duration: 4, instruction: "Rest..." },
];

export default function BreathingExercise({ onComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 4;

  useEffect(() => {
    let interval;
    
    if (isActive) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCurrentPhase((phase) => {
              const nextPhase = (phase + 1) % phases.length;
              if (nextPhase === 0) {
                setCycles((c) => {
                  if (c + 1 >= totalCycles) {
                    setIsActive(false);
                    onComplete?.();
                    return 0;
                  }
                  return c + 1;
                });
              }
              return nextPhase;
            });
            return phases[(currentPhase + 1) % phases.length].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, onComplete]);

  const reset = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCountdown(phases[0].duration);
    setCycles(0);
  };

  const phase = phases[currentPhase];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white"
    >
      <div className="absolute inset-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full border border-white/30"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={isActive ? {
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            } : {}}
            transition={{
              duration: phases[0].duration * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            <span className="font-medium">4-4-4-4 Breathing</span>
          </div>
          <span className="text-sm text-white/70">
            Cycle {cycles + 1}/{totalCycles}
          </span>
        </div>

        {/* Main Circle */}
        <div className="flex items-center justify-center py-8">
          <motion.div
            className="relative w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            animate={isActive ? {
              scale: currentPhase === 0 ? [1, 1.2] : 
                     currentPhase === 2 ? [1.2, 1] : 
                     currentPhase === 1 ? 1.2 : 1,
            } : { scale: 1 }}
            transition={{ duration: phase.duration }}
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-lg font-semibold mb-1">{phase.name}</p>
                  <p className="text-5xl font-bold">{countdown}</p>
                  <p className="text-sm text-white/70 mt-2">{phase.instruction}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-6 rounded-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {cycles > 0 ? "Resume" : "Start"}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}