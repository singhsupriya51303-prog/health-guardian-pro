import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CameraMonitor from "./pages/CameraMonitor.tsx";
import AIChat from "./pages/AIChat.tsx";
import Emergency from "./pages/Emergency.tsx";
import Lifestyle from "./pages/Lifestyle.tsx";
import Fitness from "./pages/Fitness.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/camera" element={<CameraMonitor />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
