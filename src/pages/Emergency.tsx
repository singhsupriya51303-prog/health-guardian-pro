import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Shield, Bell, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/components/layout/AppLayout";

const Emergency = () => {
  const [contacts, setContacts] = useState([
    { name: "Emergency Services", phone: "911" },
  ]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [alertActive, setAlertActive] = useState(false);

  const addContact = () => {
    if (newName && newPhone) {
      setContacts(prev => [...prev, { name: newName, phone: newPhone }]);
      setNewName("");
      setNewPhone("");
    }
  };

  const triggerAlert = () => {
    setAlertActive(true);
    setTimeout(() => setAlertActive(false), 5000);
  };

  return (
    <AppLayout>
      <div className="container px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Emergency Detection</h1>
          <p className="text-muted-foreground text-sm mt-1">Fall detection, alerts, and emergency contacts</p>
        </motion.div>

        {/* Alert banner */}
        {alertActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border-2 border-destructive rounded-2xl p-6 flex items-center gap-4"
          >
            <AlertTriangle className="w-10 h-10 text-destructive animate-pulse" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-destructive">Emergency Alert Active</h3>
              <p className="text-sm text-destructive/80">Contacting emergency services and notifying your contacts...</p>
            </div>
            <Button variant="destructive" onClick={() => setAlertActive(false)}>Cancel</Button>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Detection status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 space-y-6"
          >
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Detection Status</h3>
            <div className="space-y-4">
              {[
                { label: "Fall Detection", status: "Active", icon: Shield, ok: true },
                { label: "Inactivity Monitor", status: "Active", icon: Bell, ok: true },
                { label: "Movement Analysis", status: "Active", icon: Volume2, ok: true },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <d.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{d.label}</span>
                  </div>
                  <span className="text-xs text-glow-success font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="destructive" className="w-full py-6 text-base" onClick={triggerAlert}>
              <AlertTriangle className="w-5 h-5 mr-2" />
              Trigger Emergency Alert
            </Button>

            <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">GPS Location</div>
                <div className="text-sm text-foreground">Sharing enabled • Updated 2s ago</div>
              </div>
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
                  <Phone className="w-4 h-4 text-primary" />
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-foreground text-xs">Add Contact</Label>
              <div className="flex gap-2">
                <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="bg-secondary border-border" />
                <Input placeholder="Phone" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="bg-secondary border-border" />
              </div>
              <Button variant="heroOutline" className="w-full" onClick={addContact} disabled={!newName || !newPhone}>
                Add Contact
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Emergency;
