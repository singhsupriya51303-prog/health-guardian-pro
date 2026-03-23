import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Activity, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "15%" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-accent/5 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "15%", right: "10%" }}
        />
      </div>

      <div className="container relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="w-4 h-4" />
            AI-Powered Health Monitoring
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-foreground">Your Health,</span>
          <br />
          <span className="text-gradient-primary">Reimagined by AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          LifeGuard AI Pro combines predictive analytics, real-time monitoring,
          and cell regeneration tracking to keep you at your healthiest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" className="text-base px-8 py-6" onClick={() => navigate("/onboarding")}>
            Get Started Free
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
            Watch Demo
          </Button>
        </motion.div>

        {/* Floating feature icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-20 flex items-center justify-center gap-12 md:gap-20"
        >
          {[
            { icon: Activity, label: "Real-time Monitoring" },
            { icon: Brain, label: "AI Predictions" },
            { icon: Shield, label: "Emergency Detection" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2 text-muted-foreground"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 rounded-xl border border-glow bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
