import { motion } from "framer-motion";
import { Dumbbell, Utensils, Brain, Droplets, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const actions = [
  { icon: Dumbbell, label: "Workout", page: "Workouts", color: "from-rose-500 to-orange-500" },
  { icon: Utensils, label: "Log Meal", page: "Nutrition", color: "from-emerald-500 to-teal-500" },
  { icon: Brain, label: "Meditate", page: "Mind", color: "from-violet-500 to-purple-500" },
  { icon: Droplets, label: "Water", page: "Nutrition", color: "from-blue-500 to-cyan-500" },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-4 gap-3"
    >
      {actions.map((action, index) => (
        <Link
          key={action.label}
          to={createPageUrl(action.page)}
          className="group"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2">{action.label}</span>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
}