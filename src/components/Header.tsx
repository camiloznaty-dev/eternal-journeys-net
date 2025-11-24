import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import conectaLogoLight from "@/assets/conecta-logo-light.png";
import conectaLogoDark from "@/assets/conecta-logo-dark.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

export const Header = () => {
  const { theme } = useTheme();
  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Funerarias", href: "/funerarias" },
    { label: "Comparador", href: "/comparar" },
    { label: "Obituarios", href: "/obituarios" },
    { label: "Vende tu Sepultura", href: "/vende-sepultura" },
    { label: "Planificador", href: "/planificador" },
    { label: "Asistencia", href: "/asistencia" },
    { label: "Productos", href: "/productos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={theme === "dark" ? conectaLogoDark : conectaLogoLight}
              alt="ConectaFunerarias"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link to="/auth?tab=login">Iniciar Sesión</Link>
            </Button>
            <Button variant="default" className="hidden md:flex" asChild>
              <Link to="/auth?tab=signup">Registrarse</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="mt-8 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tema</span>
                      <ThemeToggle />
                    </div>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/auth?tab=login">Iniciar Sesión</Link>
                    </Button>
                    <Button variant="default" className="w-full" asChild>
                      <Link to="/auth?tab=signup">Registrarse</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
