import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<"cliente" | "funeraria">("cliente");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Password validation
  const passwordValidations = {
    minLength: signupPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(signupPassword),
    hasLowerCase: /[a-z]/.test(signupPassword),
    hasNumber: /[0-9]/.test(signupPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword),
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
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
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
            <Tabs defaultValue="login">
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
                      <Label htmlFor="full-name">Nombre completo</Label>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11"
                      />
                    </div>
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
                          <ValidationItem isValid={passwordValidations.hasUpperCase} text="Al menos una letra mayúscula" />
                          <ValidationItem isValid={passwordValidations.hasLowerCase} text="Al menos una letra minúscula" />
                          <ValidationItem isValid={passwordValidations.hasNumber} text="Al menos un número" />
                          <ValidationItem isValid={passwordValidations.hasSpecial} text="Al menos un carácter especial (!@#$%^&*)" />
                        </div>
                      </div>
                    )}
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
