import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Home, Dumbbell, Utensils, Brain, Sparkles, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", page: "Home" },
  { icon: Dumbbell, label: "Workouts", page: "Workouts" },
  { icon: Utensils, label: "Nutrition", page: "Nutrition" },
  { icon: Brain, label: "Mind", page: "Mind" },
  { icon: User, label: "Profile", page: "Profile" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  // Hide nav on AI Coach page for full-screen experience
  const hideNav = currentPageName === "AICoach";

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      
      {!hideNav && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 pb-safe z-40"
        >
          <div className="max-w-lg mx-auto flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className="relative flex flex-col items-center py-2 px-3"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-xl transition-colors ${
                      isActive 
                        ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30" 
                        : "text-slate-400"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-xs mt-1 font-medium ${
                    isActive ? "text-rose-600" : "text-slate-400"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}

      {/* Floating AI Coach Button */}
      {!hideNav && currentPageName !== "AICoach" && (
        <Link to={createPageUrl("AICoach")}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-xl shadow-rose-500/30 flex items-center justify-center z-50"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </Link>
      )}

      <style>{`
        :root {
          --color-primary: #f43f5e;
          --color-secondary: #8b5cf6;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 8px);
        }
        
        /* Mobile optimizations */
        body {
          overscroll-behavior-y: none;
        }
        
        nav, button, .nav-item {
          user-select: none;
          -webkit-user-select: none;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        
        /* Smooth transitions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Dark mode */
        .dark {
          color-scheme: dark;
        }
        
        .dark body {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
}