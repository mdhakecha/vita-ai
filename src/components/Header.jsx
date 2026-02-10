import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./ui/Logo";

const rootPages = ["Home", "Workouts", "Nutrition", "Mind", "Profile"];

export default function Header({ currentPageName }) {
  const navigate = useNavigate();
  const isRootPage = rootPages.includes(currentPageName);

  if (isRootPage) {
    return null;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-4 flex items-center gap-3"
    >
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>
      <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
        {currentPageName === "AICoach" ? "AI Health Coach" : currentPageName}
      </h1>
    </motion.header>
  );
}