import { NavLink, useNavigate } from "react-router-dom";
import { Shield, LayoutDashboard, Camera, MessageCircle, AlertTriangle, Salad, Dumbbell, Brain, ChevronLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/camera", icon: Camera, label: "Camera Monitor" },
  { to: "/chat", icon: MessageCircle, label: "AI Doctor" },
  { to: "/emergency", icon: AlertTriangle, label: "Emergency" },
  { to: "/lifestyle", icon: Salad, label: "Lifestyle Coach" },
  { to: "/fitness", icon: Dumbbell, label: "Fitness" },
];

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl">
        <div
          className="flex items-center gap-2 px-6 h-14 border-b border-border cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground">LifeGuard AI Pro</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div className="px-3 py-4 border-t border-border space-y-2">
          {user && (
            <div className="px-3 py-1 text-xs text-muted-foreground truncate">
              {user.email}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-2 font-display font-bold text-foreground">
              <Shield className="w-5 h-5 text-primary" />
              LifeGuard AI
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/")} className="text-muted-foreground">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  }`
                }
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
