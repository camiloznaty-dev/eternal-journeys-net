import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Memorial</h3>
            <p className="text-sm opacity-90">
              Conectando familias con servicios funerarios de calidad y dignidad.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/funerarias" className="hover:opacity-100 transition-opacity">Funerarias</Link></li>
              <li><Link to="/comparar" className="hover:opacity-100 transition-opacity">Comparador</Link></li>
              <li><Link to="/productos" className="hover:opacity-100 transition-opacity">Productos</Link></li>
              <li><Link to="/obituarios" className="hover:opacity-100 transition-opacity">Obituarios</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/nosotros" className="hover:opacity-100 transition-opacity">Nosotros</Link></li>
              <li><Link to="/contacto" className="hover:opacity-100 transition-opacity">Contacto</Link></li>
              <li><Link to="/ayuda" className="hover:opacity-100 transition-opacity">Ayuda</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/privacidad" className="hover:opacity-100 transition-opacity">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:opacity-100 transition-opacity">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} Memorial. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
