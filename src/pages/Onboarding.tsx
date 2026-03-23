import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
};

const steps = ["Personal Info", "Body Metrics"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", age: "", gender: "", weight: "", height: "",
  });

  const update = (key: keyof FormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const canNext = step === 0
    ? form.name && form.email && form.age
    : form.gender && form.weight && form.height;

  const handleSubmit = () => {
    localStorage.setItem("lifeguard_profile", JSON.stringify(form));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground mb-8 justify-center">
          <Shield className="w-6 h-6 text-primary" />
          LifeGuard AI Pro
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-secondary"}`} />
              <span className={`text-xs mt-1 block ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-card border border-border rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="text-2xl font-bold text-foreground">Let's get to know you</h2>
                <div className="space-y-2">
                  <Label className="text-foreground">Full Name</Label>
                  <Input placeholder="John Doe" value={form.name} onChange={e => update("name", e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input type="email" placeholder="john@example.com" value={form.email} onChange={e => update("email", e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Age</Label>
                  <Input type="number" placeholder="28" value={form.age} onChange={e => update("age", e.target.value)} className="bg-secondary border-border" />
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <h2 className="text-2xl font-bold text-foreground">Body Metrics</h2>
                <div className="space-y-2">
                  <Label className="text-foreground">Gender</Label>
                  <div className="flex gap-3">
                    {["Male", "Female", "Other"].map(g => (
                      <button
                        key={g}
                        onClick={() => update("gender", g)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                          form.gender === g
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Weight (kg)</Label>
                  <Input type="number" placeholder="70" value={form.weight} onChange={e => update("weight", e.target.value)} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Height (cm)</Label>
                  <Input type="number" placeholder="175" value={form.height} onChange={e => update("height", e.target.value)} className="bg-secondary border-border" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <Button variant="hero" disabled={!canNext} onClick={() => setStep(s => s + 1)}>
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" disabled={!canNext} onClick={handleSubmit}>
                Launch Dashboard <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
