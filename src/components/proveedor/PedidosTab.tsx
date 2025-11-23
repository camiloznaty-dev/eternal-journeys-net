import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ShoppingCart, Edit, Trash2 } from "lucide-react";
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
import { ItemSelector } from "@/components/dashboard/ItemSelector";

interface PedidosTabProps {
  proveedorId: string;
}

export function PedidosTab({ proveedorId }: PedidosTabProps) {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPedido, setEditingPedido] = useState<any>(null);

  const [numeroPedido, setNumeroPedido] = useState("");
  const [fechaPedido, setFechaPedido] = useState("");
  const [fechaEntregaEstimada, setFechaEntregaEstimada] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [items, setItems] = useState<any[]>([]);
  const [notas, setNotas] = useState("");
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, [proveedorId]);

  useEffect(() => {
    if (editingPedido) {
      setNumeroPedido(editingPedido.numero_pedido);
      setFechaPedido(editingPedido.fecha_pedido);
      setFechaEntregaEstimada(editingPedido.fecha_entrega_estimada || "");
      setStatus(editingPedido.status);
      setItems(editingPedido.items || []);
      setNotas(editingPedido.notas || "");
    } else {
      resetForm();
    }
  }, [editingPedido]);

  const fetchPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from("proveedor_pedidos")
        .select("*")
        .eq("proveedor_id", proveedorId)
        .order("fecha_pedido", { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const impuestos = subtotal * 0.19; // IVA 19%
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
  };

  const handleSave = async () => {
    if (!numeroPedido || !fechaPedido || items.length === 0) {
      toast.error("Completa los campos requeridos y agrega al menos un item");
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { subtotal, impuestos, total } = calculateTotals();

      const pedidoData = {
        proveedor_id: proveedorId,
        numero_pedido: numeroPedido,
        fecha_pedido: fechaPedido,
        fecha_entrega_estimada: fechaEntregaEstimada || null,
        status,
        items,
        subtotal,
        impuestos,
        total,
        notas: notas || null,
        creado_por: session.user.id,
      };

      if (editingPedido) {
        const { error } = await supabase
          .from("proveedor_pedidos")
          .update(pedidoData)
          .eq("id", editingPedido.id);

        if (error) throw error;
        toast.success("Pedido actualizado");
      } else {
        const { error } = await supabase
          .from("proveedor_pedidos")
          .insert([pedidoData]);

        if (error) throw error;
        toast.success("Pedido creado");
      }

      setDialogOpen(false);
      setEditingPedido(null);
      fetchPedidos();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar pedido");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pedido?")) return;

    try {
      const { error } = await supabase
        .from("proveedor_pedidos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Pedido eliminado");
      fetchPedidos();
    } catch (error: any) {
      toast.error("Error al eliminar pedido");
    }
  };

  const resetForm = () => {
    setNumeroPedido(`PED-${Date.now().toString().slice(-6)}`);
    setFechaPedido(new Date().toISOString().split('T')[0]);
    setFechaEntregaEstimada("");
    setStatus("pendiente");
    setItems([]);
    setNotas("");
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pendiente: { label: "Pendiente", variant: "secondary" },
      enviado: { label: "Enviado", variant: "default" },
      recibido: { label: "Recibido", variant: "outline" },
      cancelado: { label: "Cancelado", variant: "destructive" },
    };
    return badges[status] || badges.pendiente;
  };

  const { subtotal, impuestos, total } = calculateTotals();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Pedidos</h3>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay pedidos registrados</p>
            <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Pedido
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{pedido.numero_pedido}</p>
                    <Badge {...getStatusBadge(pedido.status)}>
                      {getStatusBadge(pedido.status).label}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Fecha: {format(new Date(pedido.fecha_pedido), "dd/MM/yyyy")}</p>
                    {pedido.fecha_entrega_estimada && (
                      <p>Entrega estimada: {format(new Date(pedido.fecha_entrega_estimada), "dd/MM/yyyy")}</p>
                    )}
                    <p className="font-semibold text-foreground">
                      Total: ${pedido.total.toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPedido(pedido);
                      setDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(pedido.id)}
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
          if (!open) setEditingPedido(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPedido ? "Editar Pedido" : "Nuevo Pedido"}</DialogTitle>
              <DialogDescription>
                Registra una orden de compra al proveedor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número de Pedido *</Label>
                  <Input
                    value={numeroPedido}
                    onChange={(e) => setNumeroPedido(e.target.value)}
                    placeholder="PED-001"
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
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="recibido">Recibido</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Pedido *</Label>
                  <Input
                    type="date"
                    value={fechaPedido}
                    onChange={(e) => setFechaPedido(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha Entrega Estimada</Label>
                  <Input
                    type="date"
                    value={fechaEntregaEstimada}
                    onChange={(e) => setFechaEntregaEstimada(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Items del Pedido *</Label>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setItemSelectorOpen(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Items
                  </Button>
                  
                  {items.length > 0 && (
                    <div className="border rounded-lg divide-y">
                      {items.map((item, index) => (
                        <div key={index} className="p-3 flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <Label className="text-xs">Cantidad</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.cantidad || 1}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].cantidad = parseInt(e.target.value) || 1;
                                    setItems(newItems);
                                  }}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Precio Unit.</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={item.precio || item.price || 0}
                                  onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[index].precio = parseFloat(e.target.value) || 0;
                                    setItems(newItems);
                                  }}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItems(items.filter((_, i) => i !== index));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ItemSelector
                open={itemSelectorOpen}
                onOpenChange={setItemSelectorOpen}
                onSelect={(selectedItems) => {
                  const newItems = selectedItems.map(item => ({
                    ...item,
                    cantidad: 1,
                    precio: item.price || 0,
                  }));
                  setItems([...items, ...newItems]);
                }}
              />

              {items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString("es-CL")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (19%):</span>
                    <span>${impuestos.toLocaleString("es-CL")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toLocaleString("es-CL")}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Observaciones del pedido..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingPedido(null);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Guardando..." : editingPedido ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
