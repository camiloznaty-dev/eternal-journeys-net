import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Loader2, ExternalLink, Globe } from "lucide-react";

export default function Perfil() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [funerariaData, setFunerariaData] = useState<any>(null);
  
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [horarios, setHorarios] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#666666");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [activeTab, setActiveTab] = useState("basico");

  useEffect(() => {
    fetchFunerariaData();
  }, []);

  const fetchFunerariaData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: empleado } = await supabase
        .from("empleados")
        .select("funeraria_id, funerarias(*)")
        .eq("user_id", session.user.id)
        .single();

      if (!empleado || !empleado.funerarias) return;

      const funeraria = empleado.funerarias;
      setFunerariaData(funeraria);
      setNombre(funeraria.name || "");
      setSlug(funeraria.slug || "");
      setDescripcion(funeraria.description || "");
      setDireccion(funeraria.address || "");
      setEmail(funeraria.email || "");
      setPhone(funeraria.phone || "");
      setHorarios(funeraria.horarios || "");
      setAboutText(funeraria.about_text || "");
      setPrimaryColor(funeraria.primary_color || "#000000");
      setSecondaryColor(funeraria.secondary_color || "#666666");
      setFacebookUrl(funeraria.facebook_url || "");
      setInstagramUrl(funeraria.instagram_url || "");
      setLogoUrl(funeraria.logo_url);
      setHeroUrl(funeraria.hero_image_url);
    } catch (error: any) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!funerariaData) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${funerariaData.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("funeraria-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("funeraria-images")
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);
      toast.success("Logo subido correctamente");
    } catch (error: any) {
      toast.error("Error al subir logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroUpload = async (file: File) => {
    if (!funerariaData) return;

    setUploadingHero(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${funerariaData.id}/hero.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("funeraria-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("funeraria-images")
        .getPublicUrl(fileName);

      setHeroUrl(publicUrl);
      toast.success("Imagen de portada subida correctamente");
    } catch (error: any) {
      toast.error("Error al subir imagen");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSave = async () => {
    if (!funerariaData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("funerarias")
        .update({
          name: nombre,
          slug: slug || null,
          description: descripcion || null,
          address: direccion,
          email: email || null,
          phone: phone || null,
          horarios: horarios || null,
          about_text: aboutText || null,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          facebook_url: facebookUrl || null,
          instagram_url: instagramUrl || null,
          logo_url: logoUrl,
          hero_image_url: heroUrl,
        })
        .eq("id", funerariaData.id);

      if (error) throw error;

      toast.success("Perfil actualizado correctamente");
      fetchFunerariaData();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfil de la Funeraria</h1>
            <p className="text-muted-foreground">
              Configura el perfil público de tu funeraria
            </p>
          </div>
          {slug && (
            <Button 
              onClick={() => window.open(`/f/${slug}`, '_blank')}
              variant="outline"
            >
              <Globe className="mr-2 h-4 w-4" />
              Ver Sitio Público
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="contacto">Contacto</TabsTrigger>
            <TabsTrigger value="redes">Redes Sociales</TabsTrigger>
            <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          {/* Tab Básico */}
          <TabsContent value="basico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Información principal que aparecerá en tu perfil público
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Funeraria</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Funeraria Ejemplo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Personalizada</Label>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        sirius.cl/f/
                      </span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="mi-funeraria"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Corta</Label>
                  <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción breve para búsquedas..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutText">Sobre Nosotros</Label>
                  <Textarea
                    id="aboutText"
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Cuéntanos la historia de tu funeraria..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Contacto */}
          <TabsContent value="contacto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>
                  Datos de contacto que aparecerán en tu sitio público
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Av. Principal 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@funeraria.cl"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56912345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horarios">Horarios</Label>
                    <Input
                      id="horarios"
                      value={horarios}
                      onChange={(e) => setHorarios(e.target.value)}
                      placeholder="Lun-Vie: 9:00-18:00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Redes Sociales */}
          <TabsContent value="redes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
                <CardDescription>
                  Enlaces a tus redes sociales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/tufuneraria"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/tufuneraria"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Apariencia */}
          <TabsContent value="apariencia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>
                  Logo y foto de portada de tu funeraria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {logoUrl && (
                      <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                        className="hidden"
                        id="logo-upload"
                        disabled={uploadingLogo}
                      />
                      <label htmlFor="logo-upload">
                        <Button type="button" variant="outline" disabled={uploadingLogo} asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingLogo ? "Subiendo..." : "Subir Logo"}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recomendado: 500x500px, PNG con fondo transparente
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagen de Portada</Label>
                  <div className="space-y-2">
                    {heroUrl && (
                      <div className="w-full aspect-video border rounded-lg overflow-hidden bg-muted">
                        <img src={heroUrl} alt="Portada" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleHeroUpload(e.target.files[0])}
                        className="hidden"
                        id="hero-upload"
                        disabled={uploadingHero}
                      />
                      <label htmlFor="hero-upload">
                        <Button type="button" variant="outline" disabled={uploadingHero} asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            {uploadingHero ? "Subiendo..." : "Subir Portada"}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recomendado: 1920x600px, JPG o PNG
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalización</CardTitle>
                <CardDescription>
                  Colores corporativos de tu funeraria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="color-primario">Color Primario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-primario"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-secundario">Color Secundario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-secundario"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#666666"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Vista Previa */}
          <TabsContent value="preview" className="space-y-6">
            <Card className="border-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  Vista Previa del Sitio Web
                </CardTitle>
                <CardDescription>
                  {slug ? (
                    <>Tu sitio web está disponible en: <strong>sirius.cl/f/{slug}</strong></>
                  ) : (
                    <>Configura una URL personalizada en la pestaña "Básico" para activar tu sitio web</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {slug ? (
                  <>
                    <div className="border-2 border-border rounded-lg overflow-hidden bg-muted">
                      <div className="aspect-video w-full relative">
                        {heroUrl ? (
                          <img 
                            src={heroUrl} 
                            alt="Vista previa" 
                            className="w-full h-full object-cover opacity-90"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                            <p className="text-muted-foreground">Sin imagen de portada</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-center text-white space-y-2">
                            {logoUrl && (
                              <div className="mb-4 flex justify-center">
                                <div className="w-20 h-20 bg-white rounded-lg p-2">
                                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                              </div>
                            )}
                            <h2 className="text-2xl font-bold">{nombre || "Tu Funeraria"}</h2>
                            <p className="text-sm opacity-90">{descripcion || "Descripción de tu funeraria"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => window.open(`/f/${slug}`, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver Sitio Público
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`);
                          toast.success("Enlace copiado al portapapeles");
                        }}
                      >
                        Copiar Enlace
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Sitio web no configurado</p>
                    <p className="text-sm mt-2">Ve a la pestaña "Básico" y configura una URL personalizada para activar tu sitio web público</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
