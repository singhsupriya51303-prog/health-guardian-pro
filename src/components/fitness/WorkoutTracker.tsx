import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SetLog {
  id: number;
  weight: string;
  reps: string;
  done: boolean;
}

export interface WorkoutExercise {
  id: number;
  name: string;
  sets: SetLog[];
  collapsed: boolean;
}

interface Props {
  initialExercises?: WorkoutExercise[];
}

const defaultExercises: WorkoutExercise[] = [
  {
    id: 1, name: "Barbell Bench Press", collapsed: false,
    sets: [
      { id: 1, weight: "60", reps: "12", done: true },
      { id: 2, weight: "80", reps: "10", done: true },
      { id: 3, weight: "90", reps: "8", done: false },
      { id: 4, weight: "90", reps: "8", done: false },
    ],
  },
  {
    id: 2, name: "Incline Dumbbell Press", collapsed: false,
    sets: [
      { id: 1, weight: "30", reps: "12", done: false },
      { id: 2, weight: "30", reps: "10", done: false },
      { id: 3, weight: "30", reps: "10", done: false },
    ],
  },
  {
    id: 3, name: "Cable Flyes", collapsed: true,
    sets: [
      { id: 1, weight: "15", reps: "15", done: false },
      { id: 2, weight: "15", reps: "15", done: false },
      { id: 3, weight: "15", reps: "12", done: false },
    ],
  },
];

const WorkoutTracker = ({ initialExercises }: Props) => {
  const [exercises, setExercises] = useState<WorkoutExercise[]>(defaultExercises);

  useEffect(() => {
    if (initialExercises && initialExercises.length > 0) {
      setExercises(initialExercises);
    }
  }, [initialExercises]);

  const toggleSet = (exIdx: number, setIdx: number) => {
    setExercises(prev => prev.map((ex, ei) =>
      ei === exIdx ? {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIdx ? { ...s, done: !s.done } : s),
      } : ex
    ));
  };

  const updateSet = (exIdx: number, setIdx: number, field: "weight" | "reps", value: string) => {
    setExercises(prev => prev.map((ex, ei) =>
      ei === exIdx ? {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s),
      } : ex
    ));
  };

  const addSet = (exIdx: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIdx) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      return {
        ...ex,
        sets: [...ex.sets, { id: ex.sets.length + 1, weight: lastSet?.weight || "0", reps: lastSet?.reps || "10", done: false }],
      };
    }));
  };

  const removeExercise = (exIdx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const toggleCollapse = (exIdx: number) => {
    setExercises(prev => prev.map((ex, i) => i === exIdx ? { ...ex, collapsed: !ex.collapsed } : ex));
  };

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets = exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
  const totalVolume = exercises.reduce((a, e) =>
    a + e.sets.filter(s => s.done).reduce((b, s) => b + (Number(s.weight) * Number(s.reps)), 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sets Done", value: `${doneSets}/${totalSets}` },
          { label: "Volume", value: `${totalVolume.toLocaleString()} kg` },
          { label: "Progress", value: `${totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0}%` },
        ].map(s => (
          <div key={s.label} className="bg-secondary rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {exercises.map((ex, exIdx) => (
            <motion.div
              key={ex.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-secondary rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <button onClick={() => toggleCollapse(exIdx)} className="flex items-center gap-2 flex-1">
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${ex.collapsed ? "-rotate-90" : ""}`} />
                  <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {ex.sets.filter(s => s.done).length}/{ex.sets.length}
                  </span>
                </button>
                <button onClick={() => removeExercise(exIdx)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence>
                {!ex.collapsed && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-4 pt-3 pb-1">
                      <span className="text-[10px] text-muted-foreground uppercase text-center">Set</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">Kg</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">Reps</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">✓</span>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div key={set.id} className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 px-4 py-1 items-center">
                        <span className="text-xs text-muted-foreground text-center font-medium">{setIdx + 1}</span>
                        <Input
                          value={set.weight}
                          onChange={e => updateSet(exIdx, setIdx, "weight", e.target.value)}
                          className="h-8 text-center text-sm bg-muted border-border"
                        />
                        <Input
                          value={set.reps}
                          onChange={e => updateSet(exIdx, setIdx, "reps", e.target.value)}
                          className="h-8 text-center text-sm bg-muted border-border"
                        />
                        <button
                          onClick={() => toggleSet(exIdx, setIdx)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            set.done ? "bg-glow-success/20 text-glow-success" : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div className="px-4 py-2">
                      <button
                        onClick={() => addSet(exIdx)}
                        className="w-full py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Set
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

export default WorkoutTracker;
