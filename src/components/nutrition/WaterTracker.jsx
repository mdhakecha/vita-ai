import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WaterTracker({ current = 0, goal = 2500, onUpdate }) {
  const glassSize = 250; // ml per glass
  const glasses = Math.floor(current / glassSize);
  const progress = Math.min((current / goal) * 100, 100);

  const addWater = (amount) => {
    onUpdate(Math.max(0, current + amount));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-slate-600">Water Intake</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">{current}</span>
            <span className="text-slate-500">/ {goal} ml</span>
          </div>
        </div>

        {/* Water Glass Visual */}
        <div className="relative w-16 h-24 rounded-b-2xl border-4 border-blue-300 overflow-hidden bg-white">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-800 drop-shadow-sm">
              {glasses} 🥛
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{Math.round(progress)}% of daily goal</p>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addWater(-glassSize)}
          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          disabled={current <= 0}
        >
          <Minus className="w-4 h-4 mr-1" />
          250ml
        </Button>
        <Button
          size="sm"
          onClick={() => addWater(glassSize)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          250ml
        </Button>
      </div>
    </motion.div>
  );
}