import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AIInsightCard({ insight, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-100 dark:border-rose-900/30 p-5"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-200/30 to-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-rose-700">AI Health Coach</span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
          {insight || "Based on your sleep data, I recommend a light 20-minute yoga session today and staying extra hydrated. Your body needs gentle recovery."}
        </p>

        <Link 
          to={createPageUrl("AICoach")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <Brain className="w-4 h-4" />
          Chat with AI Coach
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}