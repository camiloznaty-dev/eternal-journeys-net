import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FacturaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factura?: any;
  onSuccess: () => void;
}

export function FacturaDialog({ open, onOpenChange, factura, onSuccess }: FacturaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [casos, setCasos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    numero_factura: "",
    caso_id: "",
    cotizacion_id: "",
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: "",
    metodo_pago: "",
    status: "pendiente",
    subtotal: "",
    impuestos: "",
    total: "",
    notas: ""
  });

  useEffect(() => {
    if (open) {
      fetchCotizaciones();
      fetchCasos();
      if (factura) {
        setFormData({
          numero_factura: factura.numero_factura || "",
          caso_id: factura.caso_id || "",
          cotizacion_id: factura.cotizacion_id || "",
          fecha_emision: factura.fecha_emision || "",
          fecha_vencimiento: factura.fecha_vencimiento || "",
          metodo_pago: factura.metodo_pago || "",
          status: factura.status || "pendiente",
          subtotal: factura.subtotal?.toString() || "",
          impuestos: factura.impuestos?.toString() || "",
          total: factura.total?.toString() || "",
          notas: factura.notas || ""
        });
      } else {
        generateNumeroFactura();
      }
    }
  }, [open, factura]);

  const generateNumeroFactura = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    setFormData(prev => ({ ...prev, numero_factura: `F-${timestamp}-${random}` }));
  };

  const fetchCotizaciones = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data } = await supabase
        .from("cotizaciones")
        .select("id, numero_cotizacion, total")
        .eq("funeraria_id", empleado.funeraria_id)
        .eq("status", "aceptada")
        .order("created_at", { ascending: false });

      setCotizaciones(data || []);
    } catch (error) {
      console.error("Error fetching cotizaciones:", error);
    }
  };

  const fetchCasos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data } = await supabase
        .from("casos_servicios")
        .select("id, difunto_nombre, difunto_apellido")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      setCasos(data || []);
    } catch (error) {
      console.error("Error fetching casos:", error);
    }
  };

  const handleCotizacionChange = async (cotizacionId: string) => {
    setFormData(prev => ({ ...prev, cotizacion_id: cotizacionId }));
    
    const cotizacion = cotizaciones.find(c => c.id === cotizacionId);
    if (cotizacion) {
      setFormData(prev => ({
        ...prev,
        subtotal: cotizacion.total.toString(),
        impuestos: (cotizacion.total * 0.19).toString(),
        total: (cotizacion.total * 1.19).toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) throw new Error("No empleado found");

      const facturaData = {
        ...formData,
        funeraria_id: empleado.funeraria_id,
        caso_id: formData.caso_id || null,
        cotizacion_id: formData.cotizacion_id || null,
        subtotal: parseFloat(formData.subtotal),
        impuestos: parseFloat(formData.impuestos),
        total: parseFloat(formData.total),
        items: []
      };

      if (factura) {
        const { error } = await supabase
          .from("facturas")
          .update(facturaData)
          .eq("id", factura.id);

        if (error) throw error;
        toast.success("Factura actualizada exitosamente");
      } else {
        const { error } = await supabase
          .from("facturas")
          .insert([facturaData]);

        if (error) throw error;
        toast.success("Factura creada exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la factura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{factura ? "Editar Factura" : "Nueva Factura"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="numero_factura">Número de Factura *</Label>
            <Input
              id="numero_factura"
              value={formData.numero_factura}
              onChange={(e) => setFormData({ ...formData, numero_factura: e.target.value })}
              required
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caso_id">Caso Relacionado</Label>
              <Select
                value={formData.caso_id}
                onValueChange={(value) => setFormData({ ...formData, caso_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar caso" />
                </SelectTrigger>
                <SelectContent>
                  {casos.map((caso) => (
                    <SelectItem key={caso.id} value={caso.id}>
                      {caso.difunto_nombre} {caso.difunto_apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cotizacion_id">Cotización</Label>
              <Select
                value={formData.cotizacion_id}
                onValueChange={handleCotizacionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cotización" />
                </SelectTrigger>
                <SelectContent>
                  {cotizaciones.map((cot) => (
                    <SelectItem key={cot.id} value={cot.id}>
                      {cot.numero_cotizacion} - ${cot.total.toLocaleString("es-CL")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_emision">Fecha Emisión *</Label>
              <Input
                id="fecha_emision"
                type="date"
                value={formData.fecha_emision}
                onChange={(e) => setFormData({ ...formData, fecha_emision: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha_vencimiento">Fecha Vencimiento</Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <Select
                value={formData.metodo_pago}
                onValueChange={(value) => setFormData({ ...formData, metodo_pago: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                  <SelectItem value="anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subtotal">Subtotal (CLP) *</Label>
              <Input
                id="subtotal"
                type="number"
                value={formData.subtotal}
                onChange={(e) => {
                  const subtotal = parseFloat(e.target.value) || 0;
                  const impuestos = subtotal * 0.19;
                  const total = subtotal + impuestos;
                  setFormData({
                    ...formData,
                    subtotal: e.target.value,
                    impuestos: impuestos.toString(),
                    total: total.toString()
                  });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="impuestos">IVA 19%</Label>
              <Input
                id="impuestos"
                type="number"
                value={formData.impuestos}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="total">Total (CLP)</Label>
              <Input
                id="total"
                type="number"
                value={formData.total}
                readOnly
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Notas adicionales"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {factura ? "Actualizar" : "Crear"} Factura
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
