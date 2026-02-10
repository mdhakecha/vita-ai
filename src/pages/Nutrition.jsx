import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Plus, Camera, Utensils, Apple, Coffee, Moon, 
  ChevronRight, Sparkles, X, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WaterTracker from "@/components/nutrition/WaterTracker";
import MacroChart from "@/components/nutrition/MacroChart";

const mealTypes = [
  { value: "breakfast", label: "Breakfast", icon: Coffee, time: "6AM - 11AM" },
  { value: "lunch", label: "Lunch", icon: Apple, time: "11AM - 3PM" },
  { value: "dinner", label: "Dinner", icon: Utensils, time: "5PM - 9PM" },
  { value: "snack", label: "Snack", icon: Moon, time: "Anytime" },
];

export default function Nutrition() {
  const [showMealLogger, setShowMealLogger] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [mealData, setMealData] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: todayMeals = [] } = useQuery({
    queryKey: ["meals", today],
    queryFn: () => base44.entities.MealLog.filter({ date: today, created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: todayMetrics } = useQuery({
    queryKey: ["healthMetrics", today],
    queryFn: () => base44.entities.HealthMetric.filter({ date: today, created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => base44.entities.UserProfile.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const saveMealMutation = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["meals"]);
      setShowMealLogger(false);
      setMealData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
      setSelectedMealType(null);
      setSelectedFile(null);
    },
  });

  const updateWaterMutation = useMutation({
    mutationFn: async (waterAmount) => {
      const existing = todayMetrics?.[0];
      if (existing) {
        return base44.entities.HealthMetric.update(existing.id, { water_intake: waterAmount });
      } else {
        return base44.entities.HealthMetric.create({ date: today, water_intake: waterAmount });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["healthMetrics"]),
  });

  const analyzeFood = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    
    const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
    
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: "Analyze this food image and estimate its nutritional content. Be accurate with the calorie and macro estimates.",
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the food/meal" },
          calories: { type: "number", description: "Estimated calories" },
          protein: { type: "number", description: "Protein in grams" },
          carbs: { type: "number", description: "Carbs in grams" },
          fat: { type: "number", description: "Fat in grams" },
        },
      },
    });
    
    setMealData({
      name: result.name || "",
      calories: result.calories || "",
      protein: result.protein || "",
      carbs: result.carbs || "",
      fat: result.fat || "",
    });
    setIsAnalyzing(false);
  };

  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFat = todayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
  const calorieGoal = userProfile?.[0]?.daily_calorie_goal || 2000;
  const waterGoal = userProfile?.[0]?.daily_water_goal || 2500;
  const currentWater = todayMetrics?.[0]?.water_intake || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Nutrition</h1>
          <p className="text-slate-500 text-sm">Track your meals & hydration</p>
        </motion.div>

        {/* Calorie Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 mb-6 text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">Today's Calories</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{totalCalories}</span>
                  <span className="text-lg text-white/70">/ {calorieGoal}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Remaining</p>
                <p className="text-2xl font-bold">{Math.max(0, calorieGoal - totalCalories)}</p>
              </div>
            </div>
            
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Add Meal Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          {mealTypes.map((meal) => {
            const mealCount = todayMeals.filter((m) => m.meal_type === meal.value).length;
            return (
              <button
                key={meal.value}
                onClick={() => {
                  setSelectedMealType(meal.value);
                  setShowMealLogger(true);
                }}
                className="relative flex flex-col items-center p-3 rounded-2xl bg-white shadow-lg shadow-black/5 hover:shadow-xl transition-shadow"
              >
                {mealCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    {mealCount}
                  </span>
                )}
                <meal.icon className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs text-slate-600 font-medium">{meal.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <WaterTracker
            current={currentWater}
            goal={waterGoal}
            onUpdate={(amount) => updateWaterMutation.mutate(amount)}
          />
        </motion.div>

        {/* Macros Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <MacroChart protein={totalProtein} carbs={totalCarbs} fat={totalFat} />
        </motion.div>

        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Today's Meals</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMealLogger(true)}
              className="text-emerald-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Meal
            </Button>
          </div>

          {todayMeals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No meals logged today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeals.map((meal) => {
                const mealType = mealTypes.find((m) => m.value === meal.meal_type);
                const MealIcon = mealType?.icon || Utensils;
                
                return (
                  <div
                    key={meal.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg shadow-black/5"
                  >
                    <div className="p-3 rounded-xl bg-emerald-100">
                      <MealIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{meal.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{meal.meal_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{meal.calories} cal</p>
                      <p className="text-xs text-slate-500">
                        P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Meal Logger Modal */}
      <AnimatePresence>
        {showMealLogger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowMealLogger(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Log Meal</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMealLogger(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Meal Type Selection */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {mealTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedMealType(type.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedMealType === type.value
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Photo Analysis */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  AI Food Analysis
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                    <Camera className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {selectedFile ? selectedFile.name : "Take photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </label>
                  <Button
                    onClick={analyzeFood}
                    disabled={!selectedFile || isAnalyzing}
                    className="bg-gradient-to-r from-violet-500 to-purple-500"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Meal Name</label>
                  <Input
                    value={mealData.name}
                    onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
                    placeholder="e.g., Grilled chicken salad"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Calories</label>
                    <Input
                      type="number"
                      value={mealData.calories}
                      onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Protein (g)</label>
                    <Input
                      type="number"
                      value={mealData.protein}
                      onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Carbs (g)</label>
                    <Input
                      type="number"
                      value={mealData.carbs}
                      onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Fat (g)</label>
                    <Input
                      type="number"
                      value={mealData.fat}
                      onChange={(e) => setMealData({ ...mealData, fat: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  saveMealMutation.mutate({
                    date: today,
                    meal_type: selectedMealType || "snack",
                    name: mealData.name,
                    calories: parseInt(mealData.calories) || 0,
                    protein: parseInt(mealData.protein) || 0,
                    carbs: parseInt(mealData.carbs) || 0,
                    fat: parseInt(mealData.fat) || 0,
                  });
                }}
                disabled={!mealData.name}
                className="w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
              >
                Save Meal
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}