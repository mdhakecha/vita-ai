import { motion } from "framer-motion";
import { Download, Smartphone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";

export default function AppStoreAssets() {
  const appIcon = () => (
    <div className="w-full aspect-square rounded-[22%] bg-gradient-to-br from-rose-500 via-violet-500 to-purple-600 flex items-center justify-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-pink-500/30 blur-2xl" />
      <svg viewBox="0 0 100 100" className="w-3/5 h-3/5 relative z-10">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#fff", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#fef3c7", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M50,85 C50,85 15,60 15,40 C15,25 25,15 35,15 C42,15 47,20 50,25 C53,20 58,15 65,15 C75,15 85,25 85,40 C85,60 50,85 50,85 Z"
          fill="url(#heartGrad)"
        />
        <circle cx="75" cy="25" r="8" fill="#fbbf24" opacity="0.9" />
        <circle cx="72" cy="22" r="3" fill="#fef3c7" opacity="0.6" />
      </svg>
    </div>
  );

  const screenshots = [
    {
      title: "Dashboard",
      bg: "from-slate-50 to-rose-50",
      content: (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Good morning</p>
              <h2 className="text-xl font-bold">Alex 👋</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-2xl bg-white shadow-lg flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-transparent" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600" />
            <div className="h-24 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900" />
          </div>
        </div>
      )
    },
    {
      title: "AI Coach",
      bg: "from-rose-50 to-orange-50",
      content: (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500" />
            <div>
              <h2 className="font-bold">VITA AI Coach</h2>
              <p className="text-xs text-slate-500">Your health companion</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="max-w-[70%] p-3 rounded-2xl bg-slate-800 text-white text-xs">
              Help me sleep better
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500" />
            <div className="max-w-[70%] p-3 rounded-2xl bg-white shadow-lg text-xs">
              Based on your data, try a 20-min meditation before bed...
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Workouts",
      bg: "from-orange-50 to-yellow-50",
      content: (
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Today's Workouts</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-4 text-white">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">Morning HIIT</p>
                    <p className="text-xs opacity-80">30 min • 250 cal</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Nutrition",
      bg: "from-green-50 to-emerald-50",
      content: (
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-xs text-slate-500">Today's Calories</p>
            <h2 className="text-3xl font-bold">1,850</h2>
            <p className="text-xs text-slate-500">of 2,200 goal</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Protein', 'Carbs', 'Fat'].map(m => (
              <div key={m} className="text-center p-3 rounded-xl bg-white">
                <p className="text-xs text-slate-500">{m}</p>
                <p className="font-bold">45g</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
              <div key={meal} className="h-16 rounded-xl bg-white shadow flex items-center px-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 mr-3" />
                <p className="font-medium text-sm">{meal}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Mindfulness",
      bg: "from-violet-50 to-purple-50",
      content: (
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Mind & Mood</h2>
          <div className="h-40 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-4 text-white flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl mb-2">😊</p>
              <p className="font-semibold">Feeling Great</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Meditation', 'Breathing', 'Journal', 'Sleep'].map(item => (
              <div key={item} className="aspect-square rounded-xl bg-white shadow flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-violet-100 mb-2" />
                <p className="text-xs font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-rose-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            VITA AI App Store Assets
          </h1>
          <p className="text-slate-600">Marketing materials and promotional graphics</p>
        </motion.div>

        {/* App Icon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-800">App Icon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1024, 512, 256, 180].map((size) => (
              <div key={size} className="space-y-3">
                <div className="aspect-square bg-white rounded-2xl shadow-2xl p-6">
                  {appIcon()}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700">{size}x{size}px</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Screenshots Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-800">App Screenshots (6.5" Display)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {screenshots.map((screen, idx) => (
              <motion.div
                key={screen.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="space-y-4"
              >
                <div className="relative aspect-[9/19.5] bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
                  <div className={`w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${screen.bg}`}>
                    {screen.content}
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 mb-2">{screen.title}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Promotional Banner</h2>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-violet-500 to-purple-600 p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <Logo size="lg" showText={false} />
                <h3 className="text-4xl font-bold mb-4 mt-6">VITA AI</h3>
                <p className="text-xl mb-2 text-white/90">Your Personal Health Companion</p>
                <p className="text-white/80 mb-6">AI-powered fitness, nutrition, and mental wellness in one beautiful app</p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur">
                    <p className="text-xs opacity-80">Track Everything</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur">
                    <p className="text-xs opacity-80">AI Coach</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur">
                    <p className="text-xs opacity-80">Smart Insights</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 aspect-[9/19.5] bg-white/10 backdrop-blur-sm rounded-3xl p-2">
                  <div className="w-full h-full bg-white rounded-2xl opacity-20" />
                </div>
                <div className="flex-1 aspect-[9/19.5] bg-white/10 backdrop-blur-sm rounded-3xl p-2">
                  <div className="w-full h-full bg-white rounded-2xl opacity-20" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download Banner (1200x628px)
            </Button>
          </div>
        </motion.div>

        {/* App Store Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">App Store Description</h2>
          <div className="space-y-4 text-slate-600">
            <p className="font-semibold text-lg text-slate-800">
              Transform Your Health with AI-Powered Personalization
            </p>
            <p>
              VITA AI is your complete health companion, combining fitness tracking, nutrition management, 
              mental wellness, and AI-powered coaching in one beautiful, intuitive app.
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800">✨ Key Features:</p>
              <ul className="space-y-1 ml-4">
                <li>• AI Health Coach with personalized insights</li>
                <li>• Comprehensive fitness tracking and workout plans</li>
                <li>• Smart nutrition logging with AI food recognition</li>
                <li>• Mood tracking and mindfulness exercises</li>
                <li>• Sleep analysis and improvement tips</li>
                <li>• Beautiful, easy-to-use interface</li>
                <li>• Apple Health integration</li>
              </ul>
            </div>
            <p>
              Whether you're looking to lose weight, build muscle, reduce stress, or simply live healthier, 
              VITA AI provides the tools and guidance you need to achieve your goals.
            </p>
            <p className="text-sm text-slate-500 italic">
              Download now and start your journey to better health! 🚀
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}