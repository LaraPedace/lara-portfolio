import universoPreview from "../assets/img/universo-preview.webp";
import microdesastrePreview from "../assets/img/microdesastre-preview.webp";
import casamorrilloPreview from "../assets/img/casamorrillo-preview.webp";
import cumbiadelolvidoPreview from "../assets/img/cumbiadelolvido-preview.webp";
import desaPreview from "../assets/img/desa-preview.webp";

// Orden = orden en que aparecen en la home.
// categoria = subtítulo de la tarjeta. preview = imagen de la tarjeta.
export const proyectos = [
  {
    id: "universo",
    titulo: "Universo",
    categoria: "Diseño Integral",
    preview: universoPreview,
    descripcion:
      "Un aula multisensorial para el aprendizaje de la lectoescritura en primer grado.",
    sobreElProyecto:
      "Inspirado en la interacción entre tecnología, pedagogía y creatividad, el espacio invita a los niños a descubrir letras, sonidos y palabras mientras exploran texturas, colores y formas que estimulan sus sentidos. Este proyecto celebra el aprendizaje como un acto de juego, conexión y descubrimiento colectivo en una experiencia envolvente.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Diseño Integral"],
    colaboracion: "c/ Jazmin Macfarlane",
    imagenes: [
      "/proyectos/universo/portada-1.jpg",
      "/proyectos/universo/portada-2.gif",
    ],
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "El proyecto se enfoca en primer grado, donde niños de entre siete y ocho años atraviesan distintos ritmos de aprendizaje. La enseñanza de la lectoescritura cuenta con escasos recursos multisensoriales y metodologías poco adaptables a las necesidades individuales, lo que puede dejar a algunos alumnos rezagados en el proceso.",
        imagenes: [
          "/proyectos/universo/contexto-1.jpg",
          "/proyectos/universo/contexto-2.jpg",
        ],
      },
      {
        titulo: "La Grilla",
        texto:
          "Una grilla modular de círculos y cuadrados da origen a la tipografía, los personajes, los íconos y la trama de la alfombra.",
        imagenes: [
          "/proyectos/universo/grilla-1.jpg",
          "/proyectos/universo/grilla-2.jpg",
        ],
      },
      {
        titulo: "Momento Escritura",
        texto:
          "Producto multisensorial diseñado para estimular el aprendizaje. Cada módulo estimula los sentidos y fomentan una escritura activa.",
        imagenes: [
          "/proyectos/universo/escritura-1.jpg",
          "/proyectos/universo/escritura-2.jpg",
          "/proyectos/universo/escritura-3.jpg",
        ],
      },
      {
        titulo: "Abecedario",
        texto:
          "Fomenta la motivación a la hora de aprender las letras del abecedario. Interactúa y propone un desafío de metas y recorridos.",
        imagenes: [
          "/proyectos/universo/abecedario-1.jpg",
          "/proyectos/universo/abecedario-2.jpg",
          "/proyectos/universo/abecedario-3.jpg",
        ],
      },
      {
        titulo: "Momento Lectura",
        texto:
          "Espacio clave en la dinámica educativa, ya que fomenta la interacción y la concentración",
        imagenes: [
          "/proyectos/universo/lectura-1.jpg",
          "/proyectos/universo/lectura-2.jpg",
          "/proyectos/universo/lectura-3.jpg",
        ],
      },
      {
        titulo: "Personajes + App",
        texto:
          "Seis personajes ilustrados para representar nuevos tópicos de la lectoescritura. Forman de una aplicación digital interactiva la lectura y la comprensión lectora. Herramienta tecnológica para utilizar en el momento de la alfombra.",
        imagenes: [
          "/proyectos/universo/personajes-1.jpg",
          "/proyectos/universo/personajes-2.jpg",
          "/proyectos/universo/personajes-3.jpg",
          "/proyectos/universo/personajes-4.jpg",
        ],
      },
    ],
  },

  {
    id: "microdesastre",
    titulo: "Microdesastre",
    categoria: "Diseño Inmersivo",
    preview: microdesastrePreview,
    descripcion: "Una sala inmersiva sobre los microplásticos.",
    sobreElProyecto:
      "A través de pantallas, luces y sonidos el espacio sumerge al visitante en un fondo marino incómodo debido a la fauna afectada por el plástico. Este proyecto busca hacer visible algo invisible.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Diseño Interactivo", "Resolume Arena", "Touch Designer"],
    colaboracion: "c/ Gonzalo Gumpel",
    imagenes: ["/proyectos/microdesastre/portada.jpg"],
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "Basado en el ODS 14, Vida Submarina. Abordamos los microplásticos, una contaminación invisible que llega del mar a nuestros platos de comida.",
        imagenes: [],
      },
      {
        titulo: "La sala",
        texto: "",
        imagenes: [
          "/proyectos/microdesastre/sala-1.jpg",
          "/proyectos/microdesastre/sala-2.jpg",
        ],
      },
      {
        titulo: "TVs",
        texto:
          "Proporcionan información para introducir al espectador en la temática. Utilización de datos y recursos gráficos para un mayor impacto.",
        imagenes: ["/proyectos/microdesastre/tvs-1.jpg"],
      },
      {
        titulo: "Cuatro botones",
        texto: "",
        imagenes: [
          "/proyectos/microdesastre/botones-1.jpg",
          "/proyectos/microdesastre/botones-2.jpg",
          "/proyectos/microdesastre/botones-3.jpg",
        ],
      },
    ],
  },

  {
    id: "casa-morrillo",
    titulo: "Casa Morrillo",
    categoria: "Branding / Identidad visual",
    preview: casamorrilloPreview,
    descripcion:
      "Un lodge poco convencional en la costa pacífica de Panamá, pensado para surfistas.",
    sobreElProyecto:
      "Identidad para un surf lodge en Panamá, pensada desde la esencia del lugar y lejos de la estética cliché. Piezas de diseño y merch aplicado.",
    anio: "2026",
    tipo: "Proyecto Personal",
    disciplinas: ["Piezas Visuales", "Fotografía"],
    colaboracion: "",
    imagenes: [
      "/proyectos/casa-morrillo/portada.jpg",
      "/proyectos/casa-morrillo/pieza-cas.jpg",
      "/proyectos/casa-morrillo/animacion-1.gif",
      "/proyectos/casa-morrillo/remera.jpg",
      "/proyectos/casa-morrillo/stickers.png",
      "/proyectos/casa-morrillo/mapa.png",
      "/proyectos/casa-morrillo/foto-1.jpg",
      "/proyectos/casa-morrillo/animacion-2.gif",
      "/proyectos/casa-morrillo/cartel-puerta.jpg",
      "/proyectos/casa-morrillo/pieza-entrada.jpg",
      "/proyectos/casa-morrillo/bitacora.jpg",
      "/proyectos/casa-morrillo/fosforos.png",
      "/proyectos/casa-morrillo/gorra.jpg",
      "/proyectos/casa-morrillo/foto-2.jpg",
      "/proyectos/casa-morrillo/postales.jpg",
    ],
    secciones: [],
  },

  {
    id: "cumbia-del-olvido",
    titulo: "Cumbia del Olvido",
    categoria: "Visuales en vivo",
    preview: cumbiadelolvidoPreview,
    descripcion: "Visuales en vivo para “Cumbia del Olvido”, de Nicola Cruz: un set creado en TouchDesigner para tocarse en tiempo real desde Resolume.",
    sobreElProyecto: "Una orquídea florece, se desarma y vuelve a encenderse siguiendo cada momento de la canción, de la intro suave al clímax.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Visuales en vivo", "Dirección de arte", "Resolume Arena", "TouchDesigner"],
    colaboracion: "",
    imagenes: [],
    secciones: [],
  },

  {
    id: "desa",
    titulo: "DESA",
    categoria: "Comunicación Institucional",
    preview: desaPreview,
    descripcion:
      "Grupo DESA (Desarrolladora Energética S.A.) dedicado a la distribución y comercialización de energía eléctrica.",
    sobreElProyecto:
      "Trabajo en el equipo de comunicación de DESA, el grupo detrás de Edea, Edelap, Eden, Edes, Edesa y Esed. Diseño para públicos muy distintos: clientes, empleados, inversores y la comunidad, cuidando que seis marcas convivan bajo un mismo sistema.",
    anio: "2026",
    tipo: "Profesional",
    disciplinas: [
      "Diseño gráfico",
      "Diseño institucional",
      "Comunicación corporativa",
    ],
    colaboracion: "",
    imagenes: ["/proyectos/desa/portada.jpg"],
    secciones: [
      {
        titulo: "Campaña: Fraude",
        texto:
          "Concientización sobre el fraude eléctrico. El desafío era hablar de un delito sin señalar a nadie: el foco está en la seguridad, en el impacto sobre la comunidad y en la denuncia anónima.",
        imagenes: [
          "/proyectos/desa/fraude-1.jpg",
          "/proyectos/desa/fraude-2.jpg",
          "/proyectos/desa/fraude-3.jpg",
          "/proyectos/desa/fraude-4.jpg",
        ],
      },
      {
        titulo: "Stickers",
        texto:
          "Plancha para Edesa y Esed: herramientas del trabajo en calle, las marcas y el claim “Somos energía que transforma”.",
        imagenes: ["/proyectos/desa/stickers.png"],
      },
      {
        titulo: "Email marketing",
        texto:
          "Comunicaciones internas por mail para todo el grupo: lanzamientos, guías prácticas y novedades. Lectura rápida y jerarquías claras.",
        imagenes: [
          "/proyectos/desa/email-1.jpg",
          "/proyectos/desa/email-2.jpg",
          "/proyectos/desa/email-3.jpg",
          "/proyectos/desa/email-4.jpg",
        ],
      },
      {
        titulo: "PRODESA 2026",
        texto:
          "Comunicaciones internas por mail para todo el grupo: lanzamientos, guías prácticas y novedades. Lectura rápida y jerarquías claras.",
        imagenes: [
          "/proyectos/desa/prodesa-1.jpg",
          "/proyectos/desa/prodesa-2.jpg",
          "/proyectos/desa/prodesa-3.jpg",
          "/proyectos/desa/prodesa-4.jpg",
        ],
      },
      {
        titulo: "One pages",
        texto:
          "Infografías de una página para resumir resultados, informes y reconocimientos: mucha información ordenada para leerse de un vistazo.",
        imagenes: [
          "/proyectos/desa/onepage-1.jpg",
          "/proyectos/desa/onepage-2.jpg",
          "/proyectos/desa/onepage-3.jpg",
        ],
      },
      {
        titulo: "Presentaciones",
        texto:
          "Diseño de las presentaciones de dos campañas - Activá Tu Modo Eficiente y Programa de Oficios para los Premios Eikon 2026.",
        imagenes: [
          "/proyectos/desa/presentacion-1.jpg",
          "/proyectos/desa/presentacion-2.jpg",
        ],
      },
    ],
  },
];
