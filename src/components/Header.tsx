import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import siriusLogo from "@/assets/sirius-logo.png";

export const Header = () => {
  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Funerarias", href: "/funerarias" },
    { label: "Comparador", href: "/comparar" },
    { label: "Obituarios", href: "/obituarios" },
    { label: "Planificador", href: "/planificador" },
    { label: "Productos", href: "/productos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center">
          {/* Centro: Logo + Barra de navegación */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-8">
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
          </div>

          {/* Derecha: acciones */}
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="default" className="hidden md:flex" asChild>
              <Link to="/auth">Iniciar Sesión</Link>
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
                  <Button variant="default" className="mt-4 w-full" asChild>
                    <Link to="/auth">Iniciar Sesión</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
