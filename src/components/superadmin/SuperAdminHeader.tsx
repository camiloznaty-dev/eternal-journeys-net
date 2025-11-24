import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SuperAdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Sesión cerrada exitosamente");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="h-9 w-9" />
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-display text-base sm:text-xl font-bold">SuperAdmin</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="sm:hidden h-9 w-9">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
