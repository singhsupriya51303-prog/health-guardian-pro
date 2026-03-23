import { motion } from "framer-motion";

const stats = [
  { value: "99.7%", label: "Prediction Accuracy" },
  { value: "20+", label: "AI Agents" },
  { value: "<2s", label: "Response Time" },
  { value: "256-bit", label: "Encryption" },
];

const StatsSection = () => (
  <section className="py-20 border-y border-border bg-secondary/30">
    <div className="container px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{s.value}</div>
            <div className="text-muted-foreground text-sm">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
