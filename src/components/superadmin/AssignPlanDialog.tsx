import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AssignPlanDialogProps {
  funerariaId: string;
  funerariaName: string;
  currentPlan?: any;
  onSuccess: () => void;
}

export function AssignPlanDialog({ funerariaId, funerariaName, currentPlan, onSuccess }: AssignPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [tipoPago, setTipoPago] = useState<"mensual" | "anual">("mensual");
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date | undefined>();

  useEffect(() => {
    if (open) {
      fetchPlanes();
      if (currentPlan) {
        setSelectedPlanId(currentPlan.plan_id);
        setTipoPago(currentPlan.tipo_pago || "mensual");
        setFechaInicio(new Date(currentPlan.fecha_inicio));
        if (currentPlan.fecha_fin) {
          setFechaFin(new Date(currentPlan.fecha_fin));
        }
      }
    }
  }, [open, currentPlan]);

  const fetchPlanes = async () => {
    try {
      const { data, error } = await supabase
        .from("planes")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true });

      if (error) throw error;
      setPlanes(data || []);
    } catch (error) {
      console.error("Error fetching planes:", error);
      toast.error("Error al cargar los planes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId) {
      toast.error("Por favor selecciona un plan");
      return;
    }

    setLoading(true);
    try {
      // Si existe un plan actual, actualizarlo
      if (currentPlan) {
        const { error } = await supabase
          .from("funeraria_planes")
          .update({
            plan_id: selectedPlanId,
            tipo_pago: tipoPago,
            fecha_inicio: fechaInicio.toISOString().split('T')[0],
            fecha_fin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
            updated_at: new Date().toISOString()
          })
          .eq("id", currentPlan.id);

        if (error) throw error;
        toast.success("Plan actualizado exitosamente");
      } else {
        // Crear nuevo plan
        const { error } = await supabase
          .from("funeraria_planes")
          .insert({
            funeraria_id: funerariaId,
            plan_id: selectedPlanId,
            tipo_pago: tipoPago,
            fecha_inicio: fechaInicio.toISOString().split('T')[0],
            fecha_fin: fechaFin ? fechaFin.toISOString().split('T')[0] : null,
            estado: "activo"
          });

        if (error) throw error;
        toast.success("Plan asignado exitosamente");
      }

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error assigning plan:", error);
      toast.error("Error al asignar el plan");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = planes.find(p => p.id === selectedPlanId);
  const calculatedPrice = selectedPlan 
    ? (tipoPago === "anual" && selectedPlan.precio_anual 
        ? selectedPlan.precio_anual 
        : selectedPlan.precio_mensual)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={currentPlan ? "outline" : "default"} size="sm">
          <CreditCard className="h-4 w-4 mr-2" />
          {currentPlan ? "Cambiar Plan" : "Asignar Plan"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentPlan ? "Cambiar Plan" : "Asignar Plan"} - {funerariaName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plan">Plan *</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un plan" />
              </SelectTrigger>
              <SelectContent>
                {planes.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{plan.nombre}</span>
                      <span className="text-muted-foreground ml-4">
                        ${plan.precio_mensual.toLocaleString()}/mes
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoPago">Tipo de Pago *</Label>
            <Select value={tipoPago} onValueChange={(value: "mensual" | "anual") => setTipoPago(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Mensual</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            {selectedPlan && (
              <p className="text-sm text-muted-foreground">
                Precio: ${calculatedPrice.toLocaleString()} CLP / {tipoPago}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={(date) => date && setFechaInicio(date)}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Vencimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin ? format(fechaFin, "PPP", { locale: es }) : "Sin vencimiento"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={setFechaFin}
                    locale={es}
                    disabled={(date) => date < fechaInicio}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : currentPlan ? "Actualizar Plan" : "Asignar Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
