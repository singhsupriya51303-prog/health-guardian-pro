import { motion } from "framer-motion";
import { TrendingUp, Award, Flame, Target, Dumbbell } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const strengthData = [
  { week: "W1", bench: 60, squat: 80, deadlift: 100 },
  { week: "W2", bench: 62.5, squat: 85, deadlift: 105 },
  { week: "W3", bench: 65, squat: 87.5, deadlift: 110 },
  { week: "W4", bench: 67.5, squat: 90, deadlift: 115 },
  { week: "W5", bench: 70, squat: 95, deadlift: 120 },
  { week: "W6", bench: 72.5, squat: 97.5, deadlift: 125 },
  { week: "W7", bench: 75, squat: 100, deadlift: 130 },
  { week: "W8", bench: 77.5, squat: 105, deadlift: 135 },
];

const bodyData = [
  { month: "Jan", weight: 82, fat: 22 },
  { month: "Feb", weight: 81, fat: 21 },
  { month: "Mar", weight: 80.5, fat: 20 },
  { month: "Apr", weight: 79, fat: 19 },
  { month: "May", weight: 78.5, fat: 18 },
  { month: "Jun", weight: 78, fat: 17 },
];

const personalRecords = [
  { lift: "Bench Press", weight: "77.5 kg", date: "2 days ago", icon: "🏋️" },
  { lift: "Squat", weight: "105 kg", date: "5 days ago", icon: "🦵" },
  { lift: "Deadlift", weight: "135 kg", date: "1 week ago", icon: "💪" },
  { lift: "Overhead Press", weight: "50 kg", date: "3 days ago", icon: "🏋️" },
];

const weeklyVolume = [
  { day: "Mon", volume: 12500 },
  { day: "Tue", volume: 15200 },
  { day: "Wed", volume: 0 },
  { day: "Thu", volume: 11800 },
  { day: "Fri", volume: 14300 },
  { day: "Sat", volume: 8900 },
  { day: "Sun", volume: 0 },
];

const ProgressStats = () => (
  <div className="space-y-6">
    {/* Summary cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { icon: Flame, label: "Streak", value: "12 days", color: "text-glow-warning" },
        { icon: Award, label: "PRs This Month", value: "4", color: "text-primary" },
        { icon: Target, label: "Workouts", value: "18", color: "text-glow-success" },
        { icon: Dumbbell, label: "Total Volume", value: "62.7t", color: "text-accent" },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-secondary rounded-xl p-3 text-center"
        >
          <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
          <div className="text-lg font-bold text-foreground">{s.value}</div>
          <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
        </motion.div>
      ))}
    </div>

    {/* Strength progression chart */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-secondary rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Strength Progression (kg)</h4>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={strengthData}>
          <defs>
            <linearGradient id="benchG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(174,72%,52%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(174,72%,52%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="squatG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(260,60%,60%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(260,60%,60%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="deadG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38,92%,55%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(38,92%,55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: "hsl(215,12%,52%)" }} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(215,12%,52%)" }} />
          <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,14%,18%)", borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="bench" stroke="hsl(174,72%,52%)" fill="url(#benchG)" strokeWidth={2} name="Bench" />
          <Area type="monotone" dataKey="squat" stroke="hsl(260,60%,60%)" fill="url(#squatG)" strokeWidth={2} name="Squat" />
          <Area type="monotone" dataKey="deadlift" stroke="hsl(38,92%,55%)" fill="url(#deadG)" strokeWidth={2} name="Deadlift" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {[{ name: "Bench", color: "bg-primary" }, { name: "Squat", color: "bg-accent" }, { name: "Deadlift", color: "bg-glow-warning" }].map(l => (
          <div key={l.name} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-muted-foreground">{l.name}</span>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Weekly Volume */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-secondary rounded-xl p-5"
    >
      <h4 className="text-sm font-semibold text-foreground mb-4">Weekly Volume (kg)</h4>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={weeklyVolume}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215,12%,52%)" }} />
          <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,14%,18%)", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="volume" fill="hsl(174,72%,52%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>

    {/* Personal Records */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-secondary rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-glow-warning" />
        <h4 className="text-sm font-semibold text-foreground">Personal Records</h4>
      </div>
      <div className="space-y-2">
        {personalRecords.map((pr, i) => (
          <motion.div
            key={pr.lift}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="flex items-center justify-between bg-muted rounded-lg px-4 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{pr.icon}</span>
              <div>
                <div className="text-sm font-medium text-foreground">{pr.lift}</div>
                <div className="text-xs text-muted-foreground">{pr.date}</div>
              </div>
            </div>
            <div className="text-sm font-bold text-primary">{pr.weight}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default ProgressStats;
