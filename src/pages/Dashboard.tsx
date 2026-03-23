import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Activity, Heart, Brain, Zap, Moon, Droplets, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import RegenerationGauge from "@/components/dashboard/RegenerationGauge";
import { useNavigate } from "react-router-dom";

const trendData = [
  { day: "Mon", score: 62 }, { day: "Tue", score: 68 }, { day: "Wed", score: 65 },
  { day: "Thu", score: 72 }, { day: "Fri", score: 78 }, { day: "Sat", score: 74 }, { day: "Sun", score: 81 },
];

const healthMetrics = [
  { icon: Heart, label: "Heart Risk", value: "Low", detail: "8%", color: "text-glow-success" },
  { icon: Zap, label: "Stress Level", value: "Moderate", detail: "42/100", color: "text-glow-warning" },
  { icon: Brain, label: "Diabetes Risk", value: "Low", detail: "5%", color: "text-glow-success" },
  { icon: Moon, label: "Sleep Quality", value: "Good", detail: "7.2h", color: "text-primary" },
  { icon: Droplets, label: "Hydration", value: "Adequate", detail: "2.1L", color: "text-primary" },
  { icon: Activity, label: "Activity", value: "Active", detail: "8,432 steps", color: "text-glow-success" },
];

const aiSuggestions = [
  { text: "Increase water intake by 500ml for better cell recovery", priority: "medium" },
  { text: "Your sleep pattern improved — maintain 11pm bedtime", priority: "positive" },
  { text: "Consider a 20-minute walk to reduce stress levels", priority: "high" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("lifeguard_profile") || "{}"); }
    catch { return {}; }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-2 font-display font-bold text-foreground cursor-pointer" onClick={() => navigate("/")}>
            <Shield className="w-5 h-5 text-primary" />
            LifeGuard AI Pro
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile.name || "User"}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
              {(profile.name || "U")[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="container px-6 py-8 space-y-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered insights updated in real-time</p>
        </motion.div>

        {/* Top row: Regeneration + Trend */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-8"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-6 tracking-wide uppercase">Cell Regeneration Score</h3>
            <RegenerationGauge score={78} />
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Sleep", val: "7.2h" },
                { label: "Skin Health", val: "82%" },
                { label: "Recovery", val: "Good" },
              ].map(m => (
                <div key={m.label}>
                  <div className="text-sm font-semibold text-foreground">{m.val}</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-card border border-border rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Weekly Trend</h3>
              <div className="flex items-center gap-1 text-glow-success text-sm">
                <TrendingUp className="w-4 h-4" /> +12%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(174,72%,52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(174,72%,52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(215,12%,52%)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="hsl(215,12%,52%)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,14%,18%)", borderRadius: 8 }}
                  labelStyle={{ color: "hsl(210,20%,92%)" }}
                  itemStyle={{ color: "hsl(174,72%,52%)" }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(174,72%,52%)" strokeWidth={2} fill="url(#grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Health Metrics Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-4">Health Predictions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {healthMetrics.map(m => (
              <div key={m.label} className="bg-gradient-card border border-border rounded-xl p-4 text-center">
                <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-sm font-semibold text-foreground mt-1">{m.detail}</div>
                <div className={`text-xs mt-0.5 ${m.color}`}>{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-4">AI Suggestions</h3>
          <div className="space-y-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="bg-gradient-card border border-border rounded-xl px-5 py-4 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  s.priority === "high" ? "bg-glow-warning" : s.priority === "positive" ? "bg-glow-success" : "bg-primary"
                }`} />
                <span className="text-sm text-foreground">{s.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
