import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function PlanCard() {
  const { data: planActual, isLoading } = useQuery({
    queryKey: ["funeraria-plan-actual"],
    queryFn: async () => {
      // Get current user's funeraria
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!empleado) return null;

      // Get active plan for funeraria
      const { data: funerariaPlan, error } = await supabase
        .from("funeraria_planes")
        .select(`
          *,
          planes (*)
        `)
        .eq("funeraria_id", empleado.funeraria_id)
        .eq("estado", "activo")
        .maybeSingle();

      if (error) throw error;
      return funerariaPlan;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!planActual || !planActual.planes) {
    return (
      <Card className="p-6 border-warning">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-warning">Sin Plan Activo</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No tienes un plan de suscripción activo. Contacta al administrador para activar un plan.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const plan = planActual.planes as any;

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      activo: { variant: "default", label: "Activo" },
      cancelado: { variant: "destructive", label: "Cancelado" },
      suspendido: { variant: "outline", label: "Suspendido" },
      expirado: { variant: "secondary", label: "Expirado" },
    };

    const status = variants[estado] || variants.activo;
    return <Badge variant={status.variant}>{status.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const getLimitText = (limit: number | null) => {
    if (limit === null || limit === -1) return "Ilimitado";
    return limit.toString();
  };

  return (
    <Card className={`p-6 ${plan.destacado ? 'border-primary border-2' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">{plan.nombre}</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{plan.descripcion}</p>
          </div>
          {getStatusBadge(planActual.estado)}
        </div>

        <div>
          <div className="text-2xl font-bold">
            {formatPrice(
              planActual.tipo_pago === "anual" && plan.precio_anual
                ? plan.precio_anual
                : plan.precio_mensual
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {planActual.tipo_pago === "anual" ? "por año" : "por mes"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Características:</div>
          <div className="space-y-1">
            {(plan.caracteristicas as string[]).slice(0, 3).map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Límite Empleados:</span>
            <span className="font-medium">{getLimitText(plan.limite_empleados)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Límite Casos:</span>
            <span className="font-medium">{getLimitText(plan.limite_casos)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Límite Leads:</span>
            <span className="font-medium">{getLimitText(plan.limite_leads)}</span>
          </div>
        </div>

        {planActual.fecha_fin && (
          <div className="pt-4 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Válido hasta: </span>
              <span className="font-medium">
                {format(new Date(planActual.fecha_fin), "dd 'de' MMMM, yyyy", { locale: es })}
              </span>
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full">
          Ver Detalles del Plan
        </Button>
      </div>
    </Card>
  );
}
