import { useState, useMemo } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Send,
  Loader2,
  Search,
  Sparkles,
  TreePine,
  PartyPopper,
  Heart,
  Church,
  Flower2,
  User,
  Star,
  Moon,
  Gift,
  Flag,
  Briefcase,
  Baby,
  Users,
  Sun,
  Leaf,
  Snowflake,
  BookOpen,
  GraduationCap,
  Calendar,
  Bell,
  Shield,
  FileText,
  TrendingUp,
  HelpCircle,
  Settings,
  Mail,
  Eye,
} from "lucide-react";

// Template categories with counts
const categories = [
  { id: "all", name: "Todas", count: 20 },
  { id: "temporada", name: "Temporada y Festividades", count: 8 },
  { id: "promocionales", name: "Promocionales", count: 3 },
  { id: "informativos", name: "Informativos", count: 3 },
  { id: "mantenimiento", name: "Mantenimiento", count: 2 },
  { id: "ciclo_vida", name: "Ciclo de Vida", count: 2 },
  { id: "legales", name: "Legales", count: 2 },
];

// Template data
const templates = [
  // Temporada y Festividades
  { id: "navidad", name: "Navidad", description: "Te deseamos unas felices fiestas llenas de paz y alegría", icon: TreePine, color: "text-green-600", category: "temporada", subject: "¡Feliz Navidad de parte de Conecta Funerarias!" },
  { id: "ano_nuevo", name: "Año Nuevo 2026", description: "Comienza el año con nuevas metas y oportunidades", icon: PartyPopper, color: "text-amber-500", category: "temporada", subject: "¡Feliz Año Nuevo 2026!" },
  { id: "san_valentin", name: "San Valentín", description: "Un mensaje especial de Conecta Funerarias para ti", icon: Heart, color: "text-pink-500", category: "temporada", subject: "Feliz día del amor y la amistad" },
  { id: "semana_santa", name: "Semana Santa", description: "Tiempo de reflexión y renovación", icon: Church, color: "text-red-600", category: "temporada", subject: "Semana Santa - Tiempo de reflexión" },
  { id: "dia_madre", name: "Día de la Madre", description: "Un homenaje a todas las madres", icon: Flower2, color: "text-pink-400", category: "temporada", subject: "Feliz Día de la Madre" },
  { id: "dia_padre", name: "Día del Padre", description: "Celebramos a todos los padres", icon: User, color: "text-blue-500", category: "temporada", subject: "Feliz Día del Padre" },
  { id: "fiestas_patrias", name: "Fiestas Patrias 🇨🇱", description: "Celebremos juntos el 18 de Septiembre", icon: Star, color: "text-red-500", category: "temporada", subject: "¡Felices Fiestas Patrias!" },
  { id: "halloween", name: "Halloween", description: "Una noche de diversión espeluznante", icon: Moon, color: "text-orange-500", category: "temporada", subject: "¡Feliz Halloween!" },
  
  // Promocionales
  { id: "nuevo_plan", name: "Nuevo Plan Disponible", description: "Descubre nuestros nuevos planes y beneficios", icon: Gift, color: "text-purple-500", category: "promocionales", subject: "¡Nuevo plan disponible para ti!" },
  { id: "descuento", name: "Descuento Especial", description: "Aprovecha esta oferta exclusiva", icon: TrendingUp, color: "text-green-500", category: "promocionales", subject: "Descuento especial para ti" },
  { id: "referidos", name: "Programa Referidos", description: "Invita y gana beneficios", icon: Users, color: "text-blue-400", category: "promocionales", subject: "Gana con nuestro programa de referidos" },
  
  // Informativos
  { id: "bienvenida", name: "Bienvenida", description: "Mensaje de bienvenida a nuevos usuarios", icon: Sparkles, color: "text-amber-400", category: "informativos", subject: "¡Bienvenido a Conecta Funerarias!" },
  { id: "actualizacion", name: "Actualización de Plataforma", description: "Novedades y mejoras del sistema", icon: Bell, color: "text-blue-500", category: "informativos", subject: "Novedades en Conecta Funerarias" },
  { id: "newsletter", name: "Newsletter Mensual", description: "Resumen mensual de novedades", icon: FileText, color: "text-gray-500", category: "informativos", subject: "Newsletter de Conecta Funerarias" },
  
  // Mantenimiento
  { id: "recordatorio_pago", name: "Recordatorio de Pago", description: "Tu suscripción vence pronto", icon: Calendar, color: "text-orange-500", category: "mantenimiento", subject: "Recordatorio: Tu suscripción vence pronto" },
  { id: "cuenta_suspendida", name: "Cuenta Suspendida", description: "Notificación de suspensión de cuenta", icon: Shield, color: "text-red-500", category: "mantenimiento", subject: "Tu cuenta ha sido suspendida" },
  
  // Ciclo de Vida
  { id: "inactividad", name: "Te Extrañamos", description: "Mensaje para usuarios inactivos", icon: Heart, color: "text-pink-400", category: "ciclo_vida", subject: "Te extrañamos en Conecta Funerarias" },
  { id: "aniversario", name: "Aniversario", description: "Celebra tu tiempo con nosotros", icon: PartyPopper, color: "text-purple-400", category: "ciclo_vida", subject: "¡Feliz aniversario con nosotros!" },
  
  // Legales
  { id: "terminos", name: "Actualización de Términos", description: "Cambios en términos y condiciones", icon: FileText, color: "text-gray-600", category: "legales", subject: "Actualización de Términos y Condiciones" },
  { id: "privacidad", name: "Política de Privacidad", description: "Cambios en política de privacidad", icon: Shield, color: "text-gray-600", category: "legales", subject: "Actualización de Política de Privacidad" },
];

