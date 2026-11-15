import universoPreview from "../assets/img/universo-preview.webp";
import microdesastrePreview from "../assets/img/microdesastre-preview.mp4";
import cumbiadelolvidoPreview from "../assets/img/cumbia-preview.mp4";
import desaPreview from "../assets/img/desa-preview.webp";
import galoPreview from "../assets/img/galo-preview.webp";
import iconoCara from "../assets/img/FACE.svg";
import iconoSlider from "../assets/img/SLIDER.svg";
import iconoMano from "../assets/img/HAND.svg";

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

// Marca una imagen para que vaya a todo el ancho de la columna (ver "imagenes" abajo).
// Si en una galería hay alguna marcada, el resto va de a dos en el orden de la lista.
function ancha(src, alt) {
  return { src, ancha: true, alt };
}

// Detalle chico (ej. un logo): ocupa su propia fila, centrado y petit (112px en desktop).
function centrada(src) {
  return { src, ancha: true, centrada: true };
}

// Un tercio del ancho: tres seguidas forman una fila.
function tercio(src) {
  return { src, tercio: true };
}

// Video a todo el ancho con controles (play, volumen…), para los que tienen sonido.
function conSonido(src) {
  return { src, ancha: true, controles: true };
}

// Orden = orden en que aparecen en la home.
// categoria = subtítulo de la tarjeta. preview = imagen (o video .mp4) de la tarjeta.
// imagenes = lo que va arriba de todo en la página del proyecto (portada).
// secciones = bloques de la página, cada uno con su título, texto e imágenes.
// grupo (opcional) = secciones seguidas con el mismo grupo van numeradas bajo ese título
// (ej. "Tres momentos": 1. Momento Escritura, 2. Abecedario, 3. Momento Lectura).
// notas (opcional) = datos chicos al costado del texto de la sección (título + detalle).
// destacados (opcional) = cifras grandes debajo del texto (las notas van a su derecha).
// tituloIndice (opcional) = otro nombre para la sección en el índice de la izquierda.
// botonera (opcional) = botones que cambian video, texto y monitor (ver Botonera.jsx).
// unaPorFila = true: todas las imágenes a lo ancho, una debajo de la otra (si no, van de a dos).
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
    // Cada imagen ya viene armada como una fila completa: van una debajo de la otra
    unaPorFila: true,
    imagenes: [m("universo/universo_1.webp"), m("universo/universo.gif")],
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "El proyecto se enfoca en primer grado, donde niños de entre siete y ocho años atraviesan distintos ritmos de aprendizaje. La enseñanza de la lectoescritura cuenta con escasos recursos multisensoriales y metodologías poco adaptables a las necesidades individuales, lo que puede dejar a algunos alumnos rezagados en el proceso.",
        imagenes: [m("universo/universo_2.webp")], // mapa conceptual + planta del aula
      },
      {
        titulo: "La Grilla",
        texto:
          "Una grilla modular de círculos y cuadrados da origen a la tipografía, los personajes, los íconos y la trama de la alfombra.",
        imagenes: [m("universo/universo_3.webp")],
      },
      {
        titulo: "Momento Escritura",
        grupo: "Tres momentos",
        texto:
          "Producto multisensorial diseñado para estimular el aprendizaje. Cada módulo estimula los sentidos y fomentan una escritura activa.",
        imagenes: [
          m("universo/universo_despiece.mp4"),
          m("universo/universo_4.webp"), // dibujos de uso + fichas
        ],
      },
      {
        titulo: "Abecedario",
        grupo: "Tres momentos",
        texto:
          "Fomenta la motivación a la hora de aprender las letras del abecedario. Interactúa y propone un desafío de metas y recorridos.",
        imagenes: [m("universo/universo_6.webp")],
      },
      {
        titulo: "Momento Lectura",
        grupo: "Tres momentos",
        texto:
          "Espacio clave en la dinámica educativa, ya que fomenta la interacción y la concentración",
        imagenes: [m("universo/universo_7.webp")],
      },
      {
        titulo: "Personajes + App",
        texto:
          "Seis personajes ilustrados para representar nuevos tópicos de la lectoescritura. Forman de una aplicación digital interactiva la lectura y la comprensión lectora. Herramienta tecnológica para utilizar en el momento de la alfombra.",
        imagenes: [
          m("universo/universo_8.webp"), // personajes
          m("universo/universo_9.webp"), // app
          m("universo/universo_10.webp"), // fotos de la muestra
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
      "Una sala inmersiva sobre los microplásticos.",
    sobreElProyecto:
      "A través de pantallas, luces y sonidos el espacio sumerge al visitante en un fondo marino incómodo debido a la fauna afectada por el plástico. Este proyecto busca hacer visible algo invisible.",
    anio: "2024",
    tipo: "Académico",
    disciplinas: ["Diseño Interactivo", "Resolume Arena", "Touch Designer"],
    colaboracion: "c/ Gonzalo Gumpel",
    imagenes: [m("microdesastre/micro_video_1.mp4")], // la sala funcionando
    secciones: [
      {
        titulo: "Contexto",
        texto:
          "Basado en el ODS 14, Vida Submarina. Abordamos los microplásticos, una contaminación invisible que llega del mar a nuestros platos de comida.",
        destacados: ["5mm miden los microplásticos", "Entre 10 y 12 millones toneladas en el mar"],
        notas: [
          { titulo: "Sensaciones", texto: "Incomodidad / Ansiedad / Necesidad de salir" },
          { titulo: "Texturas", texto: "Micropartículas / Aguas / Blur" },
          { titulo: "Sonidos", texto: "Ruido de mar / Presión / Alerta" },
        ],
        imagenes: [],
      },
      {
        titulo: "La sala",
        texto: "",
        imagenes: [
          ancha(
            m("microdesastre/micro_1.webp"),
            "La sala y su plano: 1. Pantallas antesala, 2. Sonido cuadrafónico, 3. Grilla de luces, 4. Monitor y botonera, 5. Pantallas principales",
          ), // foto + plano + referencias, en una sola imagen
        ],
      },
      {
        titulo: "TVs",
        texto:
          "Proporcionan información para introducir al espectador en la temática. Utilización de datos y recursos gráficos para un mayor impacto.",
        imagenes: [ancha(m("microdesastre/micro_video_3.mp4"))],
      },
      {
        titulo: "Botones",
        tituloIndice: "Cuatro botones",
        texto: "",
        // Cada botón: su video de la sala (izquierda) + su monitor (derecha)
        botonera: [
          {
            etiqueta: "Inicio",
            nombre: "Estado cero",
            subtitulo: "El agua, los peces y los corales",
            icono: iconoCara,
            sensor: "Facetracking",
            texto:
              "Cuando la cámara detecta una figura humana, con un delay introduce sobre el agua unas micropartículas",
            video: m("microdesastre/micro_boton_0.mp4"),
            monitor: m("microdesastre/micro_monitor_0.mp4"),
          },
          {
            etiqueta: "Botón 1",
            nombre: "Fauna",
            subtitulo: "Lo que una vez fue útil, ahora es veneno",
            icono: iconoSlider,
            sensor: "Slider",
            texto:
              "Sube/baja la opacidad del video de los peces con rayos X y sube/baja volumen del sonido eléctrico",
            video: m("microdesastre/micro_boton_1_fauna.mp4"),
            monitor: m("microdesastre/micro_monitor_1.mp4"),
          },
          {
            etiqueta: "Botón 2",
            nombre: "Tiempo",
            subtitulo: "Una ola que revela el descuido",
            icono: iconoSlider,
            sensor: "Slider",
            texto:
              "Adelanta la transición del video del principio al final, a la vez sube o baja el volumen del sonido grave",
            video: m("microdesastre/micro_boton_2_tiempo.mp4"),
            monitor: m("microdesastre/micro_monitor_2.mp4"),
          },
          {
            etiqueta: "Botón 3",
            nombre: "Juego",
            subtitulo: "Limpiá el agua con tus manos",
            icono: iconoMano,
            sensor: "Handtracking",
            texto:
              "El movimiento de mano permite dispersar las partículas para simular la idea de barrer, limpiar",
            video: m("microdesastre/micro_boton_3_juegos.mp4"),
            monitor: m("microdesastre/micro_monitor_3.mp4"),
          },
        ],
        imagenes: [
          ancha(m("microdesastre/micro_video_2.mp4")), // facetracking en TouchDesigner
          ancha(
            m("microdesastre/micro_2.webp"),
            "Despertar conciencia y encender alarmas sobre la contaminación del agua. Inspirar acción inmediata y sostenida. El verdadero cambio empieza con la conciencia y se materializa en la acción, ¿O queremos seguir comiendo una tarjeta de crédito por semana?",
          ),
        ],
      },
    ],
  },

  {
    id: "casa-morrillo",
    titulo: "Casa Morrillo",
    categoria: "Branding / Identidad visual",
    preview: m("casa_morrillo/morrillo_gif_2.gif"), // tablas
    descripcion:
      "Un lodge poco convencional en la costa pacífica de Panamá, pensado para surfistas.",
    sobreElProyecto:
      "Identidad para un surf lodge en Panamá, pensada desde la esencia del lugar y lejos de la estética cliché. Piezas de diseño y merch aplicado.",
    anio: "2026",
    tipo: "Proyecto Personal",
    disciplinas: ["Piezas Visuales", "Fotografía"],
    colaboracion: "",
    // Sin secciones: todas las piezas van en una sola secuencia.
    // ancha(...) = a todo el ancho; el resto va de a dos (en orden, por pares).
    imagenes: [
      ancha(m("casa_morrillo/morrillo_1.webp")), // paisaje (portada)
      m("casa_morrillo/morrillo_2.webp"), // afiche
      m("casa_morrillo/1.gif"), // surf
      ancha(m("casa_morrillo/morrillo_3.webp")), // remera + stickers
      ancha(m("casa_morrillo/morrillo_4.webp")), // el lodge
      m("casa_morrillo/morrillo_5.webp"), // carteles de puerta
      m("casa_morrillo/morrillo_6.webp"), // tarjeta
      m("casa_morrillo/morrillo_gif_2.gif"), // tablas
      m("casa_morrillo/morrillo_7.webp"), // bitácora + fósforos
      m("casa_morrillo/morrillo_8.webp"), // gorra
      m("casa_morrillo/morrillo_9.webp"), // sticker 2021→2026
      ancha(m("casa_morrillo/morrillo_10.webp")), // postales
      centrada(m("casa_morrillo/morrillo_11.webp")), // isla (blanca, fondo transparente)
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
    imagenes: [conSonido(m("cumbia/cumbia_4.mp4"))], // video completo (con sonido)
    secciones: [
      {
        titulo: "Concepto",
        texto:
          "La cumbia con la electrónica: percusiones y guitarra. La orquídea como protagonista porque se abre lento, como el tema, y se transforma con cada cambio de intensidad. Cada efecto entra con un momento de la canción.",
        // Al costado del texto (en móvil, debajo)
        notas: [
          { titulo: "Texturas", texto: "Pétalo / Miel / Orgánico" },
          { titulo: "Paleta", texto: "Naranja / Ámbar / Negro" },
          { titulo: "Sonido", texto: "Cumbia / Electrónica / Guitarra" },
        ],
        imagenes: [m("cumbia/cumbia_gif_5.gif")], // trazo
      },
      {
        titulo: "TouchDesigner",
        texto:
          "Para el clímax modelé la orquídea en 3D y la convertí en una nube de puntos que gira sobre su eje. Para el final, la misma flor pasa por feedback y noise hasta parecer fuego, y se apaga con la canción.",
        imagenes: [
          ancha(m("cumbia/cumbia_1.webp")), // red de la flor final
          m("cumbia/cumbia_2.webp"), // red de los puntos
          m("cumbia/cumbia_gif_4.gif"), // nube de puntos
        ],
      },
      {
        titulo: "En vivo",
        texto:
          "El set está pensado para tocarse en vivo desde Resolume: cada textura es un clip que se dispara en tiempo real, al ritmo del tema, en la pantalla de un club o festival.",
        imagenes: [
          ancha(m("cumbia/cumbia_3.webp")), // proyección en el club
          tercio(m("cumbia/cumbia_gif_2.gif")), // edge
          tercio(m("cumbia/cumbia_gif_3.gif")), // fuego
          tercio(m("cumbia/cumbia_gif_1.gif")), // bendoscope
        ],
      },
    ],
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
