import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -bottom-48 left-1/2 -translate-x-1/2" />
      </div>
      <div className="container relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to Transform
            <br />
            <span className="text-gradient-primary">Your Health?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
            Join thousands using AI to predict, prevent, and protect their health every day.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="text-base px-10 py-6 gap-2"
            onClick={() => navigate("/onboarding")}
          >
            Start Your Health Journey
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
