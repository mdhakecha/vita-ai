import { motion } from "framer-motion";
import { Clock, Flame, Play, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const typeColors = {
  hiit: "from-rose-500 to-orange-500",
  yoga: "from-violet-500 to-purple-500",
  strength: "from-blue-500 to-indigo-500",
  cardio: "from-emerald-500 to-teal-500",
  stretching: "from-pink-500 to-rose-500",
  meditation: "from-indigo-500 to-purple-500",
};

const difficultyLabels = {
  beginner: { label: "Beginner", color: "text-emerald-600 bg-emerald-100" },
  intermediate: { label: "Intermediate", color: "text-amber-600 bg-amber-100" },
  advanced: { label: "Advanced", color: "text-rose-600 bg-rose-100" },
};

export default function WorkoutCard({ workout, onStart, delay = 0, isPremium = false }) {
  const gradient = typeColors[workout.type] || typeColors.hiit;
  const difficulty = difficultyLabels[workout.difficulty] || difficultyLabels.beginner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 border border-slate-100 group cursor-pointer"
      onClick={() => !workout.is_premium || isPremium ? onStart(workout) : null}
    >
      {/* Image/Gradient Header */}
      <div className={cn("relative h-32 bg-gradient-to-br", gradient)}>
        {workout.image_url ? (
          <img 
            src={workout.image_url} 
            alt={workout.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}
        
        {/* Premium Lock */}
        {workout.is_premium && !isPremium && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="p-3 rounded-full bg-white/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold capitalize">
          {workout.type}
        </div>

        {/* Premium Badge */}
        {workout.is_premium && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">
          {workout.name}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {workout.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{workout.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm">{workout.calories} cal</span>
            </div>
          </div>
          
          <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", difficulty.color)}>
            {difficulty.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}