// Email HTML templates
const emailTemplates: Record<string, (firma: string, mensaje?: string) => string> = {
  navidad: (firma, mensaje) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:#1a5f3c;padding:60px 20px;text-align:center;">
      <div style="font-size:48px;margin-bottom:20px;">🎄✨🎅</div>
      <img src="https://via.placeholder.com/150x40/1a5f3c/ffffff?text=Conecta+Funerarias" alt="Logo" style="margin-bottom:20px;">
      <h1 style="color:white;margin:0;font-size:32px;">¡Feliz Navidad!</h1>
      <p style="color:#a8d5ba;margin:10px 0 0;">De parte de todo el equipo de Conecta Funerarias</p>
    </div>
    <div style="padding:40px 30px;text-align:center;">
      <div style="background:#fff8e7;border-radius:12px;padding:25px;margin-bottom:30px;">
        <p style="color:#8b6914;margin:0;font-size:16px;line-height:1.8;">
          ${mensaje || "En estas fiestas queremos agradecerte por ser parte de nuestra comunidad. Que esta Navidad traiga paz, amor y prosperidad a tu hogar."}
        </p>
      </div>
      <div style="font-size:36px;margin-bottom:20px;">🎁⭐❄️🔔🎄</div>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`,

  ano_nuevo: (firma, mensaje) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#4a1a6b 100%);padding:60px 20px;text-align:center;">
      <div style="font-size:48px;margin-bottom:20px;">🎆🥂✨</div>
      <h1 style="color:white;margin:0;font-size:36px;">¡Feliz Año Nuevo 2026!</h1>
      <p style="color:#c4a8ff;margin:15px 0 0;">Nuevos comienzos, nuevas oportunidades</p>
    </div>
    <div style="padding:40px 30px;text-align:center;">
      <p style="color:#555;font-size:16px;line-height:1.8;">
        ${mensaje || "Te deseamos un año lleno de éxitos, prosperidad y momentos inolvidables. Gracias por confiar en nosotros."}
      </p>
      <div style="font-size:36px;margin:30px 0;">🌟🎊🍾</div>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`,

  bienvenida: (firma, mensaje) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:50px 20px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:28px;">¡Bienvenido a Conecta Funerarias!</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#555;font-size:16px;line-height:1.8;">
        ${mensaje || "Gracias por registrarte en nuestra plataforma. Estamos aquí para ayudarte en cada paso del camino."}
      </p>
      <div style="background:#f0f4ff;border-radius:12px;padding:25px;margin:20px 0;">
        <p style="color:#4F46E5;margin:0;font-weight:600;">¿Qué puedes hacer ahora?</p>
        <ul style="color:#555;margin:15px 0 0;padding-left:20px;">
          <li>Completar tu perfil</li>
          <li>Explorar nuestros servicios</li>
          <li>Contactar con funerarias</li>
        </ul>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`,

  recordatorio_pago: (firma, mensaje) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:#FFA500;padding:40px 20px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:28px;">⚠️ Recordatorio de Pago</h1>
    </div>
    <div style="padding:40px 30px;">
      <div style="background:#FFF3E0;border-left:4px solid #FFA500;padding:20px;margin-bottom:20px;">
        <p style="color:#E65100;margin:0;font-weight:600;">Tu suscripción vence pronto</p>
      </div>
      <p style="color:#555;font-size:16px;line-height:1.8;">
        ${mensaje || "Para evitar la interrupción de tus servicios, te recomendamos renovar tu suscripción lo antes posible."}
      </p>
      <div style="text-align:center;margin-top:30px;">
        <a href="#" style="background:#4F46E5;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;display:inline-block;">Renovar Ahora</a>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`,

  nuevo_plan: (firma, mensaje) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:50px 20px;text-align:center;">
      <div style="font-size:48px;margin-bottom:15px;">🎁</div>
      <h1 style="color:white;margin:0;font-size:28px;">¡Nuevo Plan Disponible!</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#555;font-size:16px;line-height:1.8;">
        ${mensaje || "Hemos lanzado un nuevo plan con beneficios exclusivos pensados especialmente para ti."}
      </p>
      <div style="background:#f0f4ff;border-radius:12px;padding:25px;margin:20px 0;text-align:center;">
        <p style="color:#4F46E5;font-size:24px;font-weight:bold;margin:0;">Plan Premium</p>
        <p style="color:#888;margin:10px 0;">Descubre todas las ventajas</p>
      </div>
      <div style="text-align:center;">
        <a href="#" style="background:#4F46E5;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;display:inline-block;">Ver Detalles</a>
      </div>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`,
};

// Default template for those without specific HTML
const defaultEmailTemplate = (template: typeof templates[0], firma: string, mensaje?: string) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:white;">
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:50px 20px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:28px;">${template.subject}</h1>
    </div>
    <div style="padding:40px 30px;">
      <p style="color:#555;font-size:16px;line-height:1.8;">
        ${mensaje || template.description}
      </p>
    </div>
    <div style="background:#f8f9fa;padding:20px;text-align:center;">
      <p style="color:#666;margin:0;font-size:14px;">${firma}</p>
    </div>
  </div>
</body>
</html>`;

type RecipientType = "especificos" | "plan_basico" | "plan_premium" | "todos" | "funerarias";

export default function EmailMarketing() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Compose state
  const [recipientType, setRecipientType] = useState<RecipientType>("especificos");
  const [customEmails, setCustomEmails] = useState("");
  const [firma, setFirma] = useState("El equipo de Conecta Funerarias");
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let result = templates;
    
    if (selectedCategory !== "all") {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery]);

  // Group templates by category for display
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, typeof templates> = {};
    filteredTemplates.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setActiveTab("compose");
  };

  const getEmailHtml = () => {
    if (!selectedTemplate) return "";
    const templateFn = emailTemplates[selectedTemplate.id];
    if (templateFn) {
      return templateFn(firma, mensajePersonalizado || undefined);
    }
    return defaultEmailTemplate(selectedTemplate, firma, mensajePersonalizado || undefined);
  };

  const handleSendEmails = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Selecciona una plantilla primero",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      let emails: string[] = [];

      if (recipientType === "especificos") {
        emails = customEmails.split(",").map(e => e.trim()).filter(e => e && e.includes("@"));
        if (emails.length === 0) {
          toast({
            title: "Error",
            description: "Ingresa al menos un email válido",
            variant: "destructive",
          });
          setIsSending(false);
          return;
        }
      } else if (recipientType === "funerarias" || recipientType === "todos") {
        const { data } = await supabase
          .from("funerarias")
          .select("email")
          .not("email", "is", null);
        emails = data?.map(f => f.email).filter(Boolean) as string[] || [];
      } else {
        // For plan-based, we'd need plan data - for now use funerarias
        const { data } = await supabase
          .from("funerarias")
          .select("email")
          .not("email", "is", null);
        emails = data?.map(f => f.email).filter(Boolean) as string[] || [];
      }

      if (emails.length === 0) {
        toast({
          title: "Error",
          description: "No hay destinatarios disponibles",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const { error } = await supabase.functions.invoke("send-marketing-email", {
        body: {
          to: emails,
          subject: selectedTemplate.subject,
          html: getEmailHtml(),
        },
      });

      if (error) throw error;

      toast({
        title: "¡Emails enviados!",
        description: `Se enviaron ${emails.length} emails correctamente`,
      });

      // Reset
      setSelectedTemplate(null);
      setMensajePersonalizado("");
      setCustomEmails("");
      setActiveTab("templates");
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

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="templates" className="data-[state=active]:bg-background">
              Plantillas ({templates.length})
            </TabsTrigger>
            <TabsTrigger value="compose" className="data-[state=active]:bg-background">
              Componer
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">
              Vista Previa
            </TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Search and Categories */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar plantillas..."
                  className="pl-9 w-64"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="gap-2"
                  >
                    {cat.name}
                    <span className="text-xs opacity-70">{cat.count}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates Grid by Category */}
            {Object.entries(groupedTemplates).map(([categoryId, categoryTemplates]) => (
              <div key={categoryId} className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{getCategoryName(categoryId)}</span>
                  <span className="text-sm">{categoryTemplates.length}</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <Card
                        key={template.id}
                        className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className={`p-2 rounded-lg bg-muted ${template.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{template.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Selected Template Header */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className={`p-2 rounded-lg bg-background ${selectedTemplate.color}`}>
                    <selectedTemplate.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-semibold">{selectedTemplate.name}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{selectedTemplate.subject}</span>
                  </div>
                </div>

                {/* Recipients */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Tipo de destinatarios</Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={(v) => setRecipientType(v as RecipientType)}
                    className="grid grid-cols-2 md:grid-cols-5 gap-3"
                  >
                    <Label
                      htmlFor="especificos"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        recipientType === "especificos" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="especificos" id="especificos" />
                      <Mail className="h-4 w-4 text-primary" />
                      <span>Específicos</span>
                    </Label>
                    <Label
                      htmlFor="plan_basico"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        recipientType === "plan_basico" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="plan_basico" id="plan_basico" />
                      <Shield className="h-4 w-4 text-amber-500" />
                      <div>
                        <span>Plan Básico</span>
                        <span className="text-xs text-muted-foreground ml-1">(0)</span>
                      </div>
                    </Label>
                    <Label
                      htmlFor="plan_premium"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        recipientType === "plan_premium" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="plan_premium" id="plan_premium" />
                      <FileText className="h-4 w-4 text-purple-500" />
                      <div>
                        <span>Plan Premium</span>
                        <span className="text-xs text-muted-foreground ml-1">(0)</span>
                      </div>
                    </Label>
                    <Label
                      htmlFor="todos"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        recipientType === "todos" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="todos" id="todos" />
                      <Users className="h-4 w-4 text-blue-500" />
                      <div>
                        <span>Todos</span>
                        <span className="text-xs text-muted-foreground ml-1">(0)</span>
                      </div>
                    </Label>
                    <Label
                      htmlFor="funerarias"
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        recipientType === "funerarias" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="funerarias" id="funerarias" />
                      <FileText className="h-4 w-4 text-green-500" />
                      <div>
                        <span>Funerarias</span>
                        <span className="text-xs text-muted-foreground ml-1">(0)</span>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Custom Emails */}
                <div className="space-y-2">
                  <Label>Destinatarios (separados por coma)</Label>
                  <Input
                    value={customEmails}
                    onChange={(e) => setCustomEmails(e.target.value)}
                    placeholder="email1@ejemplo.com, email2@ejemplo.com"
                    disabled={recipientType !== "especificos"}
                  />
                </div>

                {/* Signature */}
                <div className="space-y-2">
                  <Label>Tu nombre o firma</Label>
                  <Input
                    value={firma}
                    onChange={(e) => setFirma(e.target.value)}
                    placeholder="El equipo de Conecta Funerarias"
                  />
                </div>

                {/* Custom Message */}
                <div className="space-y-2">
                  <Label>Mensaje personalizado (opcional)</Label>
                  <Textarea
                    value={mensajePersonalizado}
                    onChange={(e) => setMensajePersonalizado(e.target.value)}
                    placeholder="Escribe aquí tu mensaje personalizado..."
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Si dejas vacío, se usará el texto predeterminado.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSendEmails}
                    disabled={isSending}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    size="lg"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Email
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setActiveTab("preview")}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Vista Previa
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Selecciona una plantilla</h3>
                <p className="text-muted-foreground">
                  Ve a la pestaña Plantillas para elegir una plantilla de email
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("templates")}>
                  Ver Plantillas
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Vista previa del email</h2>
                  <Badge className="bg-primary">{selectedTemplate.name}</Badge>
                </div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted/30 flex justify-center p-8">
                      <iframe
                        srcDoc={getEmailHtml()}
                        className="w-full max-w-[600px] min-h-[600px] border-0 bg-white rounded-lg shadow-lg"
                        title="Email Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Sin vista previa</h3>
                <p className="text-muted-foreground">
                  Selecciona una plantilla para ver la vista previa
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
