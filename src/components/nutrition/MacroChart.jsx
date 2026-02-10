import { motion } from "framer-motion";

const macros = [
  { name: "Protein", color: "bg-rose-500", target: 120 },
  { name: "Carbs", color: "bg-amber-500", target: 200 },
  { name: "Fat", color: "bg-blue-500", target: 65 },
];

export default function MacroChart({ protein = 0, carbs = 0, fat = 0 }) {
  const data = [
    { ...macros[0], value: protein },
    { ...macros[1], value: carbs },
    { ...macros[2], value: fat },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-lg shadow-black/5"
    >
      <h3 className="font-semibold text-slate-800 mb-4">Macros</h3>
      
      <div className="space-y-4">
        {data.map((macro, index) => {
          const progress = Math.min((macro.value / macro.target) * 100, 100);
          
          return (
            <div key={macro.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">{macro.name}</span>
                <span className="text-slate-500">
                  {macro.value}g / {macro.target}g
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`h-full ${macro.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie Chart Visual */}
      <div className="flex items-center justify-center mt-6">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map((macro, index) => {
              const total = data.reduce((acc, m) => acc + m.value, 0) || 1;
              const percentage = (macro.value / total) * 100;
              const offset = data.slice(0, index).reduce((acc, m) => acc + (m.value / total) * 100, 0);
              
              return (
                <motion.circle
                  key={macro.name}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  strokeWidth="3"
                  className={macro.color.replace('bg-', 'stroke-')}
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${percentage} ${100 - percentage}` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  style={{ strokeDashoffset: -offset }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-slate-500 font-medium">
              {data.reduce((acc, m) => acc + m.value, 0)}g
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}