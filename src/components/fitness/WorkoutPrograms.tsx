import { motion } from "framer-motion";
import { Calendar, Clock, Zap, Target, Trophy, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const programs = [
  {
    id: 1, name: "Push Pull Legs", duration: "6 weeks", days: "6 days/week", level: "Intermediate",
    description: "Classic PPL split for balanced muscle development",
    icon: Zap, color: "text-primary",
    schedule: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"],
  },
  {
    id: 2, name: "Starting Strength", duration: "12 weeks", days: "3 days/week", level: "Beginner",
    description: "Foundation program focusing on compound lifts and progressive overload",
    icon: Trophy, color: "text-glow-success",
    schedule: ["Squat/Bench/Row", "Rest", "Squat/OHP/Dead", "Rest", "Squat/Bench/Row", "Rest", "Rest"],
  },
  {
    id: 3, name: "Upper Lower Split", duration: "8 weeks", days: "4 days/week", level: "Intermediate",
    description: "High frequency training with optimal recovery between sessions",
    icon: Target, color: "text-glow-warning",
    schedule: ["Upper", "Lower", "Rest", "Upper", "Lower", "Rest", "Rest"],
  },
  {
    id: 4, name: "HIIT Fat Burn", duration: "4 weeks", days: "5 days/week", level: "Advanced",
    description: "Intense interval training for maximum calorie burn and conditioning",
    icon: Star, color: "text-destructive",
    schedule: ["HIIT", "Strength", "HIIT", "Strength", "HIIT", "Rest", "Rest"],
  },
];

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const levelColor: Record<string, string> = {
  Beginner: "bg-glow-success/20 text-glow-success border-glow-success/30",
  Intermediate: "bg-glow-warning/20 text-glow-warning border-glow-warning/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const WorkoutPrograms = () => (
  <div className="space-y-4">
    {programs.map((prog, i) => (
      <motion.div
        key={prog.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}
        className="bg-secondary rounded-xl p-5 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <prog.icon className={`w-5 h-5 ${prog.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{prog.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{prog.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] ${levelColor[prog.level]}`}>
            {prog.level}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{prog.duration}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{prog.days}</span>
        </div>

        {/* Weekly schedule preview */}
        <div className="grid grid-cols-7 gap-1">
          {prog.schedule.map((s, idx) => (
            <div key={idx} className="text-center">
              <div className="text-[9px] text-muted-foreground mb-1">{dayNames[idx]}</div>
              <div className={`text-[9px] px-1 py-1.5 rounded-md font-medium ${
                s === "Rest" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              }`}>
                {s.length > 6 ? s.slice(0, 6) + "…" : s}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
          Start Program
        </button>
      </motion.div>
    ))}
  </div>
);

export default WorkoutPrograms;
