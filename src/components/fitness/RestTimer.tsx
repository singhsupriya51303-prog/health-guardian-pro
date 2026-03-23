import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

const presets = [30, 60, 90, 120, 180];

const RestTimer = () => {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining]);

  const reset = (newDuration?: number) => {
    setRunning(false);
    const d = newDuration ?? duration;
    setDuration(d);
    setRemaining(d);
  };

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Circular timer */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={remaining === 0 ? "hsl(var(--glow-success))" : "hsl(var(--primary))"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground font-mono">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {remaining === 0 ? "Done!" : running ? "Resting" : "Ready"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="w-10" /> {/* spacer */}
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => reset(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              duration === p && !running
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {p >= 60 ? `${p / 60}m` : `${p}s`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RestTimer;
