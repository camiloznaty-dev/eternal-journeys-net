import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Upload, Trash2, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface CasoDocumento {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo: string;
  archivo_url: string;
  archivo_size: number | null;
  mime_type: string | null;
  fecha_subida: string;
}

interface CasoDocumentosTabProps {
  casoId: string;
}

export function CasoDocumentosTab({ casoId }: CasoDocumentosTabProps) {
  const [documentos, setDocumentos] = useState<CasoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; documento: CasoDocumento | null }>({
    open: false,
    documento: null,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "pase_sepultacion",
    archivo: null as File | null,
  });

  useEffect(() => {
    fetchDocumentos();
  }, [casoId]);

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from("caso_documentos")
        .select("*")
        .eq("caso_id", casoId)
        .order("fecha_subida", { ascending: false });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.archivo) {
      toast.error("Selecciona un archivo");
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Upload file to storage
      const fileExt = formData.archivo.name.split(".").pop();
      const fileName = `${session.user.id}/${casoId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("caso-documentos")
        .upload(fileName, formData.archivo);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("caso-documentos")
        .getPublicUrl(fileName);

      // Save document record
      const { error: insertError } = await supabase
        .from("caso_documentos")
        .insert([{
          caso_id: casoId,
          nombre: formData.nombre || formData.archivo.name,
          descripcion: formData.descripcion || null,
          tipo: formData.tipo,
          archivo_url: publicUrl,
          archivo_size: formData.archivo.size,
          mime_type: formData.archivo.type,
          subido_por: session.user.id,
        }]);

      if (insertError) throw insertError;

      toast.success("Documento subido exitosamente");
      setFormData({
        nombre: "",
        descripcion: "",
        tipo: "pase_sepultacion",
        archivo: null,
      });
      setShowUploadForm(false);
      fetchDocumentos();
    } catch (error: any) {
      toast.error(error.message || "Error al subir documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.documento) return;

    try {
      // Extract file path from URL
      const url = new URL(deleteDialog.documento.archivo_url);
      const filePath = url.pathname.split("/caso-documentos/")[1];

      // Delete from storage
      await supabase.storage
        .from("caso-documentos")
        .remove([filePath]);

      // Delete record
      const { error } = await supabase
        .from("caso_documentos")
        .delete()
        .eq("id", deleteDialog.documento.id);

      if (error) throw error;

      toast.success("Documento eliminado");
      setDeleteDialog({ open: false, documento: null });
      fetchDocumentos();
    } catch (error: any) {
      toast.error("Error al eliminar documento");
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      pase_sepultacion: "Pase de Sepultación",
      certificado_defuncion: "Certificado de Defunción",
      permiso: "Permiso",
      contrato: "Contrato",
      otro: "Otro",
    };
    return labels[tipo] || tipo;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documentos del Caso</h3>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <Upload className="mr-2 h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      {showUploadForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Documento *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pase_sepultacion">Pase de Sepultación</SelectItem>
                    <SelectItem value="certificado_defuncion">Certificado de Defunción</SelectItem>
                    <SelectItem value="permiso">Permiso</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre del Documento</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre descriptivo (opcional)"
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción adicional (opcional)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="archivo">Archivo *</Label>
                <Input
                  id="archivo"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, archivo: e.target.files?.[0] || null })}
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos soportados: PDF, DOC, DOCX, JPG, PNG, GIF (máx. 20MB)
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Subir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setFormData({
                      nombre: "",
                      descripcion: "",
                      tipo: "pase_sepultacion",
                      archivo: null,
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {documentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No hay documentos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comienza subiendo el primer documento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documentos.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{doc.nombre}</h4>
                        <Badge variant="outline">{getTipoLabel(doc.tipo)}</Badge>
                      </div>
                      {doc.descripcion && (
                        <p className="text-sm text-muted-foreground mb-1">{doc.descripcion}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{new Date(doc.fecha_subida).toLocaleDateString("es-CL")}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.archivo_size)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.archivo_url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, documento: doc })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, documento: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El documento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
