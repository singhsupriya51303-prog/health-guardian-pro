import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Shield, Heart, Eye, MessageCircle, Activity, AlertTriangle,
  Utensils, Dumbbell, BarChart3, Clock, Bell, FileText, Lock,
  Cpu, Zap, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp,
  Sparkles, Globe, Mic, TrendingUp, Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";

type AgentStatus = "active" | "standby" | "processing";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  status: AgentStatus;
  model: string;
  tasks: number;
  accuracy: number;
}

const agents: Agent[] = [
  // Core
  { id: "orchestrator", name: "Master Orchestrator", description: "Routes tasks to specialized agents, manages workflows and coordinates multi-agent pipelines.", category: "Core", icon: Brain, status: "active", model: "GPT-5", tasks: 1284, accuracy: 99.2 },
  { id: "planner", name: "Task Planner", description: "Breaks down complex health queries into sub-tasks for parallel agent processing.", category: "Core", icon: Cpu, status: "active", model: "Gemini 2.5 Pro", tasks: 867, accuracy: 97.8 },
  { id: "decision", name: "Decision Agent", description: "Aggregates results from multiple agents and makes final recommendations.", category: "Core", icon: Zap, status: "active", model: "Claude 3.5", tasks: 743, accuracy: 98.1 },
  // Health
  { id: "health-predict", name: "Health Prediction", description: "Predicts disease risks using ML models (Random Forest, XGBoost) on user health data.", category: "Health", icon: Heart, status: "active", model: "Custom ML", tasks: 2341, accuracy: 94.6 },
  { id: "regeneration", name: "Regeneration Analysis", description: "Calculates recovery score from sleep, nutrition, activity, and skin health indicators.", category: "Health", icon: Activity, status: "processing", model: "Vision Transformer", tasks: 1892, accuracy: 91.3 },
  { id: "lifestyle", name: "Lifestyle Coach", description: "Generates personalized diet plans, workout routines, and daily habit recommendations.", category: "Health", icon: Sparkles, status: "active", model: "GPT-5", tasks: 3120, accuracy: 96.4 },
  { id: "nutrition", name: "Nutrition Advisor", description: "Analyzes dietary intake and provides macro/micronutrient optimization suggestions.", category: "Health", icon: Utensils, status: "active", model: "Gemini 2.5 Flash", tasks: 1567, accuracy: 95.1 },
  { id: "fitness", name: "Fitness Trainer", description: "Creates adaptive workout programs based on user goals, progress, and recovery state.", category: "Health", icon: Dumbbell, status: "standby", model: "GPT-5 Mini", tasks: 982, accuracy: 93.7 },
  // Emergency
  { id: "fall-detect", name: "Fall Detection", description: "Uses pose estimation and motion analysis to detect falls in real-time camera feeds.", category: "Emergency", icon: AlertTriangle, status: "active", model: "MediaPipe + CNN", tasks: 156, accuracy: 97.9 },
  { id: "emergency-decision", name: "Emergency Decision", description: "Evaluates severity of detected emergencies and determines appropriate response level.", category: "Emergency", icon: Shield, status: "standby", model: "GPT-5", tasks: 43, accuracy: 99.1 },
  { id: "alert-notify", name: "Alert Notification", description: "Sends SMS, push notifications, and calls to emergency contacts with GPS location.", category: "Emergency", icon: Bell, status: "standby", model: "System", tasks: 28, accuracy: 100 },
  { id: "first-aid", name: "First Aid Guide", description: "Provides voice-based first aid instructions during emergencies using medical protocols.", category: "Emergency", icon: Heart, status: "standby", model: "GPT-5", tasks: 15, accuracy: 98.5 },
  // Vision
  { id: "skin-analysis", name: "Skin Analysis", description: "Analyzes skin texture, fatigue signs, and aging indicators using CNN vision models.", category: "Vision", icon: Eye, status: "processing", model: "Vision Transformer", tasks: 1243, accuracy: 89.7 },
  { id: "pose-detect", name: "Pose Detection", description: "Real-time body pose estimation for posture analysis and movement tracking.", category: "Vision", icon: Activity, status: "active", model: "MediaPipe", tasks: 4521, accuracy: 96.2 },
  { id: "activity-recog", name: "Activity Recognition", description: "Classifies physical activities (walking, running, exercises) from video streams.", category: "Vision", icon: TrendingUp, status: "active", model: "CNN + LSTM", tasks: 3890, accuracy: 93.4 },
  { id: "face-monitor", name: "Face Monitoring", description: "Tracks facial cues for stress, fatigue, and health indicators in real-time.", category: "Vision", icon: Eye, status: "standby", model: "FaceNet + Custom", tasks: 2156, accuracy: 90.8 },
  // NLP
  { id: "doctor-chat", name: "AI Doctor Chatbot", description: "Conversational health assistant providing medical information and triage guidance.", category: "NLP", icon: MessageCircle, status: "active", model: "GPT-5", tasks: 8934, accuracy: 97.3 },
  { id: "voice-assist", name: "Voice Assistant", description: "Speech-to-text and text-to-speech for hands-free health interaction.", category: "NLP", icon: Mic, status: "standby", model: "Whisper + TTS", tasks: 1234, accuracy: 95.6 },
  { id: "translator", name: "Multilingual Translator", description: "Translates health content between English, Hindi, and Odia languages.", category: "NLP", icon: Globe, status: "active", model: "NLLB-200", tasks: 567, accuracy: 94.2 },
  // Data
  { id: "data-analyst", name: "Data Analyst", description: "Performs statistical analysis on health records to identify trends and anomalies.", category: "Data", icon: BarChart3, status: "active", model: "Custom ML", tasks: 2345, accuracy: 96.8 },
  { id: "forecaster", name: "Forecasting Agent", description: "Time-series prediction for health metrics and disease risk trajectories.", category: "Data", icon: TrendingUp, status: "processing", model: "Prophet + LSTM", tasks: 1678, accuracy: 92.1 },
  // Utility
  { id: "scheduler", name: "Scheduler", description: "Manages medication reminders, appointment scheduling, and health check-up timers.", category: "Utility", icon: Clock, status: "active", model: "System", tasks: 5678, accuracy: 100 },
  { id: "report-gen", name: "Report Generator", description: "Creates comprehensive PDF health reports with charts, insights, and recommendations.", category: "Utility", icon: FileText, status: "standby", model: "GPT-5 + Charts", tasks: 432, accuracy: 98.9 },
  { id: "security", name: "Privacy & Security", description: "Encrypts health data, manages consent, and ensures HIPAA-compliant data handling.", category: "Safety", icon: Lock, status: "active", model: "System", tasks: 12045, accuracy: 100 },
];

