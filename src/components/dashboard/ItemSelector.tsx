import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ItemSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (items: any[]) => void;
}

export function ItemSelector({ open, onOpenChange, onSelect }: ItemSelectorProps) {
  const [productos, setProductos] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open]);

  const fetchItems = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const [productosRes, serviciosRes] = await Promise.all([
        supabase
          .from("productos")
          .select("*")
          .eq("funeraria_id", empleado.funeraria_id)
          .order("name"),
        supabase
          .from("servicios")
          .select("*")
          .eq("funeraria_id", empleado.funeraria_id)
          .order("name"),
      ]);

      if (productosRes.error) throw productosRes.error;
      if (serviciosRes.error) throw serviciosRes.error;

      setProductos(productosRes.data || []);
      setServicios(serviciosRes.data || []);
    } catch (error: any) {
      toast.error("Error al cargar items");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selected: any[] = [];
    
    productos.forEach((p) => {
      if (selectedItems.has(`producto-${p.id}`)) {
        selected.push({
          ...p,
          type: "producto",
        });
      }
    });

    servicios.forEach((s) => {
      if (selectedItems.has(`servicio-${s.id}`)) {
        selected.push({
          ...s,
          type: "servicio",
        });
      }
    });

    if (selected.length === 0) {
      toast.error("Selecciona al menos un item");
      return;
    }

    onSelect(selected);
    setSelectedItems(new Set());
    onOpenChange(false);
  };

  const filteredProductos = productos.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServicios = servicios.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Seleccionar Productos y Servicios</DialogTitle>
          <DialogDescription>
            Selecciona los items que deseas agregar a la cotización
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="productos">Productos ({productos.length})</TabsTrigger>
              <TabsTrigger value="servicios">Servicios ({servicios.length})</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] mt-4">
              <TabsContent value="productos" className="space-y-2">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : filteredProductos.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No se encontraron productos
                    </CardContent>
                  </Card>
                ) : (
                  filteredProductos.map((producto) => {
                    const itemId = `producto-${producto.id}`;
                    const isSelected = selectedItems.has(itemId);

                    return (
                      <Card
                        key={producto.id}
                        className={`cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => toggleItem(itemId)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{producto.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  Producto
                                </Badge>
                              </div>
                              {producto.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {producto.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg font-semibold">
                                  ${producto.price.toLocaleString("es-CL")}
                                </span>
                                {producto.stock !== null && (
                                  <span className="text-sm text-muted-foreground">
                                    Stock: {producto.stock}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="shrink-0 p-2 bg-primary text-primary-foreground rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="servicios" className="space-y-2">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : filteredServicios.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No se encontraron servicios
                    </CardContent>
                  </Card>
                ) : (
                  filteredServicios.map((servicio) => {
                    const itemId = `servicio-${servicio.id}`;
                    const isSelected = selectedItems.has(itemId);

                    return (
                      <Card
                        key={servicio.id}
                        className={`cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => toggleItem(itemId)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{servicio.name}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  Servicio
                                </Badge>
                              </div>
                              {servicio.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {servicio.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg font-semibold">
                                  ${servicio.price.toLocaleString("es-CL")}
                                </span>
                                {servicio.duration && (
                                  <span className="text-sm text-muted-foreground">
                                    {servicio.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="shrink-0 p-2 bg-primary text-primary-foreground rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedItems.size} item(s) seleccionado(s)
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedItems(new Set());
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={selectedItems.size === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar ({selectedItems.size})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
