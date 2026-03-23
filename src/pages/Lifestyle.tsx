import { motion } from "framer-motion";
import { Salad, Droplets, Apple, Clock, Sun, Moon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const mealPlan = [
  { time: "7:00 AM", icon: Sun, meal: "Breakfast", items: "Oatmeal with berries, green tea, 1 boiled egg", cal: "380 kcal" },
  { time: "10:00 AM", icon: Apple, meal: "Snack", items: "Mixed nuts, banana", cal: "220 kcal" },
  { time: "1:00 PM", icon: Clock, meal: "Lunch", items: "Grilled chicken salad, quinoa, avocado", cal: "550 kcal" },
  { time: "4:00 PM", icon: Droplets, meal: "Snack", items: "Greek yogurt, honey, almonds", cal: "180 kcal" },
  { time: "7:30 PM", icon: Moon, meal: "Dinner", items: "Salmon, steamed vegetables, brown rice", cal: "480 kcal" },
];

const habits = [
  { label: "Drink 8 glasses of water", done: true },
  { label: "30 min morning walk", done: true },
  { label: "Meditation (10 min)", done: false },
  { label: "No screen 1h before bed", done: false },
  { label: "Take vitamin supplements", done: true },
];

const Lifestyle = () => (
  <AppLayout>
    <div className="container px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Lifestyle Coach</h1>
        <p className="text-muted-foreground text-sm mt-1">Personalized diet, habits, and wellness plan</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meal plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Salad className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Today's Meal Plan</h3>
          </div>
          <div className="space-y-4">
            {mealPlan.map((m, i) => (
              <motion.div
                key={m.meal}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-4 bg-secondary rounded-xl px-4 py-3"
              >
                <m.icon className="w-4 h-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{m.meal}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.items}</p>
                  <span className="text-xs text-primary mt-1 inline-block">{m.cal}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total: <span className="text-foreground font-semibold">1,810 kcal</span>
          </div>
        </motion.div>

        {/* Daily habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-card border border-border rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-6">Daily Habits</h3>
          <div className="space-y-3">
            {habits.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  h.done ? "border-glow-success bg-glow-success/20" : "border-muted-foreground"
                }`}>
                  {h.done && <span className="text-glow-success text-xs">✓</span>}
                </div>
                <span className={`text-sm ${h.done ? "text-foreground" : "text-muted-foreground"}`}>{h.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-primary mb-1">AI Tip</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your regeneration score, increasing evening meditation to 15 minutes could improve your recovery by ~12%.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </AppLayout>
);

export default Lifestyle;
