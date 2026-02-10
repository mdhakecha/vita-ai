import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileSelect({ value, onValueChange, options, placeholder, label }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left"
      >
        <span className={selectedOption ? "text-slate-800 dark:text-white" : "text-slate-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-full bg-white dark:bg-slate-900 rounded-t-3xl max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
                {label && <h3 className="font-semibold text-slate-800 dark:text-white">{label}</h3>}
              </div>
              
              <div className="overflow-y-auto max-h-[calc(70vh-80px)] p-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onValueChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                      value === option.value
                        ? "bg-violet-50 dark:bg-violet-900/30"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-medium ${
                        value === option.value 
                          ? "text-violet-600 dark:text-violet-400" 
                          : "text-slate-800 dark:text-white"
                      }`}>
                        {option.label}
                      </p>
                      {option.desc && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {option.desc}
                        </p>
                      )}
                    </div>
                    {value === option.value && (
                      <Check className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}