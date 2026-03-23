import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <CTASection />
    <footer className="py-10 border-t border-border text-center text-muted-foreground text-sm">
      © 2026 LifeGuard AI Pro. All rights reserved.
    </footer>
  </div>
);

export default Index;
