import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, Settings, Target, Ruler, Scale, Activity, 
  Moon, Droplets, Flame, Crown, ChevronRight, LogOut,
  Bell, Shield, HelpCircle, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const goals = [
  { value: "lose_weight", label: "Lose Weight", icon: "🔥" },
  { value: "gain_muscle", label: "Build Muscle", icon: "💪" },
  { value: "maintain", label: "Maintain Weight", icon: "⚖️" },
  { value: "improve_fitness", label: "Improve Fitness", icon: "🏃" },
  { value: "reduce_stress", label: "Reduce Stress", icon: "🧘" },
  { value: "better_sleep", label: "Better Sleep", icon: "😴" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "lightly_active", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const saveProfileMutation = useMutation({
    mutationFn: async (data) => {
      if (profile) {
        return base44.entities.UserProfile.update(profile.id, data);
      } else {
        return base44.entities.UserProfile.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      setIsEditing(false);
    },
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  const menuItems = [
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: Shield, label: "Privacy", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/30">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 mb-6 text-white"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {user?.full_name?.charAt(0) || "V"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user?.full_name || "User"}</h1>
              <p className="text-white/70 text-sm">{user?.email}</p>
              
              {profile?.is_premium ? (
                <div className="flex items-center gap-1 mt-2">
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-semibold text-amber-300">Premium Member</span>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around mt-6 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.streak_days || 0}</p>
              <p className="text-xs text-white/70">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.weight_kg || "-"}</p>
              <p className="text-xs text-white/70">kg</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{profile?.height_cm || "-"}</p>
              <p className="text-xs text-white/70">cm</p>
            </div>
          </div>
        </motion.div>

        {/* Goals & Targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-xl shadow-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Your Goals</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-violet-600"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* Goal Selection */}
              <div>
                <Label>Primary Goal</Label>
                <Select
                  value={formData.goal || ""}
                  onValueChange={(val) => setFormData({ ...formData, goal: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.icon} {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Level */}
              <div>
                <Label>Activity Level</Label>
                <Select
                  value={formData.activity_level || ""}
                  onValueChange={(val) => setFormData({ ...formData, activity_level: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    value={formData.height_cm || ""}
                    onChange={(e) => setFormData({ ...formData, height_cm: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.weight_kg || ""}
                    onChange={(e) => setFormData({ ...formData, weight_kg: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Daily Goals */}
              <div>
                <Label>Daily Steps Goal: {formData.daily_steps_goal || 10000}</Label>
                <Slider
                  value={[formData.daily_steps_goal || 10000]}
                  onValueChange={([val]) => setFormData({ ...formData, daily_steps_goal: val })}
                  min={5000}
                  max={20000}
                  step={1000}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Daily Calorie Goal: {formData.daily_calorie_goal || 2000}</Label>
                <Slider
                  value={[formData.daily_calorie_goal || 2000]}
                  onValueChange={([val]) => setFormData({ ...formData, daily_calorie_goal: val })}
                  min={1200}
                  max={4000}
                  step={100}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Daily Water Goal: {formData.daily_water_goal || 2500} ml</Label>
                <Slider
                  value={[formData.daily_water_goal || 2500]}
                  onValueChange={([val]) => setFormData({ ...formData, daily_water_goal: val })}
                  min={1500}
                  max={4000}
                  step={250}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Sleep Goal: {formData.sleep_goal_hours || 8} hours</Label>
                <Slider
                  value={[formData.sleep_goal_hours || 8]}
                  onValueChange={([val]) => setFormData({ ...formData, sleep_goal_hours: val })}
                  min={5}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={() => saveProfileMutation.mutate(formData)}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Target className="w-5 h-5 text-violet-500" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Primary Goal</p>
                  <p className="font-medium text-slate-800 capitalize">
                    {profile?.goal?.replace(/_/g, " ") || "Not set"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Activity className="w-5 h-5 text-rose-500" />
                  <div>
                    <p className="text-xs text-slate-500">Steps</p>
                    <p className="font-semibold text-slate-800">{profile?.daily_steps_goal || 10000}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500">Calories</p>
                    <p className="font-semibold text-slate-800">{profile?.daily_calorie_goal || 2000}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-500">Water</p>
                    <p className="font-semibold text-slate-800">{profile?.daily_water_goal || 2500}ml</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-slate-500">Sleep</p>
                    <p className="font-semibold text-slate-800">{profile?.sleep_goal_hours || 8}h</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-4 mb-6 shadow-xl shadow-black/5"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-4 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <item.icon className="w-5 h-5 text-slate-600" />
              <span className="flex-1 text-left text-slate-800">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full py-6 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}