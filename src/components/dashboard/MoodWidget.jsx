import { motion } from "framer-motion";
import { Smile, Meh, Frown, Sun, Moon } from "lucide-react";

const moodIcons = {
  great: { icon: Smile, color: "text-emerald-500", bg: "bg-emerald-100" },
  good: { icon: Smile, color: "text-green-500", bg: "bg-green-100" },
  okay: { icon: Meh, color: "text-amber-500", bg: "bg-amber-100" },
  bad: { icon: Frown, color: "text-orange-500", bg: "bg-orange-100" },
  terrible: { icon: Frown, color: "text-red-500", bg: "bg-red-100" },
};

export default function MoodWidget({ mood, energy, onLogMood }) {
  const currentMood = moodIcons[mood] || moodIcons.okay;
  const MoodIcon = currentMood.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-xl shadow-purple-500/20"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm font-medium">Today's Mood</p>
            <p className="text-2xl font-bold capitalize mt-1">{mood || "Not logged"}</p>
          </div>
          <div className={`p-3 rounded-2xl ${currentMood.bg}`}>
            <MoodIcon className={`w-8 h-8 ${currentMood.color}`} />
          </div>
        </div>

        {energy && (
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-yellow-300" />
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(energy / 5) * 100}%` }}
                className="h-full bg-yellow-300 rounded-full"
              />
            </div>
            <span className="text-sm text-white/80">Energy</span>
          </div>
        )}

        <button
          onClick={onLogMood}
          className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-semibold backdrop-blur-sm"
        >
          {mood ? "Update Mood" : "Log Your Mood"}
        </button>
      </div>
    </motion.div>
  );
}