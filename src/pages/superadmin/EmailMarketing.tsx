import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Mail,
  FileText,
  Eye,
  Send,
  Plus,
  Edit,
  Trash2,
  Copy,
  Loader2,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Bienvenida Funeraria",
    subject: "¡Bienvenido a Conecta Funerarias!",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #1a1a2e; margin-top: 0; }
    .content p { color: #555; line-height: 1.8; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Conecta Funerarias</h1>
    </div>
    <div class="content">
      <h2>¡Bienvenido, {{nombre}}!</h2>
      <p>Gracias por registrar tu funeraria en nuestra plataforma. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
      <p>Con Conecta Funerarias podrás:</p>
      <ul>
        <li>Gestionar tus casos y servicios</li>
        <li>Publicar obituarios</li>
        <li>Conectar con familias que necesitan tus servicios</li>
      </ul>
      <a href="{{dashboard_url}}" class="button">Ir al Dashboard</a>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    </div>
    <div class="footer">
      <p>© 2024 Conecta Funerarias. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`,
    category: "onboarding",
  },
  {
    id: "2",
    name: "Nuevo Plan Disponible",
    subject: "¡Descubre nuestro nuevo plan {{plan_name}}!",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .plan-box { background: #f8f9fa; border-radius: 12px; padding: 30px; margin: 20px 0; border-left: 4px solid #4F46E5; }
    .price { font-size: 36px; color: #4F46E5; font-weight: bold; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Nuevo Plan Disponible!</h1>
    </div>
    <div class="content">
      <h2>Hola {{nombre}},</h2>
      <p>Tenemos excelentes noticias para ti. Acabamos de lanzar nuestro nuevo plan {{plan_name}} con beneficios exclusivos.</p>
      <div class="plan-box">
        <h3>Plan {{plan_name}}</h3>
        <p class="price">{{precio}}/mes</p>
        <ul>
          <li>{{beneficio_1}}</li>
          <li>{{beneficio_2}}</li>
          <li>{{beneficio_3}}</li>
        </ul>
      </div>
      <a href="{{upgrade_url}}" class="button">Actualizar Mi Plan</a>
    </div>
    <div class="footer">
      <p>© 2024 Conecta Funerarias. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`,
    category: "marketing",
  },
  {
    id: "3",
    name: "Recordatorio de Pago",
    subject: "Recordatorio: Tu suscripción vence pronto",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #FFA500; padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .warning-box { background: #FFF3E0; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #FFA500; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #888; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Recordatorio de Pago</h1>
    </div>
    <div class="content">
      <h2>Hola {{nombre}},</h2>
      <div class="warning-box">
        <p><strong>Tu suscripción al plan {{plan_name}} vence el {{fecha_vencimiento}}.</strong></p>
      </div>
      <p>Para evitar la interrupción de tus servicios, te recomendamos renovar tu suscripción lo antes posible.</p>
      <a href="{{payment_url}}" class="button">Renovar Ahora</a>
      <p>Si ya realizaste el pago, puedes ignorar este mensaje.</p>
    </div>
    <div class="footer">
      <p>© 2024 Conecta Funerarias. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`,
    category: "billing",
  },
];

type RecipientType = "all_funerarias" | "all_users" | "custom";

export default function EmailMarketing() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Compose state
  const [composeData, setComposeData] = useState({
    templateId: "",
    subject: "",
    content: "",
    recipientType: "all_funerarias" as RecipientType,
    customEmails: "",
    variables: {} as Record<string, string>,
  });

  // New template state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    category: "marketing",
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: "", subject: "", content: "", category: "marketing" });
    setIsCreatingTemplate(false);
    toast({
      title: "Plantilla creada",
      description: "La plantilla se ha guardado correctamente",
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast({
      title: "Plantilla eliminada",
      description: "La plantilla se ha eliminado correctamente",
    });
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setComposeData({
      ...composeData,
      templateId: template.id,
      subject: template.subject,
      content: template.content,
    });
    setActiveTab("compose");
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = content.match(regex) || [];
    return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
  };

  const replaceVariables = (content: string, variables: Record<string, string>): string => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || `{{${key}}}`);
    });
    return result;
  };

  const handleSendEmails = async () => {
    if (!composeData.subject || !composeData.content) {
      toast({
        title: "Error",
        description: "Asunto y contenido son obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      let emails: string[] = [];

      if (composeData.recipientType === "custom") {
        emails = composeData.customEmails
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
      } else {
        // Fetch emails from database
        if (composeData.recipientType === "all_funerarias") {
          const { data } = await supabase
            .from("funerarias")
            .select("email")
            .not("email", "is", null);
          emails = data?.map((f) => f.email).filter(Boolean) as string[] || [];
        } else {
          const { data } = await supabase
            .from("profiles")
            .select("email")
            .not("email", "is", null);
          emails = data?.map((p) => p.email).filter(Boolean) as string[] || [];
        }
      }

      if (emails.length === 0) {
        toast({
          title: "Error",
          description: "No hay destinatarios para enviar",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const finalContent = replaceVariables(composeData.content, composeData.variables);
      const finalSubject = replaceVariables(composeData.subject, composeData.variables);

      const { data, error } = await supabase.functions.invoke("send-marketing-email", {
        body: {
          to: emails,
          subject: finalSubject,
          html: finalContent,
        },
      });

      if (error) throw error;

      toast({
        title: "¡Emails enviados!",
        description: `Se enviaron ${emails.length} emails correctamente`,
      });

      // Reset compose
      setComposeData({
        templateId: "",
        subject: "",
        content: "",
        recipientType: "all_funerarias",
        customEmails: "",
        variables: {},
      });
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error al enviar",
        description: error.message || "Ocurrió un error al enviar los emails",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const variables = extractVariables(composeData.content);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">
            Gestiona campañas de email marketing con plantillas personalizables
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Componer
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Plantillas de Email</h2>
              <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Plantilla
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Plantilla</DialogTitle>
                    <DialogDescription>
                      Crea una plantilla de email reutilizable. Usa {"{{variable}}"} para campos dinámicos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre de la plantilla</Label>
                        <Input
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          placeholder="Ej: Bienvenida Cliente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select
                          value={newTemplate.category}
                          onValueChange={(v) => setNewTemplate({ ...newTemplate, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="billing">Facturación</SelectItem>
                            <SelectItem value="notification">Notificación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Asunto del email</Label>
                      <Input
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                        placeholder="Ej: ¡Bienvenido {{nombre}}!"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contenido HTML</Label>
                      <Textarea
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                        placeholder="<html>...</html>"
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>
                    <Button onClick={handleCreateTemplate} className="w-full">
                      Guardar Plantilla
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.subject}</CardDescription>
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Usar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(template.content);
                          toast({ title: "Copiado", description: "HTML copiado al portapapeles" });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Componer Email</CardTitle>
                <CardDescription>
                  {selectedTemplate
                    ? `Usando plantilla: ${selectedTemplate.name}`
                    : "Selecciona una plantilla o escribe desde cero"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recipients */}
                <div className="space-y-3">
                  <Label>Destinatarios</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={composeData.recipientType === "all_funerarias" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => setComposeData({ ...composeData, recipientType: "all_funerarias" })}
                    >
                      <Building2 className="h-5 w-5" />
                      <span>Todas las Funerarias</span>
                    </Button>
                    <Button
                      type="button"
                      variant={composeData.recipientType === "all_users" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => setComposeData({ ...composeData, recipientType: "all_users" })}
                    >
                      <Users className="h-5 w-5" />
                      <span>Todos los Usuarios</span>
                    </Button>
                    <Button
                      type="button"
                      variant={composeData.recipientType === "custom" ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col gap-2"
                      onClick={() => setComposeData({ ...composeData, recipientType: "custom" })}
                    >
                      <Mail className="h-5 w-5" />
                      <span>Emails Personalizados</span>
                    </Button>
                  </div>
                  {composeData.recipientType === "custom" && (
                    <Textarea
                      value={composeData.customEmails}
                      onChange={(e) => setComposeData({ ...composeData, customEmails: e.target.value })}
                      placeholder="email1@ejemplo.com, email2@ejemplo.com..."
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Asunto</Label>
                  <Input
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    placeholder="Asunto del email..."
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Contenido HTML</Label>
                  <Textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                    placeholder="<html>...</html>"
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                {/* Variables */}
                {variables.length > 0 && (
                  <div className="space-y-3">
                    <Label>Variables detectadas</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {variables.map((variable) => (
                        <div key={variable} className="space-y-1">
                          <Label className="text-sm text-muted-foreground">{`{{${variable}}}`}</Label>
                          <Input
                            value={composeData.variables[variable] || ""}
                            onChange={(e) =>
                              setComposeData({
                                ...composeData,
                                variables: { ...composeData.variables, [variable]: e.target.value },
                              })
                            }
                            placeholder={`Valor para ${variable}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("preview")} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Vista Previa
                  </Button>
                  <Button onClick={handleSendEmails} disabled={isSending} className="flex-1">
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Emails
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vista Previa del Email</CardTitle>
                    <CardDescription>
                      Asunto: {replaceVariables(composeData.subject, composeData.variables) || "Sin asunto"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab("compose")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <iframe
                    srcDoc={replaceVariables(composeData.content, composeData.variables) || "<p>Sin contenido</p>"}
                    className="w-full min-h-[600px] border-0"
                    title="Email Preview"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
