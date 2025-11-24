import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Building2, User, Eye, EyeOff, Check, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { comunasPorRegion } from "@/data/comunas";
import { validateRut, formatRut } from "@/lib/rutValidator";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [comuna, setComuna] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userType, setUserType] = useState<"cliente" | "funeraria">("cliente");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [funerariaRutError, setFunerariaRutError] = useState("");
  const [legalRepRutError, setLegalRepRutError] = useState("");

  // Funeraria-specific fields
  const [funerariaName, setFunerariaName] = useState("");
  const [funerariaRut, setFunerariaRut] = useState("");
  const [funerariaAddress, setFunerariaAddress] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#666666");
  const [employeeCountRange, setEmployeeCountRange] = useState("");
  const [registrantType, setRegistrantType] = useState("");
  const [legalRepName, setLegalRepName] = useState("");
  const [legalRepRut, setLegalRepRut] = useState("");
  const [legalRepPosition, setLegalRepPosition] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Password validation
  const passwordValidations = {
    minLength: signupPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(signupPassword),
    hasLowerCase: /[a-z]/.test(signupPassword),
    hasSpecial: /[!@#$%^&*]/.test(signupPassword),
  };

  // Phone validation for Chilean numbers
  const validateChileanPhone = (phoneNumber: string): boolean => {
    // Format: +569 followed by 8 digits
    const chileanPhoneRegex = /^\+569\d{8}$/;
    return chileanPhoneRegex.test(phoneNumber);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value && !validateChileanPhone(value)) {
      setPhoneError("Formato inválido. Use +569 seguido de 8 dígitos");
    } else {
      setPhoneError("");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== signupPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const handleFunerariaRutChange = (value: string) => {
    const formatted = formatRut(value);
    setFunerariaRut(formatted);
    
    if (formatted && !validateRut(formatted)) {
      setFunerariaRutError("RUT inválido. Verifique el número y dígito verificador");
    } else {
      setFunerariaRutError("");
    }
  };

  const handleLegalRepRutChange = (value: string) => {
    const formatted = formatRut(value);
    setLegalRepRut(formatted);
    
    if (formatted && !validateRut(formatted)) {
      setLegalRepRutError("RUT inválido. Verifique el número y dígito verificador");
    } else {
      setLegalRepRutError("");
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Check user role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        const hasFunerariaRole = roles?.some(r => r.role === "funeraria");
        const hasClienteRole = roles?.some(r => r.role === "cliente");

        if (hasFunerariaRole) {
          navigate("/dashboard");
        } else if (hasClienteRole) {
          navigate("/mi-cuenta");
        } else {
          navigate("/");
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check user role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        const hasFunerariaRole = roles?.some(r => r.role === "funeraria");
        const hasClienteRole = roles?.some(r => r.role === "cliente");

        if (hasFunerariaRole) {
          navigate("/dashboard");
        } else if (hasClienteRole) {
          navigate("/mi-cuenta");
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      toast.success("¡Bienvenido!");
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone before submitting
    if (phone && !validateChileanPhone(phone)) {
      toast.error("Por favor ingrese un número de teléfono válido");
      return;
    }

    // Validate password match
    if (signupPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      toast.error("Debe aceptar los términos y condiciones");
      return;
    }

    // Validate funeraria fields if user type is funeraria
    if (userType === "funeraria") {
      if (!funerariaName || !funerariaRut || !funerariaAddress || !employeeCountRange || !registrantType) {
        toast.error("Por favor complete todos los campos de la funeraria");
        return;
      }
      
      // Validate funeraria RUT
      if (!validateRut(funerariaRut)) {
        toast.error("El RUT de la funeraria es inválido");
        return;
      }
      
      if (registrantType === "representante_legal") {
        if (!legalRepName || !legalRepRut || !legalRepPosition) {
          toast.error("Por favor complete los datos del representante legal");
          return;
        }
        
        // Validate legal representative RUT
        if (!validateRut(legalRepRut)) {
          toast.error("El RUT del representante legal es inválido");
          return;
        }
      }
    }

    setLoading(true);

    try {
      let logoUrl = null;
      let heroUrl = null;

      // Upload images if present (only for funerarias)
      if (userType === "funeraria") {
        const tempUserId = crypto.randomUUID();
        
        if (logoFile) {
          const logoExt = logoFile.name.split('.').pop();
          const logoPath = `${tempUserId}/logo.${logoExt}`;
          const { error: logoError } = await supabase.storage
            .from('funeraria-images')
            .upload(logoPath, logoFile);
          
          if (logoError) {
            toast.error("Error al subir el logo");
            setLoading(false);
            return;
          }
          
          logoUrl = supabase.storage.from('funeraria-images').getPublicUrl(logoPath).data.publicUrl;
        }

        if (heroFile) {
          const heroExt = heroFile.name.split('.').pop();
          const heroPath = `${tempUserId}/hero.${heroExt}`;
          const { error: heroError } = await supabase.storage
            .from('funeraria-images')
            .upload(heroPath, heroFile);
          
          if (heroError) {
            toast.error("Error al subir la foto de portada");
            setLoading(false);
            return;
          }
          
          heroUrl = supabase.storage.from('funeraria-images').getPublicUrl(heroPath).data.publicUrl;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: `${firstName} ${lastName}`,
            role: userType,
            phone,
            ...(userType === "funeraria" && {
              funeraria_name: funerariaName,
              funeraria_rut: funerariaRut,
              funeraria_address: funerariaAddress,
              primary_color: primaryColor,
              secondary_color: secondaryColor,
              employee_count_range: employeeCountRange,
              registrant_type: registrantType,
              legal_rep_name: legalRepName,
              legal_rep_rut: legalRepRut,
              legal_rep_position: legalRepPosition,
              logo_url: logoUrl,
              hero_image_url: heroUrl,
              comuna,
            }),
          },
        },
      });

      if (error) throw error;
      
      toast.success("¡Cuenta creada exitosamente!");
      
      if (userType === "funeraria") {
        toast.info("Completa tu perfil desde el dashboard para activar tu mini website", {
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className={cn("w-full", userType === "funeraria" ? "max-w-2xl" : "max-w-md")}>
          <CardHeader>
            <CardTitle>Acceso a la plataforma</CardTitle>
            <CardDescription>
              Inicia sesión o crea una cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={loading}>
                    {loading ? "Iniciando..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5 mt-6">
                  {/* Tipo de cuenta */}
                  <div className="space-y-3">
                    <Label className="text-base">Tipo de cuenta</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Card
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          userType === "cliente"
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setUserType("cliente")}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                          <User className={cn("h-8 w-8", userType === "cliente" ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("font-medium", userType === "cliente" ? "text-primary" : "text-foreground")}>
                            Cliente
                          </span>
                        </CardContent>
                      </Card>
                      <Card
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          userType === "funeraria"
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setUserType("funeraria")}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                          <Building2 className={cn("h-8 w-8", userType === "funeraria" ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("font-medium", userType === "funeraria" ? "text-primary" : "text-foreground")}>
                            Funeraria
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Datos personales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Nombre</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder="Juan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Apellidos</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder="Pérez González"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* Datos de funeraria */}
                  {userType === "funeraria" && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="funeraria-name">Nombre de la Funeraria</Label>
                        <Input
                          id="funeraria-name"
                          type="text"
                          placeholder="Funeraria Los Ángeles"
                          value={funerariaName}
                          onChange={(e) => setFunerariaName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="funeraria-rut">RUT Empresa</Label>
                        <Input
                          id="funeraria-rut"
                          type="text"
                          placeholder="12.345.678-9"
                          value={funerariaRut}
                          onChange={(e) => handleFunerariaRutChange(e.target.value)}
                          required
                          className={cn("h-11", funerariaRutError && "border-destructive")}
                        />
                        {funerariaRutError && (
                          <p className="text-xs text-destructive flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {funerariaRutError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="funeraria-address">Dirección</Label>
                        <Input
                          id="funeraria-address"
                          type="text"
                          placeholder="Av. Principal 123"
                          value={funerariaAddress}
                          onChange={(e) => setFunerariaAddress(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employee-count">Cantidad de Colaboradores</Label>
                        <Select value={employeeCountRange} onValueChange={setEmployeeCountRange} required>
                          <SelectTrigger id="employee-count" className="h-11">
                            <SelectValue placeholder="Seleccione un rango" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 colaboradores</SelectItem>
                            <SelectItem value="6-10">6-10 colaboradores</SelectItem>
                            <SelectItem value="11-25">11-25 colaboradores</SelectItem>
                            <SelectItem value="26-50">26-50 colaboradores</SelectItem>
                            <SelectItem value="51-100">51-100 colaboradores</SelectItem>
                            <SelectItem value="100+">Más de 100 colaboradores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registrant-type">¿Quién realiza el registro?</Label>
                        <Select value={registrantType} onValueChange={setRegistrantType} required>
                          <SelectTrigger id="registrant-type" className="h-11">
                            <SelectValue placeholder="Seleccione una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="representante_legal">Representante Legal</SelectItem>
                            <SelectItem value="dueno">Dueño/Propietario</SelectItem>
                            <SelectItem value="administrador">Administrador</SelectItem>
                            <SelectItem value="gerente">Gerente</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {registrantType === "representante_legal" && (
                        <div className="space-y-4 pt-2 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground">Datos del Representante Legal</p>
                          
                          <div className="space-y-2">
                            <Label htmlFor="legal-rep-name">Nombre Completo</Label>
                            <Input
                              id="legal-rep-name"
                              type="text"
                              placeholder="Juan Pérez González"
                              value={legalRepName}
                              onChange={(e) => setLegalRepName(e.target.value)}
                              required
                              className="h-11"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="legal-rep-rut">RUT</Label>
                              <Input
                                id="legal-rep-rut"
                                type="text"
                                placeholder="12.345.678-9"
                                value={legalRepRut}
                                onChange={(e) => handleLegalRepRutChange(e.target.value)}
                                required
                                className={cn("h-11", legalRepRutError && "border-destructive")}
                              />
                              {legalRepRutError && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                  <X className="h-3 w-3" />
                                  {legalRepRutError}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="legal-rep-position">Cargo</Label>
                              <Input
                                id="legal-rep-position"
                                type="text"
                                placeholder="Gerente General"
                                value={legalRepPosition}
                                onChange={(e) => setLegalRepPosition(e.target.value)}
                                required
                                className="h-11"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 pt-2">
                        <div>
                          <Label htmlFor="logo">Logo (opcional)</Label>
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            className="cursor-pointer h-11"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formatos: JPG, PNG, WEBP, SVG
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="hero">Foto de portada (opcional)</Label>
                          <Input
                            id="hero"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                            className="cursor-pointer h-11"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formatos: JPG, PNG, WEBP. Recomendado: 1920x600px
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Colores del Mini Website</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primary-color" className="text-sm">Color Primario</Label>
                            <div className="flex gap-2">
                              <Input
                                id="primary-color"
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-14 h-11 p-1 cursor-pointer"
                              />
                              <Input
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                placeholder="#000000"
                                className="h-11 flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="secondary-color" className="text-sm">Color Secundario</Label>
                            <div className="flex gap-2">
                              <Input
                                id="secondary-color"
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="w-14 h-11 p-1 cursor-pointer"
                              />
                              <Input
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                placeholder="#666666"
                                className="h-11 flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Podrás cambiar estos colores después desde tu dashboard
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-2 shrink-0">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Logo y Foto de Portada</p>
                            <p className="text-xs text-muted-foreground">
                              Podrás subir tu logo y foto de portada después desde tu dashboard
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Celular</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+56912345678"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      className={cn("h-11", phoneError && "border-destructive")}
                    />
                    {phoneError && (
                      <p className="text-sm text-destructive">{phoneError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Formato: +569 seguido de 8 dígitos (ej: +56912345678)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comuna">Comuna</Label>
                    <Select value={comuna} onValueChange={setComuna} required>
                      <SelectTrigger id="comuna" className="h-11">
                        <SelectValue placeholder="Seleccione su comuna" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-background">
                        {Object.entries(comunasPorRegion).map(([region, comunas]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {comunas.map((comunaName) => (
                              <SelectItem key={comunaName} value={comunaName}>
                                {comunaName}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={8}
                        className="h-11 pr-10"
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupPassword && (
                      <div className="mt-3 space-y-2 text-sm">
                        <p className="text-muted-foreground mb-2">La contraseña debe contener:</p>
                        <div className="space-y-1.5">
                          <ValidationItem isValid={passwordValidations.minLength} text="Mínimo 8 caracteres" />
                          <ValidationItem isValid={passwordValidations.hasUpperCase} text="Una mayúscula (A-Z)" />
                          <ValidationItem isValid={passwordValidations.hasLowerCase} text="Una minúscula (a-z)" />
                          <ValidationItem isValid={passwordValidations.hasSpecial} text="Un carácter especial (!@#$%^&*)" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        required
                        className={cn("h-11 pr-10", passwordError && "border-destructive")}
                        placeholder="Confirma tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-sm text-destructive">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      required
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      Acepto los{" "}
                      <a href="/terminos" target="_blank" className="text-primary underline hover:text-primary/80">
                        términos y condiciones
                      </a>
                      {" "}y la{" "}
                      <a href="/privacidad" target="_blank" className="text-primary underline hover:text-primary/80">
                        política de privacidad
                      </a>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <div className={cn("flex items-center gap-2 transition-colors", isValid ? "text-green-600" : "text-muted-foreground")}>
    {isValid ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    <span>{text}</span>
  </div>
);

export default Auth;
