import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacidad() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
              <p className="text-muted-foreground">
                En Sirius, recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico, teléfono y otra información necesaria para proporcionar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
              <p className="text-muted-foreground">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Facilitar la conexión entre familias y funerarias</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Responder a consultas y solicitudes de soporte</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
              <p className="text-muted-foreground">
                Podemos compartir su información con:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Funerarias registradas en nuestra plataforma, cuando usted solicite sus servicios</li>
                <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Autoridades legales cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Seguridad de los Datos</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el uso de la plataforma y personalizar el contenido.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Sus Derechos</h2>
              <p className="text-muted-foreground">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Acceder a su información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Retirar el consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
              <p className="text-muted-foreground">
                Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera un período de retención más largo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cambios a esta Política</h2>
              <p className="text-muted-foreground">
                Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cambios significativos publicando la nueva política en nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
              <p className="text-muted-foreground">
                Si tiene preguntas sobre esta política de privacidad, puede contactarnos a través de nuestra página de asistencia.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
