import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
          <Shield className="w-6 h-6 text-primary" />
          LifeGuard AI Pro
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </div>
        <Button variant="hero" size="sm" onClick={() => navigate("/onboarding")}>
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
