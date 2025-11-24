import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogDetalle() {
  const { id } = useParams();

  // Datos de ejemplo - en producción vendrían de la base de datos
  const posts = {
    "1": {
      title: "Cómo planificar un servicio funerario con anticipación",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "15 de Marzo, 2024",
      tiempo: "5 min",
      imagen: "https://images.unsplash.com/photo-1513628253939-010e64ac66cd?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>Planificar un servicio funerario con anticipación puede parecer una tarea difícil o incómoda, pero es una de las decisiones más consideradas que puedes tomar por tus seres queridos.</p>
        
        <h2>¿Por qué planificar con anticipación?</h2>
        <p>La planificación anticipada alivia significativamente la carga emocional y financiera de tu familia en momentos de duelo. Cuando todo está organizado previamente, tus seres queridos pueden enfocarse en el proceso de sanación sin tener que tomar decisiones difíciles bajo presión.</p>
        
        <h2>Pasos para la planificación</h2>
        <ol>
          <li><strong>Define tus preferencias:</strong> ¿Prefieres cremación o sepultura tradicional? ¿Qué tipo de ceremonia te gustaría?</li>
          <li><strong>Establece un presupuesto:</strong> Investiga los costos promedio y decide cuánto estás dispuesto a invertir.</li>
          <li><strong>Selecciona un proveedor:</strong> Compara funerarias y elige una que se ajuste a tus necesidades y valores.</li>
          <li><strong>Documenta tus decisiones:</strong> Asegúrate de que tu familia conozca tus deseos y tenga acceso a la documentación necesaria.</li>
        </ol>
        
        <h2>Beneficios económicos</h2>
        <p>Planificar con anticipación también puede resultar en ahorros significativos. Al prepagar servicios, puedes protegerte contra futuros aumentos de precios y evitar decisiones apresuradas que podrían resultar más costosas.</p>
        
        <h2>Consideraciones legales</h2>
        <p>Es importante incluir tus deseos funerarios en tu testamento o dejar instrucciones claras con tu familia. Esto asegura que tus decisiones sean respetadas y seguidas.</p>
        
        <p>En Sirius, estamos aquí para ayudarte en cada paso del proceso. Nuestro equipo puede asesorarte sobre las mejores opciones según tus necesidades y presupuesto.</p>
      `
    },
    "2": {
      title: "Diferencias entre cremación y sepultura tradicional",
      categoria: "Educación",
      autor: "Equipo Sirius",
      fecha: "10 de Marzo, 2024",
      tiempo: "7 min",
      imagen: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>Una de las decisiones más importantes al planificar un servicio funerario es elegir entre cremación y sepultura tradicional. Ambas opciones tienen sus propias ventajas y consideraciones.</p>
        
        <h2>Cremación</h2>
        <p>La cremación es un proceso en el que el cuerpo es reducido a cenizas mediante calor intenso. Esta opción ha ganado popularidad en los últimos años por varias razones:</p>
        
        <h3>Ventajas de la cremación:</h3>
        <ul>
          <li>Generalmente más económica que la sepultura tradicional</li>
          <li>Mayor flexibilidad en cuanto a ceremonias y servicios</li>
          <li>Las cenizas pueden conservarse, dispersarse o enterrarse según los deseos</li>
          <li>Menor impacto ambiental comparado con la sepultura tradicional</li>
          <li>No requiere compra de terreno en cementerio</li>
        </ul>
        
        <h2>Sepultura tradicional</h2>
        <p>La sepultura tradicional implica el entierro del cuerpo en un ataúd dentro de un cementerio. Esta ha sido la opción más común históricamente.</p>
        
        <h3>Ventajas de la sepultura tradicional:</h3>
        <ul>
          <li>Proporciona un lugar físico específico para visitar y recordar</li>
          <li>Respeta tradiciones culturales y religiosas específicas</li>
          <li>Puede incluir monumentos o lápidas personalizadas</li>
          <li>Algunas personas encuentran consuelo en saber exactamente dónde está su ser querido</li>
        </ul>
        
        <h2>Consideraciones para tu decisión</h2>
        <p>Al tomar esta decisión, considera los siguientes factores:</p>
        
        <h3>Presupuesto</h3>
        <p>La cremación suele costar entre el 40-60% menos que una sepultura tradicional completa, aunque los precios varían según la región y los servicios adicionales.</p>
        
        <h3>Creencias religiosas y culturales</h3>
        <p>Algunas religiones tienen preferencias específicas. Es importante consultar con líderes religiosos si esto es relevante para ti o tu familia.</p>
        
        <h3>Impacto ambiental</h3>
        <p>Ambas opciones tienen impactos ambientales diferentes. La cremación consume energía pero no usa terreno, mientras que la sepultura tradicional requiere espacio pero no consume combustible.</p>
        
        <h2>Opciones híbridas</h2>
        <p>Algunas familias optan por combinar elementos de ambas opciones, como realizar una ceremonia tradicional seguida de cremación, o enterrar las cenizas en un cementerio.</p>
        
        <p>No hay una respuesta correcta o incorrecta. La decisión debe basarse en tus valores personales, creencias, presupuesto y lo que consideres mejor para ti y tu familia.</p>
      `
    },
    "3": {
      title: "La importancia de los obituarios en el proceso de duelo",
      categoria: "Duelo",
      autor: "Equipo Sirius",
      fecha: "5 de Marzo, 2024",
      tiempo: "4 min",
      imagen: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>Los obituarios son mucho más que simples anuncios de fallecimiento. Son tributos que celebran la vida de una persona y cumplen funciones importantes tanto para la familia como para la comunidad.</p>
        
        <h2>¿Qué es un obituario?</h2>
        <p>Un obituario es un anuncio público que informa sobre el fallecimiento de una persona e incluye información biográfica, logros significativos, y detalles sobre los servicios funerarios.</p>
        
        <h2>Funciones principales</h2>
        
        <h3>1. Informar a la comunidad</h3>
        <p>Los obituarios notifican a amigos, conocidos y a la comunidad en general sobre el fallecimiento, permitiendo que las personas puedan presentar sus condolencias y asistir a los servicios.</p>
        
        <h3>2. Celebrar una vida</h3>
        <p>Más allá de informar sobre la muerte, los obituarios celebran la vida del fallecido, destacando sus logros, pasiones, relaciones y el legado que deja.</p>
        
        <h3>3. Ayuda en el proceso de duelo</h3>
        <p>Escribir y leer obituarios puede ser terapéutico. Para la familia, escribir sobre su ser querido ayuda a procesar la pérdida. Para los lectores, proporciona contexto y validación de su propia tristeza.</p>
        
        <h2>Elementos de un buen obituario</h2>
        
        <ul>
          <li><strong>Información básica:</strong> Nombre completo, edad, fecha y lugar de fallecimiento</li>
          <li><strong>Historia de vida:</strong> Hitos importantes, carrera profesional, educación</li>
          <li><strong>Personalidad y pasiones:</strong> Hobbies, intereses, rasgos de carácter</li>
          <li><strong>Relaciones significativas:</strong> Familiares sobrevivientes y predecesor</li>
          <li><strong>Detalles del servicio:</strong> Fecha, hora y lugar de las ceremonias</li>
          <li><strong>Instrucciones especiales:</strong> Preferencias sobre flores, donaciones, etc.</li>
        </ul>
        
        <h2>Obituarios digitales modernos</h2>
        <p>En la era digital, los obituarios online ofrecen ventajas adicionales:</p>
        
        <ul>
          <li>Accesibilidad permanente y desde cualquier lugar</li>
          <li>Posibilidad de incluir fotos y videos</li>
          <li>Espacio para que amigos y familiares compartan recuerdos</li>
          <li>Libro de condolencias virtual</li>
          <li>Fácil compartición en redes sociales</li>
        </ul>
        
        <h2>Consejos para escribir un obituario</h2>
        
        <ol>
          <li><strong>Sé auténtico:</strong> Escribe desde el corazón, capturando la esencia real de la persona</li>
          <li><strong>Incluye anécdotas:</strong> Las historias personales hacen el obituario memorable</li>
          <li><strong>Revisa cuidadosamente:</strong> Verifica fechas, nombres y detalles importantes</li>
          <li><strong>Considera el tono:</strong> Puede ser solemne, alegre o una mezcla, según la personalidad del fallecido</li>
          <li><strong>No olvides agradecer:</strong> Menciona al personal médico, cuidadores o personas especiales</li>
        </ol>
        
        <p>Un obituario bien escrito es un regalo tanto para el fallecido como para quienes lo conocieron. Es una forma de asegurar que su legado continúe y que su historia sea recordada con amor y respeto.</p>
      `
    },
    "4": {
      title: "Cómo comparar precios de servicios funerarios",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "1 de Marzo, 2024",
      tiempo: "6 min",
      imagen: "https://images.unsplash.com/photo-1518831959410-48a934f51e86?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>Comparar precios de servicios funerarios puede parecer abrumador, especialmente durante momentos de duelo. Esta guía te ayudará a entender los costos y tomar decisiones informadas.</p>
        
        <h2>Por qué varían los precios</h2>
        <p>Los costos de servicios funerarios pueden variar significativamente debido a varios factores:</p>
        <ul>
          <li>Ubicación geográfica</li>
          <li>Tipo de servicio (cremación vs. sepultura)</li>
          <li>Calidad de productos (ataúd, urna, etc.)</li>
          <li>Servicios adicionales incluidos</li>
          <li>Reputación y tamaño de la funeraria</li>
        </ul>
        
        <h2>Componentes principales del costo</h2>
        
        <h3>1. Servicios básicos de la funeraria</h3>
        <p>Incluye el personal, instalaciones, traslado del cuerpo y coordinación general. Este suele ser un cargo fijo.</p>
        
        <h3>2. Preparación del cuerpo</h3>
        <p>Embalsamamiento, vestimenta, maquillaje y otros servicios de preparación. No siempre es necesario.</p>
        
        <h3>3. Ataúd o urna</h3>
        <p>Los precios varían enormemente según el material y diseño. Las funerarias deben mostrar todos los rangos de precio.</p>
        
        <h3>4. Uso de instalaciones</h3>
        <p>Sala de velación, capilla para servicios, equipamiento para ceremonias.</p>
        
        <h3>5. Transporte</h3>
        <p>Carroza fúnebre, vehículos de acompañamiento, traslados adicionales.</p>
        
        <h3>6. Sepultura o cremación</h3>
        <p>El proceso de cremación o los costos del cementerio (terreno, apertura y cierre de tumba).</p>
        
        <h2>Cómo comparar efectivamente</h2>
        
        <h3>Solicita listas de precios detalladas</h3>
        <p>Por ley, las funerarias deben proporcionar listas de precios. Solicítalas antes de comprometerte.</p>
        
        <h3>Compara servicios similares</h3>
        <p>Asegúrate de comparar paquetes con servicios equivalentes. Un precio más bajo podría excluir servicios importantes.</p>
        
        <h3>Pregunta sobre cargos adicionales</h3>
        <p>Algunos costos pueden no estar incluidos en el precio base:</p>
        <ul>
          <li>Certificados de defunción adicionales</li>
          <li>Flores y arreglos florales</li>
          <li>Avisos en periódicos</li>
          <li>Libro de condolencias</li>
          <li>Procesamiento de documentos</li>
        </ul>
        
        <h2>Rangos de precios promedio en Chile</h2>
        
        <h3>Servicio de cremación básico</h3>
        <p>$800.000 - $2.500.000 CLP</p>
        
        <h3>Servicio de sepultura tradicional</h3>
        <p>$1.500.000 - $5.000.000+ CLP</p>
        
        <h3>Servicio completo premium</h3>
        <p>$3.000.000 - $10.000.000+ CLP</p>
        
        <p><em>Nota: Estos son rangos aproximados y pueden variar según la región y servicios específicos.</em></p>
        
        <h2>Consejos para ahorrar</h2>
        
        <ol>
          <li><strong>Planifica con anticipación:</strong> Los precios suelen ser más favorables cuando no hay urgencia</li>
          <li><strong>Considera opciones directas:</strong> Cremación o sepultura directa sin servicios ceremoniales puede ser significativamente más económico</li>
          <li><strong>Personaliza el paquete:</strong> En lugar de aceptar un paquete predefinido, elige solo los servicios que realmente necesitas</li>
          <li><strong>Compra productos por separado:</strong> Ataúdes y urnas pueden comprarse de proveedores externos</li>
          <li><strong>Pregunta por asistencia financiera:</strong> Algunas organizaciones ofrecen ayuda para costos funerarios</li>
        </ol>
        
        <h2>Banderas rojas</h2>
        <p>Ten cuidado con:</p>
        <ul>
          <li>Funerarias que se niegan a proporcionar listas de precios</li>
          <li>Presión para tomar decisiones inmediatas</li>
          <li>Cargos no explicados o "costos ocultos"</li>
          <li>Promesas que parecen demasiado buenas para ser verdad</li>
        </ul>
        
        <p>Recuerda: está bien tomarse tiempo para comparar opciones. Las funerarias reputables entenderán tu necesidad de considerar diferentes alternativas antes de decidir.</p>
      `
    },
    "5": {
      title: "Tendencias modernas en servicios funerarios",
      categoria: "Tendencias",
      autor: "Equipo Sirius",
      fecha: "25 de Febrero, 2024",
      tiempo: "8 min",
      imagen: "https://images.unsplash.com/photo-1486591038957-19e7c73bdc41?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>La industria funeraria está experimentando una transformación significativa. Las nuevas generaciones están buscando alternativas que reflejen mejor sus valores y creencias personales.</p>
        
        <h2>1. Servicios funerarios ecológicos</h2>
        <p>La sostenibilidad ambiental se ha convertido en una prioridad para muchas familias.</p>
        
        <h3>Opciones verdes incluyen:</h3>
        <ul>
          <li><strong>Ataúdes biodegradables:</strong> Fabricados con materiales naturales como bambú, mimbre o cartón</li>
          <li><strong>Sepultura natural:</strong> Entierros sin embalsamamiento en áreas designadas de conservación</li>
          <li><strong>Cremación acuática:</strong> También conocida como hidrólisis alcalina, usa menos energía que la cremación tradicional</li>
          <li><strong>Urnas biodegradables:</strong> Diseñadas para convertirse en árboles o desintegrarse naturalmente</li>
        </ul>
        
        <h2>2. Personalización extrema</h2>
        <p>Las familias buscan cada vez más servicios únicos que reflejen la personalidad del fallecido.</p>
        
        <h3>Ejemplos de personalización:</h3>
        <ul>
          <li>Ceremonias temáticas basadas en pasatiempos o intereses</li>
          <li>Ataúdes personalizados con diseños artísticos</li>
          <li>Videos conmemorativos profesionales</li>
          <li>Espacios de memoria interactivos</li>
          <li>Música y entretenimiento personalizado</li>
        </ul>
        
        <h2>3. Tecnología digital</h2>
        <p>La tecnología está transformando cómo recordamos y honramos a nuestros seres queridos.</p>
        
        <h3>Innovaciones digitales:</h3>
        <ul>
          <li><strong>Streaming de servicios:</strong> Permite que familiares distantes participen virtualmente</li>
          <li><strong>Memoriales online:</strong> Páginas web dedicadas con fotos, videos y testimonios</li>
          <li><strong>Códigos QR en lápidas:</strong> Vinculan a biografías digitales completas</li>
          <li><strong>Libros de condolencias virtuales:</strong> Permiten mensajes desde cualquier parte del mundo</li>
          <li><strong>Realidad virtual:</strong> Recreaciones de lugares significativos para el fallecido</li>
        </ul>
        
        <h2>4. Celebraciones de vida</h2>
        <p>El enfoque está cambiando de servicios solemnes a celebraciones alegres de la vida vivida.</p>
        
        <h3>Características:</h3>
        <ul>
          <li>Tono más alegre y optimista</li>
          <li>Énfasis en historias y anécdotas positivas</li>
          <li>Comida y bebidas como en una celebración</li>
          <li>Actividades interactivas para los asistentes</li>
          <li>Música animada y favorita del fallecido</li>
        </ul>
        
        <h2>5. Opciones de memorialización creativa</h2>
        <p>Las cenizas ya no se limitan a urnas tradicionales en casa o dispersión.</p>
        
        <h3>Alternativas innovadoras:</h3>
        <ul>
          <li><strong>Joyería conmemorativa:</strong> Pequeñas porciones de cenizas en colgantes o anillos</li>
          <li><strong>Diamantes sintéticos:</strong> Cenizas transformadas en gemas</li>
          <li><strong>Arrecifes artificiales:</strong> Cenizas incorporadas en estructuras submarinas</li>
          <li><strong>Fuegos artificiales:</strong> Cenizas lanzadas en espectáculos pirotécnicos</li>
          <li><strong>Vinilo conmemorativo:</strong> Cenizas prensadas en discos de vinilo con música favorita</li>
        </ul>
        
        <h2>6. Pre-planificación digital</h2>
        <p>Las plataformas online facilitan la planificación anticipada de servicios funerarios.</p>
        
        <h3>Beneficios:</h3>
        <ul>
          <li>Comparación fácil de precios y servicios</li>
          <li>Documentación digital de deseos</li>
          <li>Actualización flexible de preferencias</li>
          <li>Acceso familiar a planes y documentos</li>
        </ul>
        
        <h2>7. Transparencia de precios</h2>
        <p>La era digital ha forzado mayor transparencia en una industria tradicionalmente opaca.</p>
        
        <h3>Cambios notables:</h3>
        <ul>
          <li>Precios publicados online</li>
          <li>Comparadores de servicios funerarios</li>
          <li>Reseñas y calificaciones públicas</li>
          <li>Desglose detallado de costos</li>
        </ul>
        
        <h2>8. Servicios de duelo extendido</h2>
        <p>Las funerarias están expandiendo sus servicios más allá del servicio inicial.</p>
        
        <h3>Servicios adicionales:</h3>
        <ul>
          <li>Grupos de apoyo para el duelo</li>
          <li>Consejería profesional</li>
          <li>Seguimiento a largo plazo con familias</li>
          <li>Recursos educativos sobre el duelo</li>
          <li>Eventos conmemorativos anuales</li>
        </ul>
        
        <h2>El futuro</h2>
        <p>Se espera que estas tendencias continúen evolucionando:</p>
        <ul>
          <li>Mayor énfasis en sostenibilidad</li>
          <li>Integración de inteligencia artificial</li>
          <li>Hologramas y avatares digitales</li>
          <li>Experiencias inmersivas de realidad virtual</li>
          <li>Nuevas formas de preservación de legados</li>
        </ul>
        
        <p>Estas tendencias reflejan un cambio hacia servicios funerarios más personalizados, accesibles y significativos que honran la individualidad de cada persona mientras brindan consuelo a sus seres queridos.</p>
      `
    },
    "6": {
      title: "Guía completa sobre documentación funeraria necesaria",
      categoria: "Guías",
      autor: "Equipo Sirius",
      fecha: "20 de Febrero, 2024",
      tiempo: "10 min",
      imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format&fit=crop",
      contenido: `
        <p>Organizar un servicio funerario requiere una cantidad considerable de documentación. Esta guía te ayudará a entender qué documentos necesitas y cómo obtenerlos.</p>
        
        <h2>Documentos inmediatos necesarios</h2>
        
        <h3>1. Certificado médico de defunción</h3>
        <p>Este es el primer documento crítico que necesitarás.</p>
        
        <h4>¿Quién lo emite?</h4>
        <ul>
          <li>Médico tratante (si falleció bajo atención médica)</li>
          <li>Médico del Servicio Médico Legal (en casos de muerte súbita o sospechosa)</li>
        </ul>
        
        <h4>Información incluida:</h4>
        <ul>
          <li>Datos personales del fallecido</li>
          <li>Fecha, hora y lugar de fallecimiento</li>
          <li>Causa de muerte</li>
          <li>Firma y timbre del médico</li>
        </ul>
        
        <h3>2. Carnet de identidad del fallecido</h3>
        <p>Necesario para todos los trámites legales y administrativos. Si no lo tienes, se puede solicitar un certificado de vigencia en el Registro Civil.</p>
        
        <h2>Documentos del Registro Civil</h2>
        
        <h3>Inscripción de defunción</h3>
        <p>Debe realizarse dentro de las 48 horas siguientes al fallecimiento.</p>
        
        <h4>Documentos necesarios:</h4>
        <ul>
          <li>Certificado médico de defunción</li>
          <li>Carnet de identidad del fallecido</li>
          <li>Carnet de identidad de quien inscribe (familiar o representante)</li>
          <li>Certificado de matrimonio (si corresponde)</li>
        </ul>
        
        <h4>¿Dónde inscribir?</h4>
        <ul>
          <li>En cualquier oficina del Registro Civil e Identificación</li>
          <li>La funeraria generalmente puede hacer este trámite por ti</li>
        </ul>
        
        <h3>Certificado de defunción</h3>
        <p>Una vez inscrita la defunción, puedes solicitar certificados oficiales.</p>
        
        <h4>¿Cuántos necesitas?</h4>
        <p>Generalmente necesitarás múltiples copias para:</p>
        <ul>
          <li>Bancos y instituciones financieras</li>
          <li>Compañías de seguros</li>
          <li>AFP o institución previsional</li>
          <li>Empresas de servicios (agua, luz, etc.)</li>
          <li>Notarías (para trámites de herencia)</li>
          <li>Trámites de vehículos</li>
          <li>Propiedades</li>
        </ul>
        
        <p><strong>Consejo:</strong> Solicita al menos 10-15 copias inicialmente. Es más fácil tenerlas de inmediato que solicitarlas después.</p>
        
        <h2>Documentos para sepultura o cremación</h2>
        
        <h3>Para sepultura en cementerio:</h3>
        <ul>
          <li>Certificado de defunción</li>
          <li>Permiso de inhumación del cementerio</li>
          <li>Documentos de propiedad del terreno (si ya lo tienes)</li>
          <li>Contrato de compra de sitio (si lo vas a adquirir)</li>
        </ul>
        
        <h3>Para cremación:</h3>
        <ul>
          <li>Certificado de defunción</li>
          <li>Autorización judicial (solo si el Médico Legal lo requiere)</li>
          <li>Autorización firmada por familiar directo</li>
          <li>Formulario del crematorio completado</li>
        </ul>
        
        <h2>Documentos previsionales</h2>
        
        <h3>Cuota mortuoria</h3>
        <p>Beneficio que pueden cobrar los causahabientes del fallecido.</p>
        
        <h4>Documentos necesarios:</h4>
        <ul>
          <li>Certificado de defunción</li>
          <li>Carnet de identidad del solicitante</li>
          <li>Certificado de matrimonio o nacimiento (según corresponda)</li>
          <li>Último recibo de pensión o AFP</li>
          <li>Factura de gastos funerarios</li>
        </ul>
        
        <h4>¿Dónde solicitarla?</h4>
        <ul>
          <li>AFP del fallecido (si estaba cotizando)</li>
          <li>IPS (si era pensionado)</li>
          <li>Capredena o Dipreca (si era de FF.AA. o Carabineros)</li>
        </ul>
        
        <h2>Documentos de seguros</h2>
        
        <h3>Seguro de vida o sepelio</h3>
        <p>Si el fallecido tenía seguros, necesitarás:</p>
        <ul>
          <li>Póliza de seguro</li>
          <li>Certificado de defunción</li>
          <li>Carnet de identidad del beneficiario</li>
          <li>Formulario de siniestro de la compañía</li>
          <li>Certificado médico de defunción (original)</li>
          <li>Certificado de últimas voluntades (en algunos casos)</li>
        </ul>
        
        <h2>Documentos para trámites posteriores</h2>
        
        <h3>Posesión efectiva (herencia)</h3>
        <p>Si hay bienes que heredar:</p>
        <ul>
          <li>Certificado de defunción</li>
          <li>Testamento (si existe)</li>
          <li>Certificados de nacimiento de herederos</li>
          <li>Inventario de bienes</li>
          <li>Certificados de dominio vigente de propiedades</li>
        </ul>
        
        <h3>Cierre de cuentas bancarias</h3>
        <ul>
          <li>Certificado de defunción</li>
          <li>Poder notarial o posesión efectiva</li>
          <li>Identificación de quien realiza el trámite</li>
          <li>Cartolas o información de cuentas</li>
        </ul>
        
        <h2>Checklist de documentación</h2>
        
        <h3>Inmediatamente después del fallecimiento:</h3>
        <ol>
          <li>☐ Certificado médico de defunción</li>
          <li>☐ Carnet de identidad del fallecido</li>
          <li>☐ Inscripción de defunción en Registro Civil</li>
          <li>☐ 10-15 certificados de defunción</li>
        </ol>
        
        <h3>Primeras semanas:</h3>
        <ol>
          <li>☐ Solicitud de cuota mortuoria</li>
          <li>☐ Notificación a compañías de seguros</li>
          <li>☐ Notificación a bancos</li>
          <li>☐ Notificación a AFP</li>
          <li>☐ Cambio de titularidad en servicios básicos</li>
        </ol>
        
        <h3>Primeros meses:</h3>
        <ol>
          <li>☐ Inicio de trámites de herencia</li>
          <li>☐ Cierre de cuentas bancarias</li>
          <li>☐ Transferencia de vehículos</li>
          <li>☐ Transferencia de propiedades</li>
        </ol>
        
        <h2>Consejos importantes</h2>
        
        <ol>
          <li><strong>Organiza todo en una carpeta:</strong> Mantén todos los documentos juntos y ordenados</li>
          <li><strong>Haz copias digitales:</strong> Escanea todos los documentos importantes</li>
          <li><strong>Mantén un registro:</strong> Anota fechas de solicitudes y plazos de respuesta</li>
          <li><strong>Solicita ayuda profesional:</strong> La funeraria o un abogado pueden facilitar muchos trámites</li>
          <li><strong>No te apresures en firmar:</strong> Lee cuidadosamente antes de firmar cualquier documento</li>
          <li><strong>Verifica plazos:</strong> Algunos trámites tienen límites de tiempo específicos</li>
        </ol>
        
        <h2>¿Necesitas ayuda?</h2>
        <p>En Sirius, ofrecemos asesoría completa con toda la documentación necesaria. Nuestro equipo puede:</p>
        <ul>
          <li>Gestionar la inscripción en el Registro Civil</li>
          <li>Obtener los certificados necesarios</li>
          <li>Asesorarte en trámites previsionales</li>
          <li>Coordinar con compañías de seguros</li>
          <li>Orientarte en procesos de herencia</li>
        </ul>
        
        <p>No dudes en contactarnos si necesitas apoyo en estos procesos. Estamos aquí para hacer este momento lo más llevadero posible.</p>
      `
    }
  };

  const post = posts[id as keyof typeof posts];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="h-48 sm:h-64 md:h-80 lg:h-[400px] relative overflow-hidden">
          <img
            src={post.imagen}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-32 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-elegant bg-background/95 backdrop-blur">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-16 xl:p-20">
                {/* Back button */}
                <Button variant="ghost" size="sm" className="mb-4 sm:mb-6" asChild>
                  <Link to="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Volver al Blog</span>
                    <span className="sm:hidden">Volver</span>
                  </Link>
                </Button>

                {/* Categoria */}
                <Badge className="mb-3 sm:mb-4 text-xs sm:text-sm">{post.categoria}</Badge>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 md:mb-12 pb-6 sm:pb-8 md:pb-10 border-b-2 border-border/50">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">{post.autor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{post.fecha}</span>
                    <span className="sm:hidden">{post.fecha.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{post.tiempo}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="ml-auto hover:bg-primary/10"
                  >
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="hidden sm:inline">Compartir</span>
                    <span className="sm:hidden">📤</span>
                  </Button>
                </div>

                {/* Content */}
                <article 
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                    prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 lg:prose-h2:mt-16 prose-h2:mb-4 sm:prose-h2:mb-6 lg:prose-h2:mb-8 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                    prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 lg:prose-h3:mt-12 prose-h3:mb-3 sm:prose-h3:mb-4 lg:prose-h3:mb-6 prose-h3:text-primary
                    prose-h4:text-base sm:prose-h4:text-lg lg:prose-h4:text-xl prose-h4:mt-4 sm:prose-h4:mt-6 lg:prose-h4:mt-8 prose-h4:mb-3 sm:prose-h4:mb-4 prose-h4:font-semibold
                    prose-p:text-foreground prose-p:mb-4 sm:prose-p:mb-6 lg:prose-p:mb-8 prose-p:leading-[1.7] sm:prose-p:leading-[1.8] prose-p:text-sm sm:prose-p:text-base lg:prose-p:text-[17px]
                    prose-ul:my-4 sm:prose-ul:my-6 lg:prose-ul:my-8 prose-ul:space-y-2 sm:prose-ul:space-y-3 prose-ul:text-foreground
                    prose-ol:my-4 sm:prose-ol:my-6 lg:prose-ol:my-8 prose-ol:space-y-2 sm:prose-ol:space-y-3 prose-ol:text-foreground
                    prose-li:leading-[1.6] sm:prose-li:leading-[1.7] prose-li:text-sm sm:prose-li:text-base lg:prose-li:text-[17px] prose-li:pl-1 sm:prose-li:pl-2
                    prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-primary/90
                    prose-a:text-primary prose-a:underline prose-a:decoration-primary/30 hover:prose-a:decoration-primary
                    prose-em:text-muted-foreground prose-em:italic
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-4 sm:prose-blockquote:my-6 lg:prose-blockquote:my-8
                    [&>p:first-of-type]:text-base sm:[&>p:first-of-type]:text-lg lg:[&>p:first-of-type]:text-[19px] [&>p:first-of-type]:leading-[1.8] sm:[&>p:first-of-type]:leading-[1.9] [&>p:first-of-type]:font-normal [&>p:first-of-type]:text-muted-foreground
                    dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.contenido }}
                />

                {/* Share section */}
                <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-10 border-t-2 border-border/50">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-base sm:text-lg font-semibold mb-2">¿Te resultó útil este artículo?</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Compártelo con quienes puedan necesitar esta información
                      </p>
                    </div>
                    <Button onClick={handleShare} size="sm" className="gap-2 w-full sm:w-auto">
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Compartir artículo</span>
                      <span className="sm:hidden">Compartir</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related posts */}
            <div className="mt-8 sm:mt-12 lg:mt-16 mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 sm:mb-8">Artículos relacionados</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(posts)
                  .filter(([postId]) => postId !== id)
                  .slice(0, 2)
                  .map(([postId, relatedPost]) => (
                    <Link key={postId} to={`/blog/${postId}`}>
                      <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={relatedPost.imagen}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="mb-2">
                            {relatedPost.categoria}
                          </Badge>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{relatedPost.tiempo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{relatedPost.fecha}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
