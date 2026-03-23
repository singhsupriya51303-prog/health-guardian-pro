import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, Scan, Eye, Droplets, Moon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import RegenerationGauge from "@/components/dashboard/RegenerationGauge";

const analysisMetrics = [
  { icon: Eye, label: "Eye Fatigue", value: "Low", score: 82, color: "text-glow-success" },
  { icon: Droplets, label: "Skin Hydration", value: "Moderate", score: 64, color: "text-glow-warning" },
  { icon: Moon, label: "Sleep Indicators", value: "Good", score: 76, color: "text-primary" },
  { icon: Activity, label: "Stress Level", value: "Low", score: 85, color: "text-glow-success" },
];

const CameraMonitor = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  }, []);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 3000);
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <AppLayout>
      <div className="container px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Camera Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered skin, eye, and facial health analysis</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6"
          >
            <div className="aspect-video bg-secondary rounded-xl overflow-hidden relative mb-4">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!streaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="w-12 h-12 mb-2 opacity-30" />
                  <span className="text-sm">Camera is off</span>
                </div>
              )}
              {analyzing && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Scan className="w-10 h-10 text-primary animate-pulse" />
                    <span className="text-sm text-primary font-medium">Analyzing facial cues...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!streaming ? (
                <Button variant="hero" onClick={startCamera} className="flex-1">
                  <Camera className="w-4 h-4 mr-1" /> Start Camera
                </Button>
              ) : (
                <>
                  <Button variant="heroOutline" onClick={stopCamera} className="flex-1">
                    <CameraOff className="w-4 h-4 mr-1" /> Stop
                  </Button>
                  <Button variant="hero" onClick={runAnalysis} disabled={analyzing} className="flex-1">
                    <Scan className="w-4 h-4 mr-1" /> {analyzing ? "Analyzing..." : "Run Analysis"}
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gradient-card border border-border rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mb-4">Regeneration Score</h3>
              {analyzed ? (
                <RegenerationGauge score={74} />
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
                  Run camera analysis to generate score
                </div>
              )}
            </div>

            {analyzed && (
              <div className="grid grid-cols-2 gap-4">
                {analysisMetrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-gradient-card border border-border rounded-xl p-4"
                  >
                    <m.icon className={`w-5 h-5 mb-2 ${m.color}`} />
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                    <div className="text-lg font-bold text-foreground">{m.score}%</div>
                    <div className={`text-xs ${m.color}`}>{m.value}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CameraMonitor;
