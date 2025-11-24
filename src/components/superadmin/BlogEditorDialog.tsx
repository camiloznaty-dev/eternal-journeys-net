import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, Image as ImageIcon } from "lucide-react";

interface BlogEditorDialogProps {
  children: React.ReactNode;
  post?: any;
  onSuccess: () => void;
}

export function BlogEditorDialog({ children, post, onSuccess }: BlogEditorDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Content fields
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [bajada, setBajada] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenPortada, setImagenPortada] = useState("");
  const [estado, setEstado] = useState<"borrador" | "publicado" | "archivado">("borrador");
  
  // SEO fields
  const [metaTitulo, setMetaTitulo] = useState("");
  const [metaDescripcion, setMetaDescripcion] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");

  useEffect(() => {
    if (open && post) {
      setTitulo(post.titulo || "");
      setSubtitulo(post.subtitulo || "");
      setSlug(post.slug || "");
      setBajada(post.bajada || "");
      setContenido(post.contenido || "");
      setImagenPortada(post.imagen_portada || "");
      setEstado(post.estado || "borrador");
      setMetaTitulo(post.meta_titulo || "");
      setMetaDescripcion(post.meta_descripcion || "");
      setMetaKeywords(post.meta_keywords?.join(", ") || "");
      setOgImage(post.og_image || "");
    } else if (open && !post) {
      // Reset form
      setTitulo("");
      setSubtitulo("");
      setSlug("");
      setBajada("");
      setContenido("");
      setImagenPortada("");
      setEstado("borrador");
      setMetaTitulo("");
      setMetaDescripcion("");
      setMetaKeywords("");
      setOgImage("");
    }
  }, [open, post]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && titulo && !slug) {
      const generatedSlug = titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [titulo, slug, post]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPortada: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      if (isPortada) {
        setImagenPortada(publicUrl);
        if (!ogImage) setOgImage(publicUrl);
      } else {
        setOgImage(publicUrl);
      }

      toast.success("Imagen subida exitosamente");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo || !slug || !contenido) {
      toast.error("Por favor completa los campos obligatorios: título, slug y contenido");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const postData = {
        titulo,
        subtitulo: subtitulo || null,
        slug,
        bajada: bajada || null,
        contenido,
        imagen_portada: imagenPortada || null,
        estado,
        meta_titulo: metaTitulo || null,
        meta_descripcion: metaDescripcion || null,
        meta_keywords: metaKeywords ? metaKeywords.split(",").map(k => k.trim()) : null,
        og_image: ogImage || null,
        autor_id: user?.id,
        autor_nombre: user?.email,
        fecha_publicacion: estado === "publicado" ? new Date().toISOString() : null
      };

      if (post) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", post.id);

        if (error) throw error;
        toast.success("Post actualizado exitosamente");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert(postData);

        if (error) throw error;
        toast.success("Post creado exitosamente");
      }

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving post:", error);
      if (error.code === '23505') {
        toast.error("Ya existe un post con este slug. Por favor usa uno diferente.");
      } else {
        toast.error("Error al guardar el post");
      }
    } finally {
      setLoading(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {post ? "Editar Post" : "Nuevo Post de Blog"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="contenido" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contenido">Contenido</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="contenido" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título principal del post"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Subtítulo descriptivo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bajada">Bajada / Extracto</Label>
                <Textarea
                  id="bajada"
                  value={bajada}
                  onChange={(e) => setBajada(e.target.value)}
                  placeholder="Resumen breve que aparecerá en las previews"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen-portada">Imagen de Portada</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                        id="imagen-portada"
                        disabled={uploadingImage}
                      />
                      <label htmlFor="imagen-portada">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={uploadingImage}
                          asChild
                        >
                          <div>
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                          </div>
                        </Button>
                      </label>
                    </div>
                    <Input
                      value={imagenPortada}
                      onChange={(e) => setImagenPortada(e.target.value)}
                      placeholder="O pega la URL de la imagen"
                      className="mt-2"
                    />
                  </div>
                  {imagenPortada && (
                    <div className="w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={imagenPortada}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contenido *</Label>
                <div className="border rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={contenido}
                    onChange={setContenido}
                    modules={modules}
                    formats={formats}
                    placeholder="Escribe el contenido completo del post..."
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="meta-titulo">Meta Título</Label>
                <Input
                  id="meta-titulo"
                  value={metaTitulo}
                  onChange={(e) => setMetaTitulo(e.target.value)}
                  placeholder="Título para SEO (máx. 60 caracteres)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitulo.length}/60 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-descripcion">Meta Descripción</Label>
                <Textarea
                  id="meta-descripcion"
                  value={metaDescripcion}
                  onChange={(e) => setMetaDescripcion(e.target.value)}
                  placeholder="Descripción para motores de búsqueda (máx. 160 caracteres)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescripcion.length}/160 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Palabras Clave</Label>
                <Input
                  id="meta-keywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="Palabras clave separadas por comas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">Open Graph Image</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                        id="og-image"
                        disabled={uploadingImage}
                      />
                      <label htmlFor="og-image">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={uploadingImage}
                          asChild
                        >
                          <div>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            {uploadingImage ? "Subiendo..." : "Subir Imagen OG"}
                          </div>
                        </Button>
                      </label>
                    </div>
                    <Input
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="O pega la URL de la imagen para redes sociales"
                      className="mt-2"
                    />
                  </div>
                  {ogImage && (
                    <div className="w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Imagen que se mostrará al compartir en redes sociales (1200x630px recomendado)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="configuracion" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL (Slug) *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-del-post"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  URL amigable del post (solo letras minúsculas, números y guiones)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={(value: any) => setEstado(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : post ? "Actualizar Post" : "Crear Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}