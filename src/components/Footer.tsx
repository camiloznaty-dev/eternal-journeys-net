import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4 w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-xl rounded-full transition-opacity duration-300 group-hover:opacity-30" />
                <div className="relative bg-gradient-primary p-2 rounded-xl shadow-elegant">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Conecta
                </span>
                <span className="font-display text-sm font-medium text-foreground/70 tracking-wider">
                  FUNERARIAS
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Conectando familias con servicios funerarios de calidad y dignidad. Modernizando la industria funeraria en Latinoamérica.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Familias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/funerarias" className="hover:text-accent transition-colors">Buscar Funerarias</Link></li>
              <li><Link to="/comparar" className="hover:text-accent transition-colors">Comparador</Link></li>
              <li><Link to="/recursos" className="hover:text-accent transition-colors">Recursos y Guías</Link></li>
              <li><Link to="/obituarios" className="hover:text-accent transition-colors">Obituarios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Para Funerarias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/auth?tab=register" className="hover:text-accent transition-colors">Registrar Funeraria</Link></li>
              <li><Link to="/planificador" className="hover:text-accent transition-colors">Planes y Precios</Link></li>
              <li><Link to="/asistencia" className="hover:text-accent transition-colors">Recursos</Link></li>
              <li><Link to="/asistencia" className="hover:text-accent transition-colors">Soporte</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-accent transition-colors">Contacto</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to="/privacidad" className="hover:text-accent transition-colors">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:text-accent transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ConectaFunerarias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
