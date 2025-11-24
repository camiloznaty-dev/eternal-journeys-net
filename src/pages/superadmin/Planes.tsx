import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Plus, Edit2, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio_mensual: number;
  precio_anual: number | null;
  caracteristicas: string[];
  limite_empleados: number | null;
  limite_casos: number | null;
  limite_obituarios: number | null;
  limite_leads: number | null;
  activo: boolean;
  destacado: boolean;
  orden: number;
}

export default function SuperAdminPlanes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_mensual: "",
    precio_anual: "",
    caracteristicas: "",
    limite_empleados: "",
    limite_casos: "",
    limite_obituarios: "",
    limite_leads: "",
    activo: true,
    destacado: false,
    orden: "0",
  });

  const { data: planes, isLoading, refetch } = useQuery({
    queryKey: ["superadmin-planes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planes")
        .select("*")
        .order("orden", { ascending: true });

      if (error) throw error;
      return data as Plan[];
    },
  });

  const handleOpenDialog = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        nombre: plan.nombre,
        descripcion: plan.descripcion || "",
        precio_mensual: plan.precio_mensual.toString(),
        precio_anual: plan.precio_anual?.toString() || "",
        caracteristicas: plan.caracteristicas.join("\n"),
        limite_empleados: plan.limite_empleados?.toString() || "-1",
        limite_casos: plan.limite_casos?.toString() || "-1",
        limite_obituarios: plan.limite_obituarios?.toString() || "-1",
        limite_leads: plan.limite_leads?.toString() || "-1",
        activo: plan.activo,
        destacado: plan.destacado,
        orden: plan.orden.toString(),
      });
    } else {
      setEditingPlan(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio_mensual: "",
        precio_anual: "",
        caracteristicas: "",
        limite_empleados: "-1",
        limite_casos: "-1",
        limite_obituarios: "-1",
        limite_leads: "-1",
        activo: true,
        destacado: false,
        orden: "0",
      });
    }
    setDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      const caracteristicasArray = formData.caracteristicas
        .split("\n")
        .filter((c) => c.trim() !== "");

      const planData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        precio_mensual: parseFloat(formData.precio_mensual),
        precio_anual: formData.precio_anual ? parseFloat(formData.precio_anual) : null,
        caracteristicas: caracteristicasArray,
        limite_empleados: parseInt(formData.limite_empleados),
        limite_casos: parseInt(formData.limite_casos),
        limite_obituarios: parseInt(formData.limite_obituarios),
        limite_leads: parseInt(formData.limite_leads),
        activo: formData.activo,
        destacado: formData.destacado,
        orden: parseInt(formData.orden),
      };

      if (editingPlan) {
        const { error } = await supabase
          .from("planes")
          .update(planData)
          .eq("id", editingPlan.id);

        if (error) throw error;
        toast.success("Plan actualizado exitosamente");
      } else {
        const { error } = await supabase.from("planes").insert([planData]);

        if (error) throw error;
        toast.success("Plan creado exitosamente");
      }

      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este plan?")) return;

    try {
      const { error } = await supabase.from("planes").delete().eq("id", id);

      if (error) throw error;
      toast.success("Plan eliminado");
      refetch();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
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
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-2">
              <Crown className="h-8 w-8" />
              Gestión de Planes
            </h1>
            <p className="text-muted-foreground">
              Administra los planes de suscripción para funerarias
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Plan
          </Button>
        </div>

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-8">Cargando planes...</div>
          ) : (
            planes?.map((plan) => (
              <Card
                key={plan.id}
                className={`p-6 relative ${
                  plan.destacado ? "border-primary border-2 shadow-glow" : ""
                }`}
              >
                {plan.destacado && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Más Popular
                  </Badge>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.nombre}</h3>
                    <p className="text-muted-foreground text-sm">{plan.descripcion}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {formatPrice(plan.precio_mensual)}
                    </div>
                    <div className="text-sm text-muted-foreground">por mes</div>
                    {plan.precio_anual && (
                      <div className="text-sm text-primary mt-1">
                        {formatPrice(plan.precio_anual)}/año (ahorra{" "}
                        {Math.round(
                          ((plan.precio_mensual * 12 - plan.precio_anual) /
                            (plan.precio_mensual * 12)) *
                            100
                        )}
                        %)
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 py-4">
                    {plan.caracteristicas.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                    <div>Empleados: {getLimitText(plan.limite_empleados)}</div>
                    <div>Casos: {getLimitText(plan.limite_casos)}</div>
                    <div>Obituarios: {getLimitText(plan.limite_obituarios)}</div>
                    <div>Leads: {getLimitText(plan.limite_leads)}</div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(plan)}
                      className="flex-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {!plan.activo && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Inactivo
                    </Badge>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Table View */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Precio Mensual</TableHead>
                <TableHead>Precio Anual</TableHead>
                <TableHead>Empleados</TableHead>
                <TableHead>Casos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planes?.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {plan.nombre}
                        {plan.destacado && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.descripcion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(plan.precio_mensual)}</TableCell>
                  <TableCell>
                    {plan.precio_anual ? formatPrice(plan.precio_anual) : "-"}
                  </TableCell>
                  <TableCell>{getLimitText(plan.limite_empleados)}</TableCell>
                  <TableCell>{getLimitText(plan.limite_casos)}</TableCell>
                  <TableCell>
                    <Badge variant={plan.activo ? "default" : "secondary"}>
                      {plan.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.orden}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(plan)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}
            </DialogTitle>
            <DialogDescription>
              Configure los detalles del plan de suscripción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Plan *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Ej: Básico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orden">Orden</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.orden}
                  onChange={(e) =>
                    setFormData({ ...formData, orden: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción breve del plan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio_mensual">Precio Mensual (CLP) *</Label>
                <Input
                  id="precio_mensual"
                  type="number"
                  value={formData.precio_mensual}
                  onChange={(e) =>
                    setFormData({ ...formData, precio_mensual: e.target.value })
                  }
                  placeholder="29990"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio_anual">Precio Anual (CLP)</Label>
                <Input
                  id="precio_anual"
                  type="number"
                  value={formData.precio_anual}
                  onChange={(e) =>
                    setFormData({ ...formData, precio_anual: e.target.value })
                  }
                  placeholder="299990"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caracteristicas">
                Características (una por línea)
              </Label>
              <Textarea
                id="caracteristicas"
                value={formData.caracteristicas}
                onChange={(e) =>
                  setFormData({ ...formData, caracteristicas: e.target.value })
                }
                placeholder="Hasta 5 empleados&#10;Soporte por email&#10;Casos ilimitados"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limite_empleados">
                  Límite Empleados (-1 = ilimitado)
                </Label>
                <Input
                  id="limite_empleados"
                  type="number"
                  value={formData.limite_empleados}
                  onChange={(e) =>
                    setFormData({ ...formData, limite_empleados: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_casos">
                  Límite Casos (-1 = ilimitado)
                </Label>
                <Input
                  id="limite_casos"
                  type="number"
                  value={formData.limite_casos}
                  onChange={(e) =>
                    setFormData({ ...formData, limite_casos: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limite_obituarios">
                  Límite Obituarios (-1 = ilimitado)
                </Label>
                <Input
                  id="limite_obituarios"
                  type="number"
                  value={formData.limite_obituarios}
                  onChange={(e) =>
                    setFormData({ ...formData, limite_obituarios: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limite_leads">
                  Límite Leads (-1 = ilimitado)
                </Label>
                <Input
                  id="limite_leads"
                  type="number"
                  value={formData.limite_leads}
                  onChange={(e) =>
                    setFormData({ ...formData, limite_leads: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, activo: checked })
                  }
                />
                <Label htmlFor="activo">Plan Activo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="destacado"
                  checked={formData.destacado}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, destacado: checked })
                  }
                />
                <Label htmlFor="destacado">Plan Destacado</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePlan}>
              {editingPlan ? "Guardar Cambios" : "Crear Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
