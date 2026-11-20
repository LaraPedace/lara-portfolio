// Textos de los proyectos en inglés. El español (y todo lo demás: imágenes, orden,
// tamaños) sigue en src/data/proyectos.js; acá solo va lo que cambia al elegir ENG.
//
// Cómo se cruza con proyectos.js:
//   - cada proyecto, por su id
//   - las secciones, botones y notas, por su orden (la 1ª con la 1ª, etc.)
// Si falta un texto acá, se muestra el español. Si agregás una sección en
// proyectos.js, agregala también acá en el mismo lugar.
export const proyectosEn = {
  universo: {
    categoria: "Integral Design",
    descripcion:
      "A multisensory classroom for learning to read and write in first grade. Inspired by the interplay between technology, pedagogy and creativity.",
    sobreElProyecto:
      "Inspired by the interplay between technology, pedagogy and creativity, the space invites children to discover letters, sounds and words while exploring textures, colors and shapes that stimulate their senses. This project celebrates learning as an act of play, connection and collective discovery in an immersive experience.",
    tipo: "Academic",
    disciplinas: ["Integral Design"],
    colaboracion: "w/ Jazmin Macfarlane",
    secciones: [
      {
        titulo: "Context",
        texto:
          "The project focuses on first grade, where children aged seven and eight go through different learning paces. Literacy teaching has few multisensory resources and methods that rarely adapt to individual needs, which can leave some students behind in the process.",
      },
      {
        titulo: "The Grid",
        texto:
          "A modular grid of circles and squares gives rise to the typeface, the characters, the icons and the pattern of the rug.",
      },
      {
        titulo: "Writing Moment",
        grupo: "Three moments",
        texto:
          "A multisensory product designed to stimulate learning. Each module engages the senses and encourages active writing.",
      },
      {
        titulo: "Alphabet",
        grupo: "Three moments",
        texto:
          "It boosts motivation when learning the letters of the alphabet. It's interactive and sets a challenge of goals and paths.",
      },
      {
        titulo: "Reading Moment",
        grupo: "Three moments",
        texto: "A key space in the classroom dynamic, as it encourages interaction and focus.",
      },
      {
        titulo: "Characters + App",
        texto:
          "Six illustrated characters representing new literacy topics. They are part of an interactive digital app for reading and reading comprehension: a tech tool to use during rug time.",
      },
    ],
  },

  microdesastre: {
    categoria: "Immersive Design",
    descripcion: "An immersive room about microplastics.",
    sobreElProyecto:
      "Through screens, lights and sound, the space immerses visitors in an uncomfortable seabed full of wildlife affected by plastic. This project seeks to make the invisible visible.",
    tipo: "Academic",
    disciplinas: ["Interactive Design", "Resolume Arena", "TouchDesigner"],
    colaboracion: "w/ Gonzalo Gumpel",
    secciones: [
      {
        titulo: "Context",
        texto:
          "Based on SDG 14, Life Below Water. We address microplastics, an invisible pollution that travels from the sea to our plates.",
        destacados: ["Microplastics measure 5mm", "Between 10 and 12 million tons in the sea"],
        notas: [
          { titulo: "Sensations", texto: "Discomfort / Anxiety / Urge to leave" },
          { titulo: "Textures", texto: "Microparticles / Waters / Blur" },
          { titulo: "Sounds", texto: "Sea noise / Pressure / Alert" },
        ],
      },
      {
        titulo: "The room",
        imagenes: [
          {
            alt: "The room and its floor plan: 1. Entrance screens, 2. Quadraphonic sound, 3. Light grid, 4. Monitor and buttons, 5. Main screens",
          },
        ],
      },
      {
        titulo: "TVs",
        texto:
          "They provide information to introduce visitors to the subject, using data and graphic resources for greater impact.",
      },
      {
        titulo: "Buttons",
        tituloIndice: "Four buttons",
        botonera: [
          {
            etiqueta: "Start",
            nombre: "Zero state",
            subtitulo: "The water, the fish and the corals",
            texto:
              "When the camera detects a human figure, after a short delay it releases microparticles onto the water",
          },
          {
            etiqueta: "Button 1",
            nombre: "Wildlife",
            subtitulo: "What was once useful is now poison",
            texto:
              "Raises/lowers the opacity of the X-ray fish video and raises/lowers the volume of the electric sound",
          },
          {
            etiqueta: "Button 2",
            nombre: "Time",
            subtitulo: "A wave that reveals the neglect",
            texto:
              "Moves the video forward from beginning to end while raising or lowering the volume of the low sound",
          },
          {
            etiqueta: "Button 3",
            nombre: "Game",
            subtitulo: "Clean the water with your hands",
            texto:
              "Hand movement scatters the particles to simulate the idea of sweeping, cleaning",
          },
        ],
        imagenes: [
          null,
          {
            alt: "Raise awareness and sound the alarm about water pollution. Inspire immediate and sustained action. Real change starts with awareness and becomes action — or do we want to keep eating a credit card a week?",
          },
        ],
      },
    ],
  },

  "casa-morrillo": {
    categoria: "Branding / Visual identity",
    descripcion: "An unconventional lodge on Panama's Pacific coast, made for surfers.",
    sobreElProyecto:
      "Identity for a surf lodge in Panama, built from the essence of the place and far from cliché aesthetics. Design pieces and applied merch.",
    tipo: "Personal project",
    disciplinas: ["Visual pieces", "Photography"],
  },

  "cumbia-del-olvido": {
    categoria: "Live visuals",
    descripcion:
      "Live visuals for “Cumbia del Olvido” by Nicola Cruz: a set built in TouchDesigner to be performed in real time from Resolume.",
    sobreElProyecto:
      "An orchid blooms, falls apart and lights up again following every moment of the song, from the soft intro to the climax.",
    tipo: "Academic",
    disciplinas: ["Live visuals", "Art direction", "Resolume Arena", "TouchDesigner"],
    secciones: [
      {
        titulo: "Concept",
        texto:
          "Cumbia meets electronic music: percussion and guitar. The orchid takes center stage because it opens slowly, like the track, and transforms with every change in intensity. Each effect comes in with a moment of the song.",
        notas: [
          { titulo: "Textures", texto: "Petal / Honey / Organic" },
          { titulo: "Palette", texto: "Orange / Amber / Black" },
          { titulo: "Sound", texto: "Cumbia / Electronic / Guitar" },
        ],
      },
      {
        titulo: "TouchDesigner",
        texto:
          "For the climax I modeled the orchid in 3D and turned it into a point cloud spinning on its axis. For the ending, the same flower goes through feedback and noise until it looks like fire, and fades out with the song.",
      },
      {
        titulo: "Live",
        texto:
          "The set is designed to be played live from Resolume: each texture is a clip triggered in real time, to the beat of the track, on the screen of a club or festival.",
      },
    ],
  },

  desa: {
    categoria: "Corporate Communication",
    descripcion:
      "DESA Group (Desarrolladora Energética S.A.), dedicated to the distribution and sale of electricity.",
    sobreElProyecto:
      "I work on the communications team at DESA, the group behind Edea, Edelap, Eden, Edes, Edesa and Esed. Design for very different audiences: customers, employees, investors and the community, making sure six brands live together under one system.",
    tipo: "Professional",
    disciplinas: ["Graphic design", "Institutional design", "Corporate communication"],
    secciones: [
      {
        titulo: "Campaign: Fraud",
        texto:
          "Awareness about electricity fraud. The challenge was to talk about a crime without pointing fingers: the focus is on safety, the impact on the community and anonymous reporting.",
      },
      {
        titulo: "Stickers",
        texto:
          "A sticker sheet for Edesa and Esed: field-work tools, the brands and the claim “Somos energía que transforma” (We are energy that transforms).",
      },
      {
        titulo: "Email marketing",
        texto:
          "Internal email communications for the whole group: launches, practical guides and news. Quick to read, with clear hierarchies.",
      },
      {
        titulo: "PRODESA 2026",
        texto:
          "An internal 2026 World Cup prediction game for employees of the six distribution companies. The game's identity and the communication sequence, from the teaser to the winners, adapted to email and WhatsApp.",
      },
      {
        titulo: "One pages",
        texto:
          "One-page infographics summarizing results, reports and awards: lots of information, organized to be read at a glance.",
      },
      {
        titulo: "Presentations",
        texto:
          "Presentation design for two campaigns — Activá Tu Modo Eficiente and Programa de Oficios — for the 2026 Eikon Awards.",
      },
    ],
  },

  galo: {
    categoria: "Branding / Visual identity",
    descripcion:
      "Branding for a specialty coffee brand in Buenos Aires: one identity, two lines.",
    sobreElProyecto:
      "Galo is coffee first: a specialty coffee shop that adds food, wellness and lifestyle. The branding organizes the brand into two lines that live under one name. Galo is its everyday face, warm and approachable, designed for the in-store experience. Galo Coffee Roasters is its signature line, devoted to roasting and single-origin coffees, with a more understated, premium language.",
    tipo: "Professional",
    disciplinas: ["Branding", "Visual identity", "Packaging", "Visual pieces"],
    secciones: [
      {
        titulo: "One brand, two lines",
        texto:
          "Galo and Galo Coffee Roasters are part of the same identity. One handles the coffee shop's day-to-day; the other elevates the product and presents it as a signature offering.",
      },
      {
        titulo: "Line 01 — Galo",
        tituloIndice: "Line 01 - Galo",
        texto:
          "The brand's institutional image. A palette of earth tones and grayish blue, the French bulldog as a symbol and the tagline “Sabores que dejan huella” (Flavors that leave a mark). Applied across the coffee shop, the menu, takeaway and social media, with a warm, everyday tone.",
      },
      {
        titulo: "Line 02 — Galo Coffee Roasters",
        tituloIndice: "Line 02 - Galo Coffee Roasters",
        texto:
          "The premium, signature line. A more understated aesthetic: the coffee bean and the circular seal. Designed for roasting and single-origin coffees, putting the product front and center: origin, process and score.",
      },
    ],
  },
};
