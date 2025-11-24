import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package, AlertCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductDialog } from "@/components/dashboard/ProductDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costo: number | null;
  stock: number | null;
  stock_minimo: number | null;
  category: string;
  images: string[];
  sku: string | null;
  funeraria_id: string;
}

const categoryLabels: Record<string, string> = {
  ataud: "Ataúd",
  cremacion: "Cremación",
  traslado: "Traslado",
  flores: "Flores",
  servicio_completo: "Servicio Completo",
  urna: "Urna",
  lapida: "Lápida",
  otro: "Otro",
};

const categoryColors: Record<string, string> = {
  ataud: "bg-amber-500/10 text-amber-700 border-amber-200",
  cremacion: "bg-orange-500/10 text-orange-700 border-orange-200",
  traslado: "bg-blue-500/10 text-blue-700 border-blue-200",
  flores: "bg-pink-500/10 text-pink-700 border-pink-200",
  servicio_completo: "bg-purple-500/10 text-purple-700 border-purple-200",
  urna: "bg-slate-500/10 text-slate-700 border-slate-200",
  lapida: "bg-gray-500/10 text-gray-700 border-gray-200",
  otro: "bg-green-500/10 text-green-700 border-green-200",
};

export default function Productos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado) return;

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("funeraria_id", empleado.funeraria_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productToDelete);

      if (error) throw error;

      toast.success("Producto eliminado");
      fetchProducts();
    } catch (error: any) {
      toast.error("Error al eliminar producto");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "low" && product.stock !== null && product.stock_minimo !== null) {
      matchesStock = product.stock <= product.stock_minimo;
    } else if (stockFilter === "out") {
      matchesStock = product.stock === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const lowStockCount = products.filter(p => 
    p.stock !== null && p.stock_minimo !== null && p.stock <= p.stock_minimo
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Productos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gestiona tu inventario de productos</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        {lowStockCount > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <p className="font-medium text-xs sm:text-sm">
                  {lowStockCount} producto{lowStockCount !== 1 ? 's' : ''} con stock bajo
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 sm:h-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Stock bajo</SelectItem>
              <SelectItem value="out">Sin stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No hay productos</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                  ? "No se encontraron productos con los filtros aplicados"
                  : "Comienza agregando tu primer producto"}
              </p>
              {!searchTerm && categoryFilter === "all" && stockFilter === "all" && (
                <Button onClick={() => setDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const stockLow = product.stock !== null && product.stock_minimo !== null && product.stock <= product.stock_minimo;
              const stockOut = product.stock === 0;

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  {product.images && product.images.length > 0 ? (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-1 text-base sm:text-lg">{product.name}</CardTitle>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                        )}
                      </div>
                      <Badge className={`${categoryColors[product.category] || categoryColors.otro} text-xs flex-shrink-0`} variant="outline">
                        {categoryLabels[product.category] || "Otro"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xl sm:text-2xl font-bold">
                        ${product.price.toLocaleString("es-CL")}
                      </span>
                      {product.costo && (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Costo: ${product.costo.toLocaleString("es-CL")}
                        </span>
                      )}
                    </div>
                    {product.stock !== null && (
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={stockOut ? "text-destructive font-medium" : stockLow ? "text-amber-600 font-medium" : ""}>
                          {product.stock} unidades
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2 border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Editar</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setProductToDelete(product.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        product={editingProduct}
        onSuccess={handleDialogClose}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta acción no se puede deshacer. El producto será eliminado permanentemente del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
