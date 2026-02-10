import { motion } from "framer-motion";
import { Moon, Star, Clock } from "lucide-react";

const qualityColors = {
  excellent: "from-emerald-400 to-teal-500",
  good: "from-green-400 to-emerald-500",
  fair: "from-amber-400 to-orange-500",
  poor: "from-red-400 to-rose-500",
};

export default function SleepWidget({ hours, quality, goal = 8 }) {
  const percentage = Math.min((hours / goal) * 100, 100);
  const gradientClass = qualityColors[quality] || qualityColors.fair;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-5 text-white shadow-xl shadow-indigo-900/30"
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-300" />
            <span className="text-indigo-200 text-sm font-medium">Last Night</span>
          </div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-xs font-semibold capitalize`}>
            {quality || "No data"}
          </div>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold">{hours || 0}</span>
          <span className="text-lg text-indigo-300 mb-1">hrs</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-indigo-300">
            <span>Sleep Score</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="h-2 bg-indigo-800/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`}
            />
          </div>
          <p className="text-xs text-indigo-400">Goal: {goal} hours</p>
        </div>
      </div>
    </motion.div>
  );
}