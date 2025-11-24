import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import siriusLogo from "@/assets/sirius-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={siriusLogo}
              alt="Sirius"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
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
