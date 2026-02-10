import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Dumbbell, Play, X, Clock, Flame, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutCard from "@/components/workout/WorkoutCard";

const workoutTypes = ["all", "hiit", "yoga", "strength", "cardio", "stretching"];

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const queryClient = useQueryClient();

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => base44.entities.Workout.list("-created_date", 50),
  });

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0];
    },
  });

  const logWorkoutMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["workoutLogs"]);
      setSelectedWorkout(null);
    },
  });

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === "all" || workout.type === activeType;
    return matchesSearch && matchesType;
  });

  const isPremium = userProfile?.is_premium;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-orange-50/30">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Workouts</h1>
          <p className="text-slate-500 text-sm">Find your perfect workout</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts..."
            className="pl-12 py-6 rounded-2xl bg-white border-slate-200"
          />
        </motion.div>

        {/* Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 overflow-x-auto"
        >
          <div className="flex gap-2 pb-2">
            {workoutTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeType === type
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Workout */}
        {filteredWorkouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 p-6 mb-6 text-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                Featured Today
              </span>
              <h2 className="text-xl font-bold mt-1 mb-2">{filteredWorkouts[0]?.name}</h2>
              <p className="text-sm text-white/80 mb-4 line-clamp-2">
                {filteredWorkouts[0]?.description}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{filteredWorkouts[0]?.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{filteredWorkouts[0]?.calories} cal</span>
                </div>
              </div>
              
              <Button
                onClick={() => setSelectedWorkout(filteredWorkouts[0])}
                className="bg-white text-rose-600 hover:bg-white/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </div>
          </motion.div>
        )}

        {/* Workout Grid */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))
          ) : filteredWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No workouts found</p>
            </div>
          ) : (
            filteredWorkouts.slice(1).map((workout, index) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={setSelectedWorkout}
                delay={0.2 + index * 0.05}
                isPremium={isPremium}
              />
            ))
          )}
        </div>
      </div>

      {/* Workout Detail Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedWorkout(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-48 bg-gradient-to-br from-rose-500 to-orange-500">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedWorkout(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold capitalize">
                    {selectedWorkout.type}
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-2">{selectedWorkout.name}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 text-center">
                    <Clock className="w-5 h-5 mx-auto text-slate-600 mb-1" />
                    <p className="text-sm font-semibold">{selectedWorkout.duration_minutes} min</p>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 text-center">
                    <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                    <p className="text-sm font-semibold">{selectedWorkout.calories} cal</p>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 text-center">
                    <Dumbbell className="w-5 h-5 mx-auto text-slate-600 mb-1" />
                    <p className="text-sm font-semibold capitalize">{selectedWorkout.difficulty}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6">{selectedWorkout.description}</p>

                {/* Exercises */}
                {selectedWorkout.exercises?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Exercises</h3>
                    <div className="space-y-2">
                      {selectedWorkout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{exercise.name}</p>
                              <p className="text-xs text-slate-500">
                                {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration_seconds}s`}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    logWorkoutMutation.mutate({
                      workout_id: selectedWorkout.id,
                      workout_name: selectedWorkout.name,
                      date: new Date().toISOString(),
                      duration_minutes: selectedWorkout.duration_minutes,
                      calories_burned: selectedWorkout.calories,
                      completed: true,
                    });
                  }}
                  className="w-full py-6 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}