import { motion } from "framer-motion";
import { Dumbbell, Timer, Flame, TrendingUp } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const workouts = [
  { name: "Morning Stretch", duration: "10 min", cal: "45 kcal", done: true },
  { name: "HIIT Cardio", duration: "20 min", cal: "280 kcal", done: true },
  { name: "Core Strength", duration: "15 min", cal: "150 kcal", done: false },
  { name: "Evening Yoga", duration: "20 min", cal: "90 kcal", done: false },
];

const weeklyProgress = [
  { day: "Mon", mins: 45 },
  { day: "Tue", mins: 60 },
  { day: "Wed", mins: 30 },
  { day: "Thu", mins: 50 },
  { day: "Fri", mins: 0 },
  { day: "Sat", mins: 0 },
  { day: "Sun", mins: 0 },
];

const Fitness = () => (
  <AppLayout>
    <div className="container px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Fitness Trainer</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-personalized workout routines</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Timer, label: "Active Minutes", value: "185", unit: "/ 300 min" },
          { icon: Flame, label: "Calories Burned", value: "1,240", unit: "kcal" },
          { icon: TrendingUp, label: "Weekly Goal", value: "62%", unit: "complete" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-gradient-card border border-border rounded-xl p-4 text-center"
          >
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.unit}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Today's Plan</h3>
          </div>
          <div className="space-y-3">
            {workouts.map((w, i) => (
              <motion.div
                key={w.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    w.done ? "border-glow-success bg-glow-success/20" : "border-muted-foreground"
                  }`}>
                    {w.done && <span className="text-glow-success text-xs">✓</span>}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${w.done ? "text-foreground" : "text-muted-foreground"}`}>{w.name}</div>
                    <div className="text-xs text-muted-foreground">{w.duration} • {w.cal}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-gradient-card border border-border rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-6">Weekly Activity</h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyProgress.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden"
                  style={{ height: `${Math.max((d.mins / 60) * 100, 4)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((d.mins / 60) * 100, 4)}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-primary rounded-t-lg" style={{ opacity: d.mins > 0 ? 1 : 0.2 }} />
                </motion.div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </AppLayout>
);

export default Fitness;
