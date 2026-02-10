import { motion } from "framer-motion";

export default function ActivityRing({ 
  value, 
  goal, 
  size = 120, 
  strokeWidth = 12,
  color = "rose",
  label,
  icon: Icon
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / goal, 1);
  const offset = circumference - progress * circumference;

  const colorMap = {
    rose: { stroke: "stroke-rose-500", bg: "stroke-rose-100", text: "text-rose-500" },
    emerald: { stroke: "stroke-emerald-500", bg: "stroke-emerald-100", text: "text-emerald-500" },
    blue: { stroke: "stroke-blue-500", bg: "stroke-blue-100", text: "text-blue-500" },
  };

  const colors = colorMap[color] || colorMap.rose;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={colors.bg}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colors.stroke}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {Icon && <Icon className={`w-5 h-5 ${colors.text} mb-1`} />}
        <span className="text-lg font-bold text-slate-800">{Math.round(progress * 100)}%</span>
        {label && <span className="text-xs text-slate-500">{label}</span>}
      </div>
    </div>
  );
}