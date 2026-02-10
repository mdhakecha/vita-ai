import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Meh, Frown, Angry, Heart, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const moods = [
  { value: "great", icon: Heart, label: "Great", color: "text-emerald-500 bg-emerald-100 border-emerald-200" },
  { value: "good", icon: Smile, label: "Good", color: "text-green-500 bg-green-100 border-green-200" },
  { value: "okay", icon: Meh, label: "Okay", color: "text-amber-500 bg-amber-100 border-amber-200" },
  { value: "bad", icon: Frown, label: "Bad", color: "text-orange-500 bg-orange-100 border-orange-200" },
  { value: "terrible", icon: Angry, label: "Terrible", color: "text-red-500 bg-red-100 border-red-200" },
];

const activities = [
  "Exercise", "Work", "Family", "Friends", "Reading", "Music", 
  "Nature", "Meditation", "Gaming", "Shopping", "Cooking", "Sleep"
];

export default function MoodLogger({ onSave, onClose }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [energy, setEnergy] = useState([3]);
  const [stress, setStress] = useState([3]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [journal, setJournal] = useState("");

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    
    onSave({
      mood_score: moods.findIndex((m) => m.value === selectedMood) + 1,
      mood_label: selectedMood,
      energy_level: energy[0],
      stress_level: stress[0],
      activities: selectedActivities,
      journal_entry: journal,
      date: new Date().toISOString(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">How are you feeling?</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mood Selection */}
        <div className="flex justify-between mb-6">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                selectedMood === mood.value
                  ? mood.color
                  : "bg-slate-50 border-slate-100 text-slate-400"
              }`}
            >
              <mood.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Energy Level */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Energy Level</span>
            <span className="text-sm text-slate-500">{energy[0]}/5</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <Slider
              value={energy}
              onValueChange={setEnergy}
              max={5}
              min={1}
              step={1}
              className="flex-1"
            />
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Stress Level */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Stress Level</span>
            <span className="text-sm text-slate-500">{stress[0]}/5</span>
          </div>
          <Slider
            value={stress}
            onValueChange={setStress}
            max={5}
            min={1}
            step={1}
          />
        </div>

        {/* Activities */}
        <div className="mb-6">
          <span className="text-sm font-medium text-slate-600 block mb-2">
            What have you been up to?
          </span>
          <div className="flex flex-wrap gap-2">
            {activities.map((activity) => (
              <button
                key={activity}
                onClick={() => toggleActivity(activity)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedActivities.includes(activity)
                    ? "bg-violet-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        {/* Journal */}
        <div className="mb-6">
          <span className="text-sm font-medium text-slate-600 block mb-2">
            Any thoughts to share? (optional)
          </span>
          <Textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Write about your day..."
            className="resize-none"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold"
        >
          Save Entry
        </Button>
      </motion.div>
    </motion.div>
  );
}