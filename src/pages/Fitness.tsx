import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Dumbbell, BookOpen, Play, Timer, TrendingUp, Ruler } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import ExerciseLibrary from "@/components/fitness/ExerciseLibrary";
import WorkoutTracker, { type WorkoutExercise } from "@/components/fitness/WorkoutTracker";
import RestTimer from "@/components/fitness/RestTimer";
import WorkoutPrograms from "@/components/fitness/WorkoutPrograms";
import ProgressStats from "@/components/fitness/ProgressStats";
import BodyMeasurements from "@/components/fitness/BodyMeasurements";

const tabs = [
  { id: "tracker", label: "Workout", icon: Play },
  { id: "exercises", label: "Exercises", icon: BookOpen },
  { id: "programs", label: "Programs", icon: Dumbbell },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "body", label: "Body", icon: Ruler },
  { id: "timer", label: "Timer", icon: Timer },
];

let nextId = 100;

const parseSets = (setsStr: string): number => {
  const match = setsStr.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 3;
};

const parseReps = (setsStr: string): string => {
  const match = setsStr.match(/[×x](.+)$/i);
  return match ? match[1] : "10";
};

const Fitness = () => {
  const [activeTab, setActiveTab] = useState("tracker");
  const [trackerExercises, setTrackerExercises] = useState<WorkoutExercise[] | undefined>(undefined);

  const handleAddExercise = useCallback((exercise: { name: string; sets?: string }) => {
    const setsStr = exercise.sets || "3×10";
    const numSets = parseSets(setsStr);
    const reps = parseReps(setsStr);
    const newEx: WorkoutExercise = {
      id: nextId++,
      name: exercise.name,
      collapsed: false,
      sets: Array.from({ length: numSets }, (_, i) => ({
        id: i + 1,
        weight: "0",
        reps,
        done: false,
      })),
    };
    setTrackerExercises(prev => [...(prev || []), newEx]);
    setActiveTab("tracker");
    toast.success(`Added "${exercise.name}"`, { description: "Switched to Workout tab" });
  }, []);

  const handleStartProgram = useCallback((programName: string, exercises: { name: string; sets: string }[]) => {
    const mapped: WorkoutExercise[] = exercises.map(ex => {
      const numSets = parseSets(ex.sets);
      const reps = parseReps(ex.sets);
      return {
        id: nextId++,
        name: ex.name,
        collapsed: false,
        sets: Array.from({ length: numSets }, (_, i) => ({
          id: i + 1,
          weight: "0",
          reps,
          done: false,
        })),
      };
    });
    setTrackerExercises(mapped);
    setActiveTab("tracker");
  }, []);

  return (
    <AppLayout>
      <div className="container px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Fitness Trainer</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-personalized gym & workout system</p>
        </motion.div>

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "tracker" && <WorkoutTracker initialExercises={trackerExercises} />}
          {activeTab === "exercises" && <ExerciseLibrary onSelectExercise={(ex) => handleAddExercise({ name: ex.name, sets: ex.sets })} />}
          {activeTab === "programs" && <WorkoutPrograms onStartProgram={handleStartProgram} />}
          {activeTab === "progress" && <ProgressStats />}
          {activeTab === "body" && <BodyMeasurements />}
          {activeTab === "timer" && <RestTimer />}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Fitness;
