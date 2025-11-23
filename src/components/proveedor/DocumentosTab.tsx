import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Download, Trash2, Upload, Calendar } from "lucide-react";
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

interface DocumentosTabProps {
  proveedorId: string;
}

export function DocumentosTab({ proveedorId }: DocumentosTabProps) {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("otro");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  useEffect(() => {
    fetchDocumentos();
  }, [proveedorId]);

  const fetchDocumentos = async () => {
    try {
      const { data, error } = await supabase
        .from("proveedor_documentos")
        .select("*")
        .eq("proveedor_id", proveedorId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocumentos(data || []);
    } catch (error: any) {
      toast.error("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!archivo || !nombre) {
      toast.error("Archivo y nombre son requeridos");
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const fileExt = archivo.name.split(".").pop();
      const fileName = `${session.user.id}/${proveedorId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("proveedor-documentos")
        .upload(fileName, archivo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("proveedor-documentos")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("proveedor_documentos")
        .insert([{
          proveedor_id: proveedorId,
          nombre,
          descripcion: descripcion || null,
          tipo,
          archivo_url: publicUrl,
          archivo_size: archivo.size,
          fecha_vencimiento: fechaVencimiento || null,
          subido_por: session.user.id,
        }]);

      if (insertError) throw insertError;

      toast.success("Documento subido correctamente");
      setDialogOpen(false);
      resetForm();
      fetchDocumentos();
    } catch (error: any) {
      toast.error("Error al subir documento");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, archivoUrl: string) => {
    if (!confirm("¿Eliminar este documento?")) return;

    try {
      const fileName = archivoUrl.split("/").slice(-3).join("/");
      
      await supabase.storage
        .from("proveedor-documentos")
        .remove([fileName]);

      const { error } = await supabase
        .from("proveedor_documentos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Documento eliminado");
      fetchDocumentos();
    } catch (error: any) {
      toast.error("Error al eliminar documento");
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setTipo("otro");
    setFechaVencimiento("");
    setArchivo(null);
  };

  const getTipoBadge = (tipo: string) => {
    const badges: any = {
      contrato: { label: "Contrato", variant: "default" },
      factura: { label: "Factura", variant: "secondary" },
      certificado: { label: "Certificado", variant: "outline" },
      otro: { label: "Otro", variant: "secondary" },
    };
    return badges[tipo] || badges.otro;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Documentos del Proveedor</h3>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Subir Documento
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay documentos</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Subir Primer Documento
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{doc.nombre}</p>
                      <Badge {...getTipoBadge(doc.tipo)}>{getTipoBadge(doc.tipo).label}</Badge>
                    </div>
                    {doc.descripcion && (
                      <p className="text-sm text-muted-foreground">{doc.descripcion}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>Subido: {format(new Date(doc.created_at), "dd/MM/yyyy")}</span>
                      {doc.fecha_vencimiento && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Vence: {format(new Date(doc.fecha_vencimiento), "dd/MM/yyyy")}
                        </span>
                      )}
                      <span>{(doc.archivo_size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
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
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(doc.id, doc.archivo_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Documento</DialogTitle>
              <DialogDescription>
                Agrega un contrato, factura o certificado del proveedor
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Documento *</Label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Contrato 2024, Factura #123..."
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="factura">Factura</SelectItem>
                    <SelectItem value="certificado">Certificado</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Notas adicionales..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Vencimiento (opcional)</Label>
                <Input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Archivo *</Label>
                <Input
                  type="file"
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-muted-foreground">
                  PDF, Word, Excel o imágenes (máx 10MB)
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Subiendo..." : "Subir"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
