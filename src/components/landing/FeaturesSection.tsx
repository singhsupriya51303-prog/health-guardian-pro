import { motion } from "framer-motion";
import { Brain, Heart, Zap, Camera, Shield, Activity } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Cell Regeneration Monitor",
    description: "Camera-based AI analysis tracks skin health, fatigue, and recovery metrics in real-time.",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Health Prediction Engine",
    description: "Predict diabetes, heart disease, and stress risks using advanced ML models.",
    color: "text-glow-danger",
  },
  {
    icon: Brain,
    title: "AI Lifestyle Coach",
    description: "Personalized diet plans, workout routines, and daily habit recommendations.",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Emergency Detection",
    description: "Real-time fall detection, abnormal movement alerts, and automatic emergency response.",
    color: "text-glow-warning",
  },
  {
    icon: Activity,
    title: "Multi-Agent System",
    description: "20+ specialized AI agents orchestrate health monitoring, analysis, and coaching.",
    color: "text-glow-success",
  },
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "End-to-end encrypted data with edge processing for maximum security.",
    color: "text-primary",
  },
];

const FeaturesSection = () => (
  <section className="py-24 md:py-32 bg-background relative">
    <div className="container px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Features</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-foreground">
          Intelligent Health <span className="text-gradient-primary">Ecosystem</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          A comprehensive AI platform that monitors, predicts, and protects your health.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-gradient-card rounded-2xl border border-border p-8 hover:border-primary/30 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:glow-primary transition-all duration-500">
              <f.icon className={`w-6 h-6 ${f.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