const categories = ["All", "Core", "Health", "Emergency", "Vision", "NLP", "Data", "Utility", "Safety"];

const statusConfig: Record<AgentStatus, { color: string; icon: React.ElementType; label: string }> = {
  active: { color: "text-emerald-400", icon: CheckCircle2, label: "Active" },
  standby: { color: "text-amber-400", icon: XCircle, label: "Standby" },
  processing: { color: "text-primary", icon: Loader2, label: "Processing" },
};

const AIAgents = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const filtered = agents.filter(a => {
    const matchCat = selectedCategory === "All" || a.category === selectedCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === "active").length,
    processing: agents.filter(a => a.status === "processing").length,
    totalTasks: agents.reduce((s, a) => s + a.tasks, 0),
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> AI Agent Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.total} agents • {stats.active} active • {stats.totalTasks.toLocaleString()} tasks completed
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Agents", value: stats.total, icon: Cpu },
            { label: "Active", value: stats.active, icon: CheckCircle2 },
            { label: "Processing", value: stats.processing, icon: Loader2 },
            { label: "Tasks Done", value: stats.totalTasks.toLocaleString(), icon: Zap },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="whitespace-nowrap text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(agent => {
              const sc = statusConfig[agent.status];
              const isExpanded = expandedAgent === agent.id;
              return (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <agent.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{agent.name}</h3>
                        <Badge variant="outline" className="text-[10px] mt-0.5">{agent.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <sc.icon className={`w-3.5 h-3.5 ${sc.color} ${agent.status === "processing" ? "animate-spin" : ""}`} />
                      <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{agent.description}</p>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="bg-secondary rounded-lg py-2">
                            <p className="text-[10px] text-muted-foreground">Model</p>
                            <p className="text-xs font-medium text-foreground truncate px-1">{agent.model}</p>
                          </div>
                          <div className="bg-secondary rounded-lg py-2">
                            <p className="text-[10px] text-muted-foreground">Tasks</p>
                            <p className="text-xs font-medium text-foreground">{agent.tasks.toLocaleString()}</p>
                          </div>
                          <div className="bg-secondary rounded-lg py-2">
                            <p className="text-[10px] text-muted-foreground">Accuracy</p>
                            <p className="text-xs font-medium text-foreground">{agent.accuracy}%</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIAgents;
