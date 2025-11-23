import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, DollarSign, Edit, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PagosTabProps {
  proveedorId: string;
}

export function PagosTab({ proveedorId }: PagosTabProps) {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPago, setEditingPago] = useState<any>(null);

  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [numeroReferencia, setNumeroReferencia] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    fetchPagos();
  }, [proveedorId]);

  useEffect(() => {
    if (editingPago) {
      setMonto(editingPago.monto.toString());
      setFechaPago(editingPago.fecha_pago);
      setFechaVencimiento(editingPago.fecha_vencimiento || "");
      setMetodoPago(editingPago.metodo_pago || "transferencia");
      setNumeroReferencia(editingPago.numero_referencia || "");
      setStatus(editingPago.status);
      setNotas(editingPago.notas || "");
    } else {
      resetForm();
    }
  }, [editingPago]);

  const fetchPagos = async () => {
    try {
      const { data, error } = await supabase
        .from("proveedor_pagos")
        .select("*")
        .eq("proveedor_id", proveedorId)
        .order("fecha_pago", { ascending: false });

      if (error) throw error;
      setPagos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!monto || !fechaPago) {
      toast.error("Monto y fecha son requeridos");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const pagoData = {
        proveedor_id: proveedorId,
        monto: parseFloat(monto),
        fecha_pago: fechaPago,
        fecha_vencimiento: fechaVencimiento || null,
        metodo_pago: metodoPago,
        numero_referencia: numeroReferencia || null,
        status,
        notas: notas || null,
        registrado_por: session.user.id,
      };

      if (editingPago) {
        const { error } = await supabase
          .from("proveedor_pagos")
          .update(pagoData)
          .eq("id", editingPago.id);

        if (error) throw error;
        toast.success("Pago actualizado");
      } else {
        const { error } = await supabase
          .from("proveedor_pagos")
          .insert([pagoData]);

        if (error) throw error;
        toast.success("Pago registrado");
      }

      setDialogOpen(false);
      setEditingPago(null);
      fetchPagos();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar pago");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pago?")) return;

    try {
      const { error } = await supabase
        .from("proveedor_pagos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Pago eliminado");
      fetchPagos();
    } catch (error: any) {
      toast.error("Error al eliminar pago");
    }
  };

  const resetForm = () => {
    setMonto("");
    setFechaPago(new Date().toISOString().split('T')[0]);
    setFechaVencimiento("");
    setMetodoPago("transferencia");
    setNumeroReferencia("");
    setStatus("pendiente");
    setNotas("");
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pendiente: { label: "Pendiente", variant: "secondary" },
      pagado: { label: "Pagado", variant: "default" },
      vencido: { label: "Vencido", variant: "destructive" },
      parcial: { label: "Parcial", variant: "outline" },
    };
    return badges[status] || badges.pendiente;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Pagos y Cuentas</h3>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Pago
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : pagos.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay pagos registrados</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Primer Pago
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-lg">${pago.monto.toLocaleString("es-CL")}</p>
                    <Badge {...getStatusBadge(pago.status)}>
                      {getStatusBadge(pago.status).label}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Fecha: {format(new Date(pago.fecha_pago), "dd/MM/yyyy")}</p>
                    {pago.fecha_vencimiento && (
                      <p>Vencimiento: {format(new Date(pago.fecha_vencimiento), "dd/MM/yyyy")}</p>
                    )}
                    {pago.metodo_pago && (
                      <p>Método: {pago.metodo_pago}</p>
                    )}
                    {pago.numero_referencia && (
                      <p>Ref: {pago.numero_referencia}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPago(pago);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(pago.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingPago(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPago ? "Editar Pago" : "Registrar Pago"}</DialogTitle>
              <DialogDescription>
                Registra un pago o cuenta por pagar al proveedor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Monto *</Label>
                  <Input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="100000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Pago *</Label>
                  <Input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha Vencimiento</Label>
                  <Input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Método de Pago</Label>
                  <Select value={metodoPago} onValueChange={setMetodoPago}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número de Referencia</Label>
                  <Input
                    value={numeroReferencia}
                    onChange={(e) => setNumeroReferencia(e.target.value)}
                    placeholder="TRF-12345"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Observaciones del pago..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingPago(null);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Guardando..." : editingPago ? "Actualizar" : "Registrar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
