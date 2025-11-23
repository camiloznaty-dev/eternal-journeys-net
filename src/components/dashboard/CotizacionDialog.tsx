import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItemSelector } from "./ItemSelector";
import type { Cotizacion, QuoteItem } from "@/types/cotizaciones";

interface CotizacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cotizacion?: Cotizacion | null;
  onSuccess: () => void;
}

function SortableItem({ item, onUpdate, onRemove }: { item: QuoteItem; onUpdate: (id: string, field: string, value: any) => void; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card rounded-lg border p-4">
      <div className="flex gap-4 items-start">
        <button {...attributes} {...listeners} className="mt-2 cursor-move text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{item.name}</h4>
                <Badge variant="secondary">{item.type === "producto" ? "Producto" : "Servicio"}</Badge>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Cantidad</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => onUpdate(item.id, "quantity", parseInt(e.target.value) || 1)}
                min="1"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Precio</Label>
              <Input
                type="number"
                value={item.price}
                onChange={(e) => onUpdate(item.id, "price", parseFloat(e.target.value) || 0)}
                min="0"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Descuento %</Label>
              <Input
                type="number"
                value={item.discount}
                onChange={(e) => onUpdate(item.id, "discount", parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subtotal</Label>
              <div className="h-9 flex items-center font-semibold">
                ${item.subtotal.toLocaleString("es-CL")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CotizacionDialog({ open, onOpenChange, cotizacion, onSuccess }: CotizacionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [numeroCotizacion, setNumeroCotizacion] = useState("");
  const [validaHasta, setValidaHasta] = useState("");
  const [notas, setNotas] = useState("");
  const [impuestos, setImpuestos] = useState("19");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [solicitanteNombre, setSolicitanteNombre] = useState("");
  const [solicitanteEmpresa, setSolicitanteEmpresa] = useState("");
  const [solicitanteTelefono, setSolicitanteTelefono] = useState("");
  const [solicitanteEmail, setSolicitanteEmail] = useState("");
  const [vendedorId, setVendedorId] = useState("");
  const [cartaPresentacion, setCartaPresentacion] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (open) {
      fetchEmpleados();
      if (cotizacion) {
        setNumeroCotizacion(cotizacion.numero_cotizacion || "");
        setValidaHasta(cotizacion.valida_hasta || "");
        setNotas(cotizacion.notas || "");
        setImpuestos(((cotizacion.impuestos / cotizacion.subtotal) * 100).toFixed(0));
        setItems(Array.isArray(cotizacion.items) ? cotizacion.items : []);
        setSolicitanteNombre(cotizacion.solicitante_nombre || "");
        setSolicitanteEmpresa(cotizacion.solicitante_empresa || "");
        setSolicitanteTelefono(cotizacion.solicitante_telefono || "");
        setSolicitanteEmail(cotizacion.solicitante_email || "");
        setVendedorId(cotizacion.vendedor_id || "");
        setCartaPresentacion(cotizacion.carta_presentacion || "");
      } else {
        resetForm();
        generateQuoteNumber();
      }
    }
  }, [cotizacion, open]);

  const fetchEmpleados = async () => {
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
        .from("empleados")
        .select("id, nombre, apellido")
        .eq("funeraria_id", empleado.funeraria_id)
        .eq("activo", true)
        .order("nombre");

      setEmpleados(data || []);
    } catch (error) {
      console.error("Error fetching empleados:", error);
    }
  };

  const resetForm = () => {
    setNumeroCotizacion("");
    setValidaHasta("");
    setNotas("");
    setImpuestos("19");
    setItems([]);
    setSolicitanteNombre("");
    setSolicitanteEmpresa("");
    setSolicitanteTelefono("");
    setSolicitanteEmail("");
    setVendedorId("");
    setCartaPresentacion("");
  };

  const generateQuoteNumber = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { count } = await supabase
        .from("cotizaciones")
        .select("*", { count: "exact", head: true })
        .eq("funeraria_id", empleado.funeraria_id);

      const nextNumber = (count || 0) + 1;
      const year = new Date().getFullYear();
      setNumeroCotizacion(`COT-${year}-${String(nextNumber).padStart(4, "0")}`);
    } catch (error) {
      console.error("Error generating quote number:", error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalcular subtotal
          const basePrice = updated.price * updated.quantity;
          const discountAmount = (basePrice * updated.discount) / 100;
          updated.subtotal = basePrice - discountAmount;
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const addItems = (selectedItems: any[]) => {
    const newItems: QuoteItem[] = selectedItems.map((item) => ({
      id: crypto.randomUUID(),
      type: item.type,
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      price: item.price,
      discount: 0,
      subtotal: item.price,
    }));
    setItems([...items, ...newItems]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = (subtotal * parseFloat(impuestos)) / 100;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numeroCotizacion || items.length === 0) {
      toast.error("Agregue al menos un item");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) throw new Error("No funeraria found");

      const cotizacionData = {
        numero_cotizacion: numeroCotizacion,
        items: items as any,
        subtotal,
        impuestos: taxAmount,
        total,
        valida_hasta: validaHasta || null,
        notas: notas || null,
        status: cotizacion?.status || "borrador",
        funeraria_id: empleado.funeraria_id,
        creada_por: session.user.id,
        solicitante_nombre: solicitanteNombre || null,
        solicitante_empresa: solicitanteEmpresa || null,
        solicitante_telefono: solicitanteTelefono || null,
        solicitante_email: solicitanteEmail || null,
        vendedor_id: vendedorId || null,
        carta_presentacion: cartaPresentacion || null,
      };

      if (cotizacion) {
        const { error } = await supabase
          .from("cotizaciones")
          .update(cotizacionData)
          .eq("id", cotizacion.id);

        if (error) throw error;
        toast.success("Cotización actualizada");
      } else {
        const { error } = await supabase
          .from("cotizaciones")
          .insert([cotizacionData]);

        if (error) throw error;
        toast.success("Cotización creada");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar cotización");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>{cotizacion ? "Editar Cotización" : "Nueva Cotización"}</DialogTitle>
            <DialogDescription>
              Arrastra y suelta productos/servicios para crear la cotización
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(95vh-8rem)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información del Solicitante */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información del Solicitante</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="solicitante_nombre">Nombre del Solicitante</Label>
                    <Input
                      id="solicitante_nombre"
                      value={solicitanteNombre}
                      onChange={(e) => setSolicitanteNombre(e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="solicitante_empresa">Empresa (opcional)</Label>
                    <Input
                      id="solicitante_empresa"
                      value={solicitanteEmpresa}
                      onChange={(e) => setSolicitanteEmpresa(e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="solicitante_telefono">Teléfono</Label>
                    <Input
                      id="solicitante_telefono"
                      value={solicitanteTelefono}
                      onChange={(e) => setSolicitanteTelefono(e.target.value)}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="solicitante_email">Email</Label>
                    <Input
                      id="solicitante_email"
                      type="email"
                      value={solicitanteEmail}
                      onChange={(e) => setSolicitanteEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Información de la Cotización */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Datos de la Cotización</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="numero"
                      value={numeroCotizacion}
                      onChange={(e) => setNumeroCotizacion(e.target.value)}
                      placeholder="COT-2024-0001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validaHasta">Válida hasta</Label>
                    <Input
                      id="validaHasta"
                      type="date"
                      value={validaHasta}
                      onChange={(e) => setValidaHasta(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendedor">Vendedor</Label>
                    <Select value={vendedorId} onValueChange={setVendedorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {empleados.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.nombre} {emp.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="carta_presentacion">Carta de Presentación</Label>
                  <Textarea
                    id="carta_presentacion"
                    value={cartaPresentacion}
                    onChange={(e) => setCartaPresentacion(e.target.value)}
                    placeholder="Estimado/a [Nombre], nos complace presentarle la siguiente cotización..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impuestos">IVA %</Label>
                  <Input
                    id="impuestos"
                    type="number"
                    value={impuestos}
                    onChange={(e) => setImpuestos(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items de la Cotización</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Items
                  </Button>
                </div>

                {items.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">
                        No hay items. Haz clic en "Agregar Items" para comenzar
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <SortableItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas / Términos y Condiciones</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Condiciones de pago, garantías, etc..."
                  rows={3}
                />
              </div>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${subtotal.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA ({impuestos}%):</span>
                      <span className="font-medium">${taxAmount.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toLocaleString("es-CL")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || items.length === 0}>
                  {loading ? "Guardando..." : cotizacion ? "Actualizar" : "Crear Cotización"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ItemSelector open={selectorOpen} onOpenChange={setSelectorOpen} onSelect={addItems} />
    </>
  );
}
