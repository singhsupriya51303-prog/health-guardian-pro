import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Phone, MapPin, Shield, Bell, Volume2,
  Trash2, Bot, Send, X, MessageSquare, VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import AppLayout from "@/components/layout/AppLayout";


// ── Alarm sound using Web Audio API ──
const useAlarmSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAlarm = useCallback(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const playBeep = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      oscillatorsRef.current.push(osc);
    };

    playBeep();
    intervalRef.current = setInterval(playBeep, 600);
  }, []);

  const stopAlarm = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
    oscillatorsRef.current = [];
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
  }, []);

  return { startAlarm, stopAlarm };
};

// ── GPS Hook ──
const useGPS = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const watchRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setLastUpdated(new Date());
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => { if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current); };
  }, []);

  const timeSince = lastUpdated
    ? Math.round((Date.now() - lastUpdated.getTime()) / 1000)
    : null;

  return { location, error, timeSince };
};

// ── AI Chat Message ──
interface ChatMsg { role: "user" | "assistant"; content: string }

const Emergency = () => {
  const [contacts, setContacts] = useState([
    { name: "Emergency Services", phone: "911" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const { startAlarm, stopAlarm } = useAlarmSound();
  const { location, error: gpsError, timeSince } = useGPS();

  // AI Assistant
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const addContact = () => {
    if (newName && newPhone) {
      setContacts(prev => [...prev, { name: newName, phone: newPhone }]);
      setNewName("");
      setNewPhone("");
      toast.success("Contact added");
    }
  };

  const removeContact = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx));
    toast.info("Contact removed");
  };

  const triggerAlert = () => {
    setAlertActive(true);
    startAlarm();
    toast.error("Emergency alert triggered!", { description: "Alarm sounding & contacts notified" });
  };

  const cancelAlert = () => {
    setAlertActive(false);
    stopAlarm();
    toast.info("Emergency alert cancelled");
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: chatInput.trim() };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatInput("");
    setChatLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emergency-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: updated.map(m => ({ role: m.role, content: m.content })) }),
        }
      );

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.error("Rate limited. Please try again in a moment.");
          setChatMessages(prev => [...prev, { role: "assistant", content: "Too many requests. Please wait a moment." }]);
          setChatLoading(false);
          return;
        }
        if (resp.status === 402) {
          toast.error("AI credits exhausted.");
          setChatMessages(prev => [...prev, { role: "assistant", content: "AI credits exhausted. Please add funds." }]);
          setChatLoading(false);
          return;
        }
        throw new Error("Stream failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > updated.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      if (!assistantContent) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
      }
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Emergency Detection</h1>
          <p className="text-muted-foreground text-sm mt-1">Fall detection, alerts, and emergency contacts</p>
        </motion.div>

        {/* Alert banner */}
        <AnimatePresence>
          {alertActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-destructive/10 border-2 border-destructive rounded-2xl p-6 flex items-center gap-4"
            >
              <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-destructive">🚨 Emergency Alert Active</h3>
                <p className="text-sm text-destructive/80">
                  Alarm sounding • Contacting emergency services and notifying your contacts...
                  {location && (
                    <span className="block mt-1">📍 Location shared: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
                  )}
                </p>
              </div>
              <Button variant="destructive" onClick={cancelAlert}>
                <VolumeX className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Detection status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Detection Status</h3>
            <div className="space-y-4">
              {[
                { label: "Fall Detection", icon: Shield },
                { label: "Inactivity Monitor", icon: Bell },
                { label: "Movement Analysis", icon: Volume2 },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <d.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{d.label}</span>
                  </div>
                  <span className="text-xs text-glow-success font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
                    Active
                  </span>
                </div>
              ))}
            </div>

            <Button variant="destructive" className="w-full py-6 text-base" onClick={triggerAlert} disabled={alertActive}>
              <AlertTriangle className="w-5 h-5 mr-2" />
              {alertActive ? "Alert Active — Alarm Sounding" : "Trigger Emergency Alert"}
            </Button>

            {/* Real-time GPS */}
            <div className="bg-secondary rounded-xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">GPS Location</div>
                  {gpsError ? (
                    <div className="text-sm text-destructive">{gpsError}</div>
                  ) : location ? (
                    <div className="text-sm text-foreground">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      <span className="text-muted-foreground text-xs ml-2">
                        ±{Math.round(location.accuracy)}m • Updated {timeSince != null ? `${timeSince}s ago` : "..."}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground animate-pulse">Acquiring location...</div>
                  )}
                </div>
              </div>
              {location && (
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-primary hover:underline"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
          </motion.div>

          {/* Emergency contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Emergency Contacts</h3>
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="w-9 h-9 rounded-lg bg-glow-success/10 text-glow-success flex items-center justify-center hover:bg-glow-success/20 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    {i > 0 && (
                      <button
                        onClick={() => removeContact(i)}
                        className="w-9 h-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-foreground text-xs">Add Contact</Label>
              <div className="flex gap-2">
                <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="bg-secondary border-border" />
                <Input placeholder="Phone" type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="bg-secondary border-border" />
              </div>
              <Button variant="heroOutline" className="w-full" onClick={addContact} disabled={!newName || !newPhone}>
                Add Contact
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Assistant FAB + Chat */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:brightness-110 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        {chatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-secondary flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-foreground">Emergency AI Assistant</div>
                <div className="text-[10px] text-muted-foreground">First aid guidance & emergency help</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px]">
              {chatMessages.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <Bot className="w-10 h-10 text-primary mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground">Describe your emergency situation and I'll provide first aid guidance.</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {["Someone fell down", "Choking emergency", "Bleeding wound", "Chest pain"].map(q => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border flex gap-2">
              <Input
                placeholder="Describe the emergency..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                className="bg-secondary border-border text-sm"
              />
              <Button size="icon" onClick={sendChat} disabled={!chatInput.trim() || chatLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Emergency;
