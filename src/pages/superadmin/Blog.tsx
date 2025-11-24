import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogEditorDialog } from "@/components/superadmin/BlogEditorDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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

export default function SuperAdminBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isSuperAdmin = roleData?.some(r => r.role === "superadmin");

      if (!isSuperAdmin) {
        navigate("/");
        return;
      }

      await fetchPosts();
    } catch (error) {
      console.error("Error checking access:", error);
      navigate("/");
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error al cargar los posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postToDelete);

      if (error) throw error;

      toast.success("Post eliminado exitosamente");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error al eliminar el post");
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "publicado":
        return "default";
      case "borrador":
        return "secondary";
      case "archivado":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-3xl font-bold">Gestión de Blog</h1>
            <p className="text-muted-foreground">
              Crea y administra el contenido del blog
            </p>
          </div>
          <BlogEditorDialog onSuccess={fetchPosts}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Post
            </Button>
          </BlogEditorDialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o subtítulo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No se encontraron posts
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="w-20 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {post.imagen_portada ? (
                              <img 
                                src={post.imagen_portada} 
                                alt={post.titulo}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-xs text-muted-foreground text-center p-1">
                                Sin imagen
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{post.titulo}</p>
                            {post.subtitulo && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {post.subtitulo}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getEstadoBadgeVariant(post.estado)}>
                            {post.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {post.autor_nombre || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.fecha_publicacion
                              ? format(new Date(post.fecha_publicacion), "dd/MM/yyyy", { locale: es })
                              : format(new Date(post.created_at), "dd/MM/yyyy", { locale: es })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <BlogEditorDialog post={post} onSuccess={fetchPosts}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </BlogEditorDialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPostToDelete(post.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El post será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SuperAdminLayout>
  );
}