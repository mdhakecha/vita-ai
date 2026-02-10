import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { 
  Brain, Wind, BookOpen, Smile, TrendingUp, 
  Calendar, ChevronRight, Play, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BreathingExercise from "@/components/mind/BreathingExercise";

const meditations = [
  { id: 1, name: "Morning Calm", duration: 5, category: "Focus", color: "from-amber-400 to-orange-400" },
  { id: 2, name: "Stress Relief", duration: 10, category: "Relax", color: "from-violet-400 to-purple-400" },
  { id: 3, name: "Deep Sleep", duration: 15, category: "Sleep", color: "from-indigo-400 to-blue-400" },
  { id: 4, name: "Body Scan", duration: 8, category: "Awareness", color: "from-emerald-400 to-teal-400" },
  { id: 5, name: "Gratitude", duration: 5, category: "Positivity", color: "from-rose-400 to-pink-400" },
];

const moodEmojis = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  bad: "😔",
  terrible: "😢",
};

export default function Mind() {
  const [showBreathing, setShowBreathing] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: recentMoods = [] } = useQuery({
    queryKey: ["recentMoods"],
    queryFn: () => base44.entities.MoodEntry.filter({ created_by: user?.email }, "-created_date", 7),
    enabled: !!user?.email,
  });

  // Generate last 7 days for mood chart
  const last7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const mood = recentMoods.find((m) => m.date?.startsWith(dateStr));
    return {
      day: format(date, "EEE"),
      date: dateStr,
      mood: mood?.mood_label,
      score: mood?.mood_score || 0,
    };
  });

  const averageMood = recentMoods.length > 0
    ? (recentMoods.reduce((sum, m) => sum + (m.mood_score || 0), 0) / recentMoods.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/30">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Mindfulness</h1>
          <p className="text-slate-500 text-sm">Take care of your mental health</p>
        </motion.div>

        {/* Mood Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-xl shadow-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              <span className="font-semibold text-slate-800">Weekly Mood</span>
            </div>
            {averageMood && (
              <span className="text-sm text-slate-500">Avg: {averageMood}/5</span>
            )}
          </div>

          {/* Mood Chart */}
          <div className="flex items-end justify-between gap-2 h-24 mb-2">
            {last7Days.map((day, index) => (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: day.score > 0 ? `${(day.score / 5) * 100}%` : "8px" }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full max-w-8 rounded-t-lg ${
                    day.score > 0
                      ? "bg-gradient-to-t from-violet-500 to-purple-400"
                      : "bg-slate-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {last7Days.map((day) => (
              <div key={day.date} className="flex-1 text-center">
                <span className="text-xs text-slate-400">{day.day}</span>
                {day.mood && (
                  <div className="text-lg">{moodEmojis[day.mood]}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <button
            onClick={() => setShowBreathing(true)}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-5 text-white text-left"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Wind className="w-8 h-8 mb-3" />
            <p className="font-semibold">Breathing</p>
            <p className="text-sm text-white/70">4-4-4-4 technique</p>
          </button>

          <button className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 p-5 text-white text-left">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <BookOpen className="w-8 h-8 mb-3" />
            <p className="font-semibold">Journal</p>
            <p className="text-sm text-white/70">Write your thoughts</p>
          </button>
        </motion.div>

        {/* Meditations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Meditations</h3>
            <Button variant="ghost" size="sm" className="text-violet-600">
              See All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {meditations.map((meditation, index) => (
              <motion.div
                key={meditation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => setSelectedMeditation(meditation)}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg shadow-black/5 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${meditation.color} text-white`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{meditation.name}</p>
                  <p className="text-sm text-slate-500">{meditation.category}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{meditation.duration}m</span>
                </div>
                <div className="p-2 rounded-full bg-slate-100">
                  <Play className="w-4 h-4 text-slate-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Journal Entries Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Reflections</h3>
          </div>

          {recentMoods.filter((m) => m.journal_entry).length > 0 ? (
            <div className="space-y-3">
              {recentMoods
                .filter((m) => m.journal_entry)
                .slice(0, 3)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-white rounded-2xl shadow-lg shadow-black/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{moodEmojis[entry.mood_label]}</span>
                      <span className="text-sm text-slate-500">
                        {format(new Date(entry.date), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {entry.journal_entry}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No journal entries yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBreathing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <BreathingExercise onComplete={() => setShowBreathing(false)} />
              <Button
                variant="ghost"
                onClick={() => setShowBreathing(false)}
                className="w-full mt-4 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meditation Player Modal */}
      <AnimatePresence>
        {selectedMeditation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedMeditation(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${selectedMeditation.color} p-6 text-white`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Brain className="w-16 h-16" />
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedMeditation.name}</h2>
                <p className="text-white/70 mb-6">{selectedMeditation.duration} minutes • {selectedMeditation.category}</p>
                
                <div className="flex justify-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedMeditation(null)}
                    className="text-white hover:bg-white/20"
                  >
                    Close
                  </Button>
                  <Button className="bg-white text-slate-800 hover:bg-white/90">
                    <Play className="w-5 h-5 mr-2" />
                    Start Session
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}