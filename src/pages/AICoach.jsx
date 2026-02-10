import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Sparkles, Send, Loader2, Bot, User, 
  Activity, Moon, Heart, Utensils, Brain 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

const quickPrompts = [
  { icon: Activity, text: "Suggest a workout for today", color: "bg-rose-100 text-rose-600" },
  { icon: Utensils, text: "What should I eat for dinner?", color: "bg-emerald-100 text-emerald-600" },
  { icon: Moon, text: "Help me sleep better", color: "bg-indigo-100 text-indigo-600" },
  { icon: Heart, text: "I'm feeling stressed", color: "bg-violet-100 text-violet-600" },
];

export default function AICoach() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: conversation, isLoading: loadingConversation } = useQuery({
    queryKey: ["aiConversation"],
    queryFn: async () => {
      const convos = await base44.entities.AIConversation.filter(
        { created_by: user?.email },
        "-created_date",
        1
      );
      return convos[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: healthContext } = useQuery({
    queryKey: ["healthContext"],
    queryFn: async () => {
      const [metrics, moods, workouts, meals, profile] = await Promise.all([
        base44.entities.HealthMetric.filter({ date: today, created_by: user.email }),
        base44.entities.MoodEntry.filter({ created_by: user.email }, "-created_date", 3),
        base44.entities.WorkoutLog.filter({ created_by: user.email }, "-created_date", 7),
        base44.entities.MealLog.filter({ date: today, created_by: user.email }),
        base44.entities.UserProfile.filter({ created_by: user.email }),
      ]);
      return { metrics: metrics[0], moods, workouts, meals, profile: profile[0] };
    },
    enabled: !!user?.email,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage) => {
      setIsTyping(true);
      
      // Build context string
      const ctx = healthContext;
      let contextStr = `User Health Context:
- Name: ${user?.full_name || "User"}
- Goal: ${ctx?.profile?.goal?.replace(/_/g, " ") || "General wellness"}
- Today's steps: ${ctx?.metrics?.steps || "Not tracked"}
- Today's sleep: ${ctx?.metrics?.sleep_hours || "Not tracked"} hours (${ctx?.metrics?.sleep_quality || "unknown"} quality)
- Today's calories consumed: ${ctx?.meals?.reduce((s, m) => s + (m.calories || 0), 0) || 0}
- Recent mood: ${ctx?.moods?.[0]?.mood_label || "Not logged"}
- Workouts this week: ${ctx?.workouts?.length || 0}
- Stress level: ${ctx?.moods?.[0]?.stress_level || "Not logged"}/5
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are VITA AI, a warm, supportive, and knowledgeable personal health coach. You provide personalized advice based on the user's health data.

${contextStr}

Previous conversation context:
${conversation?.messages?.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n") || "No previous context"}

User's message: ${userMessage}

Respond in a friendly, encouraging tone. Keep responses concise but helpful. If recommending workouts or meals, be specific. Reference their data when relevant to show personalization.`,
      });

      // Update conversation
      const messages = [
        ...(conversation?.messages || []),
        { role: "user", content: userMessage, timestamp: new Date().toISOString() },
        { role: "assistant", content: response, timestamp: new Date().toISOString() },
      ];

      if (conversation) {
        await base44.entities.AIConversation.update(conversation.id, {
          messages,
          context_summary: contextStr,
        });
      } else {
        await base44.entities.AIConversation.create({
          title: `Chat ${format(new Date(), "MMM d")}`,
          messages,
          context_summary: contextStr,
        });
      }

      setIsTyping(false);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["aiConversation"]);
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const handleSend = () => {
    if (!message.trim() || isTyping) return;
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  const handleQuickPrompt = (text) => {
    sendMessageMutation.mutate(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isTyping]);

  const messages = conversation?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-orange-50/30 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-6 bg-white/80 backdrop-blur-lg border-b border-slate-100"
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">VITA AI Coach</h1>
            <p className="text-sm text-slate-500">Your personal health companion</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && !loadingConversation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white">
                <Brain className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Hi, {user?.full_name?.split(" ")[0] || "there"}! 👋
              </h2>
              <p className="text-slate-500 mb-6">
                I'm your AI health coach. Ask me anything about workouts, nutrition, sleep, or stress management.
              </p>

              {/* Quick Prompts */}
              <div className="grid grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickPrompt(prompt.text)}
                    className="flex items-center gap-2 p-3 bg-white rounded-2xl shadow-lg shadow-black/5 text-left hover:shadow-xl transition-shadow"
                  >
                    <div className={`p-2 rounded-xl ${prompt.color}`}>
                      <prompt.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-700">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white h-fit">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-slate-800 to-slate-700 text-white"
                      : "bg-white shadow-lg shadow-black/5"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown className="text-sm text-slate-700 prose prose-sm max-w-none">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="p-2 rounded-xl bg-slate-200 h-fit">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white h-fit">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-white rounded-2xl shadow-lg shadow-black/5">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 bg-white/80 backdrop-blur-lg border-t border-slate-100"
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 py-6 rounded-2xl border-slate-200"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isTyping}
            className="p-6 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}