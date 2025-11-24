import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terminos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground">
                Al acceder y utilizar la plataforma Sirius, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground">
                Sirius es una plataforma que conecta a familias con servicios funerarios de calidad. Facilitamos la búsqueda, comparación y contratación de servicios funerarios, así como la publicación de obituarios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Registro de Usuarios</h2>
              <p className="text-muted-foreground">
                Para acceder a ciertas funcionalidades de la plataforma, puede ser necesario registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Servicios para Funerarias</h2>
              <p className="text-muted-foreground">
                Las funerarias que se registren en nuestra plataforma deben proporcionar información precisa y actualizada sobre sus servicios. Nos reservamos el derecho de verificar la información proporcionada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Contenido del Usuario</h2>
              <p className="text-muted-foreground">
                Los usuarios son responsables del contenido que publican, incluyendo obituarios y comentarios. Nos reservamos el derecho de eliminar cualquier contenido que consideremos inapropiado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Propiedad Intelectual</h2>
              <p className="text-muted-foreground">
                Todo el contenido de la plataforma, incluyendo diseño, logotipos, texto y software, es propiedad de Sirius y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground">
                Sirius actúa como intermediario entre familias y funerarias. No somos responsables de la calidad de los servicios prestados por las funerarias registradas en nuestra plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Modificaciones</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos al ser publicados en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
              <p className="text-muted-foreground">
                Para cualquier consulta sobre estos términos, puede contactarnos a través de nuestra página de asistencia.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
