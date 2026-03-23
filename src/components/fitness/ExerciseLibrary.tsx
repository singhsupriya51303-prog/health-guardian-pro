import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Play, Info, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const muscleGroups = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"];

const exercises = [
  { id: 1, name: "Barbell Bench Press", muscle: "Chest", equipment: "Barbell", difficulty: "Intermediate", sets: "4×8-12", image: "🏋️" },
  { id: 2, name: "Incline Dumbbell Press", muscle: "Chest", equipment: "Dumbbells", difficulty: "Intermediate", sets: "3×10-12", image: "🏋️" },
  { id: 3, name: "Cable Flyes", muscle: "Chest", equipment: "Cable", difficulty: "Beginner", sets: "3×12-15", image: "💪" },
  { id: 4, name: "Deadlift", muscle: "Back", equipment: "Barbell", difficulty: "Advanced", sets: "4×5-8", image: "🏋️" },
  { id: 5, name: "Pull-ups", muscle: "Back", equipment: "Bodyweight", difficulty: "Intermediate", sets: "4×8-12", image: "💪" },
  { id: 6, name: "Barbell Row", muscle: "Back", equipment: "Barbell", difficulty: "Intermediate", sets: "4×8-12", image: "🏋️" },
  { id: 7, name: "Overhead Press", muscle: "Shoulders", equipment: "Barbell", difficulty: "Intermediate", sets: "4×8-10", image: "🏋️" },
  { id: 8, name: "Lateral Raises", muscle: "Shoulders", equipment: "Dumbbells", difficulty: "Beginner", sets: "3×12-15", image: "💪" },
  { id: 9, name: "Barbell Curl", muscle: "Arms", equipment: "Barbell", difficulty: "Beginner", sets: "3×10-12", image: "💪" },
  { id: 10, name: "Tricep Dips", muscle: "Arms", equipment: "Bodyweight", difficulty: "Intermediate", sets: "3×10-15", image: "💪" },
  { id: 11, name: "Barbell Squat", muscle: "Legs", equipment: "Barbell", difficulty: "Advanced", sets: "4×6-10", image: "🏋️" },
  { id: 12, name: "Leg Press", muscle: "Legs", equipment: "Machine", difficulty: "Beginner", sets: "4×10-12", image: "🦵" },
  { id: 13, name: "Romanian Deadlift", muscle: "Legs", equipment: "Barbell", difficulty: "Intermediate", sets: "3×10-12", image: "🏋️" },
  { id: 14, name: "Hanging Leg Raise", muscle: "Core", equipment: "Bodyweight", difficulty: "Intermediate", sets: "3×12-15", image: "🧘" },
  { id: 15, name: "Plank", muscle: "Core", equipment: "Bodyweight", difficulty: "Beginner", sets: "3×60s", image: "🧘" },
  { id: 16, name: "HIIT Sprints", muscle: "Cardio", equipment: "Treadmill", difficulty: "Advanced", sets: "8×30s", image: "🏃" },
  { id: 17, name: "Jump Rope", muscle: "Cardio", equipment: "Jump Rope", difficulty: "Beginner", sets: "5×2min", image: "🏃" },
];

const difficultyColor: Record<string, string> = {
  Beginner: "bg-glow-success/20 text-glow-success border-glow-success/30",
  Intermediate: "bg-glow-warning/20 text-glow-warning border-glow-warning/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

interface Props {
  onSelectExercise?: (exercise: typeof exercises[0]) => void;
}

const ExerciseLibrary = ({ onSelectExercise }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = selectedMuscle === "All" || e.muscle === selectedMuscle;
    return matchSearch && matchMuscle;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Muscle group filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {muscleGroups.map(g => (
          <button
            key={g}
            onClick={() => setSelectedMuscle(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedMuscle === g
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.03 }}
              className="bg-secondary rounded-xl overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ex.image}</span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{ex.name}</div>
                    <div className="text-xs text-muted-foreground">{ex.muscle} • {ex.equipment}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${difficultyColor[ex.difficulty]}`}>
                    {ex.difficulty}
                  </Badge>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === ex.id ? "rotate-90" : ""}`} />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === ex.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Recommended: <span className="text-foreground font-medium">{ex.sets}</span></div>
                        <div className="text-xs text-muted-foreground">Equipment: <span className="text-foreground">{ex.equipment}</span></div>
                      </div>
                      <button
                        onClick={() => onSelectExercise?.(ex)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Play className="w-3 h-3" /> Add to Workout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
