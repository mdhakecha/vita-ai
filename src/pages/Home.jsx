import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Footprints, Flame, Clock, Heart, Bell } from "lucide-react";

import MetricCard from "@/components/dashboard/MetricCard";
import MoodWidget from "@/components/dashboard/MoodWidget";
import SleepWidget from "@/components/dashboard/SleepWidget";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityRing from "@/components/dashboard/ActivityRing";
import MoodLogger from "@/components/mind/MoodLogger";

export default function Home() {
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [greeting, setGreeting] = useState("");
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: todayMetrics } = useQuery({
    queryKey: ["healthMetrics", today],
    queryFn: () => base44.entities.HealthMetric.filter({ date: today, created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: todayMood } = useQuery({
    queryKey: ["moodEntries", today],
    queryFn: () => base44.entities.MoodEntry.filter({ created_by: user?.email }, "-created_date", 1),
    enabled: !!user?.email,
  });

  const saveMoodMutation = useMutation({
    mutationFn: (data) => base44.entities.MoodEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["moodEntries"]);
      setShowMoodLogger(false);
    },
  });

  const metrics = todayMetrics?.[0] || {};
  const userProfile = profile?.[0] || {};
  const currentMood = todayMood?.[0];

  const goals = {
    steps: userProfile.daily_steps_goal || 10000,
    calories: userProfile.daily_calorie_goal || 2000,
    water: userProfile.daily_water_goal || 2500,
    sleep: userProfile.sleep_goal_hours || 8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-orange-50/30">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-slate-500 text-sm font-medium">{greeting}</p>
            <h1 className="text-2xl font-bold text-slate-800">
              {user?.full_name?.split(" ")[0] || "there"} 👋
            </h1>
          </div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-2xl bg-white shadow-lg shadow-black/5"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Activity Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-6 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/5"
        >
          <ActivityRing
            value={metrics.steps || 0}
            goal={goals.steps}
            color="rose"
            label="Move"
            icon={Footprints}
          />
          <ActivityRing
            value={metrics.calories_burned || 0}
            goal={500}
            color="emerald"
            label="Exercise"
            icon={Flame}
          />
          <ActivityRing
            value={metrics.active_minutes || 0}
            goal={30}
            color="blue"
            label="Stand"
            icon={Clock}
          />
        </motion.div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <MetricCard
            icon={Footprints}
            label="Steps"
            value={metrics.steps || 0}
            goal={goals.steps}
            color="coral"
            delay={0.2}
          />
          <MetricCard
            icon={Flame}
            label="Calories"
            value={metrics.calories_burned || 0}
            unit="kcal"
            goal={500}
            color="mint"
            delay={0.25}
          />
          <MetricCard
            icon={Heart}
            label="Heart Rate"
            value={metrics.heart_rate_avg || 72}
            unit="bpm"
            color="purple"
            delay={0.3}
          />
          <MetricCard
            icon={Clock}
            label="Active"
            value={metrics.active_minutes || 0}
            unit="min"
            goal={30}
            color="blue"
            delay={0.35}
          />
        </div>

        {/* Mood & Sleep Widgets */}
        <div className="grid grid-cols-1 gap-4 mt-6">
          <MoodWidget
            mood={currentMood?.mood_label}
            energy={currentMood?.energy_level}
            onLogMood={() => setShowMoodLogger(true)}
          />
          <SleepWidget
            hours={metrics.sleep_hours || 0}
            quality={metrics.sleep_quality}
            goal={goals.sleep}
          />
        </div>

        {/* AI Insight */}
        <div className="mt-6">
          <AIInsightCard delay={0.4} />
        </div>

        {/* Streak Banner */}
        {userProfile.streak_days > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Current Streak</p>
                <p className="text-2xl font-bold">🔥 {userProfile.streak_days} days</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mood Logger Modal */}
      <AnimatePresence>
        {showMoodLogger && (
          <MoodLogger
            onSave={(data) => saveMoodMutation.mutate(data)}
            onClose={() => setShowMoodLogger(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}