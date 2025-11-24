import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isFuneraria, setIsFuneraria] = useState(false);
  const isDemoMode = searchParams.get("demo") === "true";

  useEffect(() => {
    if (isDemoMode) {
      setIsFuneraria(true);
      setLoading(false);
    } else {
      checkAuth();
    }
  }, [isDemoMode]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?tab=login");
        return;
      }

      // Check if user is funeraria type
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roles?.role !== "funeraria") {
        navigate("/");
        return;
      }

      setIsFuneraria(true);
    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/auth?tab=login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isFuneraria) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            {isDemoMode && (
              <Alert className="mb-4 sm:mb-6 border-primary/50 bg-primary/5">
                <Eye className="h-4 w-4" />
                <AlertDescription className="text-xs sm:text-sm">
                  Estás viendo el panel en modo demostración. Los datos mostrados son de ejemplo.{" "}
                  <button 
                    onClick={() => navigate("/auth?tab=register")}
                    className="font-semibold underline hover:text-primary"
                  >
                    Crear cuenta
                  </button>
                  {" "}para acceder a tu panel real.
                </AlertDescription>
              </Alert>
            )}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
