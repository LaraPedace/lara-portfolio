import universoPreview from "../assets/img/universo-preview.webp";
import microdesastrePreview from "../assets/img/microdesastre-preview.mp4";
import casamorrilloPreview from "../assets/img/casamorrillo-preview.webp";
import cumbiadelolvidoPreview from "../assets/img/cumbia-preview.mp4";
import desaPreview from "../assets/img/desa-preview.webp";
import galoPreview from "../assets/img/galo-preview.webp";

// Todas las imágenes, gifs y videos de las carpetas de cada proyecto (src/assets/img/<carpeta>/).
// Vite las carga de una vez; acá cada una se pide por su ruta con m("carpeta/archivo").
const archivos = import.meta.glob("../assets/img/*/*.{webp,jpg,jpeg,png,gif,mp4}", {
  eager: true,
  import: "default",
});

// Devuelve la URL de un archivo. Si el nombre está mal escrito, avisa (en vez de mostrar
// una imagen rota sin que nadie se dé cuenta).
function m(ruta) {
  const url = archivos[`../assets/img/${ruta}`];
  if (!url) throw new Error(`proyectos.js: no existe el archivo "src/assets/img/${ruta}"`);
  return url;
}

// Orden = orden en que aparecen en la home.
// categoria = subtítulo de la tarjeta. preview = imagen (o video .mp4) de la tarjeta.
// imagenes = lo que va arriba de todo en la página del proyecto (portada).
// secciones = bloques de la página, cada uno con su título, texto e imágenes.
// En "imagenes" puede haber imágenes (.webp/.jpg/.png), gifs o videos (.mp4): la página
// decide cómo mostrar cada uno según la extensión.
export const proyectos = [
  {
    id: "universo",
    titulo: "Universo",
    categoria: "Diseño Integral",
    preview: universoPreview,
    descripcion:
      "Un aula multisensorial para el aprendizaje de la lectoescritura en primer grado. Inspirado en la interacción entre tecnología, pedagogía y creatividad.",
    sobreElProyecto:
      "Inspirado en la interacción entre tecnología, pedagogía y creatividad, el espacio invita a los niños a descubrir letras, sonidos y palabras mientras exploran texturas, colores y formas que estimulan sus sentidos. Este proyecto celebra el aprendizaje como un acto de juego, conexión y descubrimiento colectivo en una experiencia envolvente.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Diseño Integral"],
    colaboracion: "c/ Jazmin Macfarlane",
    imagenes: [m("universo/universo_1.webp"), m("universo/universo.gif")],
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "El proyecto se enfoca en primer grado, donde niños de entre siete y ocho años atraviesan distintos ritmos de aprendizaje. La enseñanza de la lectoescritura cuenta con escasos recursos multisensoriales y metodologías poco adaptables a las necesidades individuales, lo que puede dejar a algunos alumnos rezagados en el proceso.",
        imagenes: [m("universo/universo_2.webp"), m("universo/universo_3.webp")],
      },
      {
        titulo: "La Grilla",
        texto:
          "Una grilla modular de círculos y cuadrados da origen a la tipografía, los personajes, los íconos y la trama de la alfombra.",
        imagenes: [m("universo/universo_4.webp"), m("universo/universo_5.webp")],
      },
      {
        titulo: "Momento Escritura",
        texto:
          "Producto multisensorial diseñado para estimular el aprendizaje. Cada módulo estimula los sentidos y fomentan una escritura activa.",
        imagenes: [
          m("universo/universo_6.webp"),
          m("universo/universo_7.webp"),
          m("universo/universo_8.webp"),
          m("universo/universo_despiece.mp4"),
        ],
      },
      {
        titulo: "Abecedario",
        texto:
          "Fomenta la motivación a la hora de aprender las letras del abecedario. Interactúa y propone un desafío de metas y recorridos.",
        imagenes: [
          m("universo/universo_9.webp"),
          m("universo/universo_10.webp"),
          m("universo/universo_11.webp"),
          m("universo/universo_12.webp"),
        ],
      },
      {
        titulo: "Momento Lectura",
        texto:
          "Espacio clave en la dinámica educativa, ya que fomenta la interacción y la concentración",
        imagenes: [
          m("universo/universo_13.webp"),
          m("universo/universo_14.webp"),
          m("universo/universo_15.webp"),
        ],
      },
      {
        titulo: "Personajes + App",
        texto:
          "Seis personajes ilustrados para representar nuevos tópicos de la lectoescritura. Forman de una aplicación digital interactiva la lectura y la comprensión lectora. Herramienta tecnológica para utilizar en el momento de la alfombra.",
        imagenes: [
          m("universo/universo_16.webp"),
          m("universo/universo_17.webp"),
          m("universo/universo_18.webp"),
          m("universo/universo_19.webp"),
          m("universo/universo_20.webp"),
        ],
      },
    ],
  },

  {
    id: "microdesastre",
    titulo: "Microdesastre",
    categoria: "Diseño Inmersivo",
    preview: microdesastrePreview,
    descripcion:
      "Basado en el ODS 14, Vida Submarina. Abordamos los microplásticos, una contaminación invisible que llega del mar a nuestros platos de comida.",
    sobreElProyecto:
      "A través de pantallas, luces y sonidos el espacio sumerge al visitante en un fondo marino incómodo debido a la fauna afectada por el plástico. Este proyecto busca hacer visible algo invisible.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Diseño Interactivo", "Resolume Arena", "Touch Designer"],
    colaboracion: "c/ Gonzalo Gumpel",
    imagenes: [m("microdesastre/micro_1.webp")],
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "Basado en el ODS 14, Vida Submarina. Abordamos los microplásticos, una contaminación invisible que llega del mar a nuestros platos de comida.",
        imagenes: [m("microdesastre/micro_video_3.mp4"), m("microdesastre/micro_4.webp")],
      },
      {
        titulo: "La sala",
        texto: "",
        imagenes: [
          m("microdesastre/micro_2.webp"),
          m("microdesastre/micro_video_1.mp4"),
          m("microdesastre/micro_3_facetracking.webp"),
          m("microdesastre/micro_video_2.mp4"),
        ],
      },
      {
        titulo: "TVs",
        texto:
          "Proporcionan información para introducir al espectador en la temática. Utilización de datos y recursos gráficos para un mayor impacto.",
        imagenes: [
          m("microdesastre/micro_monitor_0.mp4"),
          m("microdesastre/micro_monitor_1.mp4"),
          m("microdesastre/micro_monitor_2.mp4"),
          m("microdesastre/micro_monitor_3.mp4"),
        ],
      },
      {
        titulo: "Cuatro botones",
        texto: "",
        imagenes: [
          m("microdesastre/micro_boton_0.mp4"),
          m("microdesastre/micro_boton_1_fauna.mp4"),
          m("microdesastre/micro_boton_2_tiempo.mp4"),
          m("microdesastre/micro_boton_3_juegos.mp4"),
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
    // Sin secciones: todas las piezas van en una sola secuencia
    imagenes: [
      m("casa_morrillo/morrillo_1.webp"), // paisaje (portada)
      m("casa_morrillo/morrillo_2.webp"), // afiche
      m("casa_morrillo/morrillo_gif_1.gif"), // surf
      m("casa_morrillo/morrillo_3.webp"), // remera
      m("casa_morrillo/morrillo_4.webp"), // stickers
      m("casa_morrillo/morrillo_5.webp"), // mapa
      m("casa_morrillo/morrillo_6.webp"), // foto
      m("casa_morrillo/morrillo_gif_2.gif"), // tablas
      m("casa_morrillo/morrillo_7.webp"), // carteles de puerta
      m("casa_morrillo/morrillo_8.webp"), // pieza de entrada
      m("casa_morrillo/morrillo_9.webp"), // bitácora
      m("casa_morrillo/morrillo_10.webp"), // fósforos
      m("casa_morrillo/morrillo_11.webp"), // gorra
      m("casa_morrillo/morrillo_12.webp"), // foto
      m("casa_morrillo/morrillo_13.webp"), // sticker 2021→2026
      m("casa_morrillo/morrillo_14.webp"), // postales
      m("casa_morrillo/morrillo_15.webp"), // isla
    ],
    secciones: [],
  },

  {
    id: "cumbia-del-olvido",
    titulo: "Cumbia del Olvido",
    categoria: "Visuales en vivo",
    preview: cumbiadelolvidoPreview,
    descripcion:
      "Visuales en vivo para “Cumbia del Olvido”, de Nicola Cruz: un set creado en TouchDesigner para tocarse en tiempo real desde Resolume.",
    sobreElProyecto:
      "Una orquídea florece, se desarma y vuelve a encenderse siguiendo cada momento de la canción, de la intro suave al clímax.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Visuales en vivo", "Dirección de arte", "Resolume Arena", "TouchDesigner"],
    colaboracion: "",
    // Sin secciones: todas las piezas van en una sola secuencia
    imagenes: [
      m("cumbia/cumbia_1.webp"),
      m("cumbia/cumbia_2.webp"), // red de TouchDesigner
      m("cumbia/cumbia_3.webp"), // en vivo
      m("cumbia/cumbia_4.mp4"), // video completo (con sonido)
      m("cumbia/cumbia_gif_1.gif"),
      m("cumbia/cumbia_gif_2.gif"),
      m("cumbia/cumbia_gif_3.gif"),
      m("cumbia/cumbia_gif_4.gif"),
      m("cumbia/cumbia_gif_5.gif"),
    ],
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
    disciplinas: ["Diseño gráfico", "Diseño institucional", "Comunicación corporativa"],
    colaboracion: "",
    imagenes: [m("desa/desa_1.webp")],
    secciones: [
      {
        titulo: "Campaña: Fraude",
        texto:
          "Concientización sobre el fraude eléctrico. El desafío era hablar de un delito sin señalar a nadie: el foco está en la seguridad, en el impacto sobre la comunidad y en la denuncia anónima.",
        imagenes: [m("desa/desa_2.webp")],
      },
      {
        titulo: "Stickers",
        texto:
          "Plancha para Edesa y Esed: herramientas del trabajo en calle, las marcas y el claim “Somos energía que transforma”.",
        imagenes: [m("desa/desa_3.webp")],
      },
      {
        titulo: "Email marketing",
        texto:
          "Comunicaciones internas por mail para todo el grupo: lanzamientos, guías prácticas y novedades. Lectura rápida y jerarquías claras.",
        imagenes: [m("desa/desa_4.webp")],
      },
      {
        titulo: "PRODESA 2026",
        texto:
          "Comunicaciones internas por mail para todo el grupo: lanzamientos, guías prácticas y novedades. Lectura rápida y jerarquías claras.",
        imagenes: [
          m("desa/desa_5.webp"),
          m("desa/desa_6.webp"),
          m("desa/desa_7.webp"),
          m("desa/desa_8.webp"),
          m("desa/desa_9.webp"),
          m("desa/desa_prodesa_1.mp4"),
          m("desa/desa_prodesa_2.mp4"),
        ],
      },
      {
        titulo: "One pages",
        texto:
          "Infografías de una página para resumir resultados, informes y reconocimientos: mucha información ordenada para leerse de un vistazo.",
        imagenes: [m("desa/desa_10.webp")],
      },
      {
        titulo: "Presentaciones",
        texto:
          "Diseño de las presentaciones de dos campañas - Activá Tu Modo Eficiente y Programa de Oficios para los Premios Eikon 2026.",
        imagenes: [m("desa/desa_11.mp4"), m("desa/desa_12.mp4")],
      },
    ],
  },

  {
    id: "galo",
    titulo: "Galo",
    categoria: "Branding / Identidad visual",
    preview: galoPreview,
    descripcion:
      "Branding para una marca de café de especialidad en Buenos Aires: una misma identidad, dos líneas.",
    sobreElProyecto:
      "Galo es café primero: una cafetería de especialidad que suma gastronomía, bienestar y lifestyle. El branding ordena la marca en dos líneas que conviven bajo un mismo nombre. Galo es su cara cotidiana, cálida y cercana, pensada para la experiencia en el local. Galo Coffee Roasters es su línea de autor, dedicada al tostado y a los cafés de origen, con un lenguaje más sobrio y premium.",
    anio: "2026",
    tipo: "Profesional",
    disciplinas: ["Branding", "Identidad visual", "Packaging", "Piezas visuales"],
    colaboracion: "",
    imagenes: [m("galo/galo_1.webp")],
    secciones: [
      { titulo: "Contexto", texto: "", imagenes: [] },
      {
        titulo: "Línea 01 - Galo",
        texto: "",
        imagenes: [m("galo/galo_2.webp"), m("galo/galo_3.webp"), m("galo/galo_4.webp")],
      },
      {
        titulo: "Línea 02 - Galo Coffee Roasters",
        texto: "",
        imagenes: [
          m("galo/galo_5.webp"),
          m("galo/galo_6.webp"),
          m("galo/galo_7.webp"),
          m("galo/galo_8.webp"),
          m("galo/galo_9.webp"),
          m("galo/galo_10.webp"),
        ],
      },
    ],
  },
];
