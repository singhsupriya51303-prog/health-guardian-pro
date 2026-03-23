import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, BookOpen, Play, Timer, TrendingUp, Ruler, BarChart3 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ExerciseLibrary from "@/components/fitness/ExerciseLibrary";
import WorkoutTracker from "@/components/fitness/WorkoutTracker";
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

const Fitness = () => {
  const [activeTab, setActiveTab] = useState("tracker");

  return (
    <AppLayout>
      <div className="container px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Fitness Trainer</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-personalized gym & workout system</p>
        </motion.div>

        {/* Tab bar */}
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

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "tracker" && <WorkoutTracker />}
          {activeTab === "exercises" && <ExerciseLibrary />}
          {activeTab === "programs" && <WorkoutPrograms />}
          {activeTab === "progress" && <ProgressStats />}
          {activeTab === "body" && <BodyMeasurements />}
          {activeTab === "timer" && <RestTimer />}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Fitness;
