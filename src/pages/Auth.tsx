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

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
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

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: `${firstName} ${lastName}`,
            role: userType,
          },
        },
      });

      if (error) throw error;
      toast.success("¡Cuenta creada exitosamente!");
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
        <Card className="w-full max-w-md">
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
                <form onSubmit={handleSignup} className="space-y-6 mt-6">
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
