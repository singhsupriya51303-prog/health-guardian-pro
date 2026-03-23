import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Scale, TrendingDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const bodyWeightHistory = [
  { date: "Jan", weight: 82 },
  { date: "Feb", weight: 81 },
  { date: "Mar", weight: 80.5 },
  { date: "Apr", weight: 79 },
  { date: "May", weight: 78.5 },
  { date: "Jun", weight: 78 },
];

const measurements = [
  { part: "Chest", current: "102 cm", previous: "104 cm", trend: "down" },
  { part: "Waist", current: "84 cm", previous: "88 cm", trend: "down" },
  { part: "Hips", current: "98 cm", previous: "99 cm", trend: "down" },
  { part: "Biceps (L)", current: "36 cm", previous: "35 cm", trend: "up" },
  { part: "Biceps (R)", current: "36.5 cm", previous: "35.5 cm", trend: "up" },
  { part: "Thigh (L)", current: "58 cm", previous: "57 cm", trend: "up" },
  { part: "Thigh (R)", current: "58.5 cm", previous: "57 cm", trend: "up" },
  { part: "Calves", current: "38 cm", previous: "37.5 cm", trend: "up" },
];

const BodyMeasurements = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Scale, label: "Weight", value: "78 kg", sub: "-4 kg" },
          { icon: Ruler, label: "Body Fat", value: "17%", sub: "-5%" },
          { icon: TrendingDown, label: "BMI", value: "24.2", sub: "Normal" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-secondary rounded-xl p-3 text-center"
          >
            <s.icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-glow-success">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Weight chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-secondary rounded-xl p-5"
      >
        <h4 className="text-sm font-semibold text-foreground mb-4">Weight History</h4>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={bodyWeightHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215,12%,52%)" }} />
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10, fill: "hsl(215,12%,52%)" }} />
            <Tooltip contentStyle={{ background: "hsl(220,18%,10%)", border: "1px solid hsl(220,14%,18%)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="weight" stroke="hsl(174,72%,52%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(174,72%,52%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Measurements table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-secondary rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground">Body Measurements</h4>
          <Button size="sm" variant="ghost" className="text-xs text-primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3 h-3 mr-1" /> Update
          </Button>
        </div>

        <div className="space-y-2">
          {measurements.map((m, i) => (
            <motion.div
              key={m.part}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              className="flex items-center justify-between bg-muted rounded-lg px-4 py-2"
            >
              <span className="text-sm text-foreground">{m.part}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground line-through">{m.previous}</span>
                <span className="text-sm font-medium text-foreground">{m.current}</span>
                <span className={`text-xs ${m.trend === "down" ? "text-glow-success" : "text-primary"}`}>
                  {m.trend === "down" ? "↓" : "↑"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BodyMeasurements;
