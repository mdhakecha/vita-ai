import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  progress, 
  goal,
  color = "coral",
  delay = 0 
}) {
  const colorClasses = {
    coral: "from-rose-500/20 to-orange-500/20 text-rose-600",
    mint: "from-emerald-500/20 to-teal-500/20 text-emerald-600",
    purple: "from-violet-500/20 to-purple-500/20 text-violet-600",
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-600",
    amber: "from-amber-500/20 to-yellow-500/20 text-amber-600",
  };

  const progressPercent = goal ? Math.min((value / goal) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg shadow-black/5 p-4"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colorClasses[color])} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-2 rounded-xl bg-gradient-to-br", colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {goal && (
            <span className="text-xs text-slate-500 font-medium">
              {Math.round(progressPercent)}%
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{value?.toLocaleString() || 0}</span>
            {unit && <span className="text-sm text-slate-500 dark:text-slate-400">{unit}</span>}
          </div>
        </div>

        {goal && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: delay + 0.2, duration: 0.6 }}
                className={cn("h-full rounded-full bg-gradient-to-r", 
                  color === "coral" && "from-rose-500 to-orange-500",
                  color === "mint" && "from-emerald-500 to-teal-500",
                  color === "purple" && "from-violet-500 to-purple-500",
                  color === "blue" && "from-blue-500 to-cyan-500",
                  color === "amber" && "from-amber-500 to-yellow-500"
                )}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Goal: {goal?.toLocaleString()} {unit}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}