import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function Logo({ size = "md", showText = true, animated = false }) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-sm" },
    md: { container: "w-12 h-12", icon: "w-6 h-6", text: "text-xl" },
    lg: { container: "w-20 h-20", icon: "w-10 h-10", text: "text-3xl" },
    xl: { container: "w-32 h-32", icon: "w-16 h-16", text: "text-5xl" },
  };

  const currentSize = sizes[size];

  const LogoIcon = () => (
    <motion.div
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={animated ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`${currentSize.container} rounded-2xl bg-gradient-to-br from-rose-500 via-violet-500 to-purple-600 flex items-center justify-center relative overflow-hidden shadow-xl shadow-rose-500/30`}
    >
      {/* Animated background glow */}
      <motion.div
        animate={animated ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 blur-xl"
      />
      
      {/* Main icon */}
      <div className="relative z-10 flex items-center justify-center">
        <Heart className={`${currentSize.icon} text-white fill-white`} />
        <motion.div
          animate={animated ? {
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          className="absolute"
        >
          <Sparkles className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-300 -top-1 -right-1`} />
        </motion.div>
      </div>
    </motion.div>
  );

  if (!showText) {
    return <LogoIcon />;
  }

  return (
    <div className="flex items-center gap-3">
      <LogoIcon />
      <motion.div
        initial={animated ? { opacity: 0, x: -20 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.3 }}
      >
        <h1 className={`font-bold bg-gradient-to-r from-rose-500 via-violet-500 to-purple-600 bg-clip-text text-transparent ${currentSize.text}`}>
          VITA AI
        </h1>
        {size !== 'sm' && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Your Health Companion
          </p>
        )}
      </motion.div>
    </div>
  );
}