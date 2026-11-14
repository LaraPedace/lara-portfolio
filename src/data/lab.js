// Lab: piezas sueltas (fotografía, acuarelas, flyers, videos).
// Orden = orden de la lista de descripciones.
// OJO: el número del archivo no siempre coincide con el de la lista.
// A partir de "7_1" (la segunda foto de Mallorca) los archivos quedan corridos en uno:
// por ejemplo, el ítem 9 de la lista es el archivo 8.webp.
//
// tipo = "imagen" o "video". ancho/alto = tamaño original en píxeles
// (sirve para reservar el lugar antes de que cargue y que la página no salte).

import foto1 from "../assets/lab/1_6.webp";
import foto2 from "../assets/lab/2_27.webp";
import foto3 from "../assets/lab/3.webp";
import foto4 from "../assets/lab/4.webp";
import foto5 from "../assets/lab/5.webp";
import foto6 from "../assets/lab/6.webp";
import foto7 from "../assets/lab/7.webp";
import foto8 from "../assets/lab/7_1.webp";
import foto9 from "../assets/lab/8.webp";
import acuarela10 from "../assets/lab/9.webp";
import flyer11 from "../assets/lab/10.webp";
import video12 from "../assets/lab/11.mp4";
import video13 from "../assets/lab/12.mp4";
import video14 from "../assets/lab/13.mp4";
import acuarela15 from "../assets/lab/14.webp";
import acuarela16 from "../assets/lab/15.webp";

export const lab = [
  {
    id: 1,
    tipo: "imagen",
    src: foto1,
    ancho: 1260,
    alto: 892,
    descripcion: "Fotografía urbana Buenos Aires, materia de Fotografía",
  },
  {
    id: 2,
    tipo: "imagen",
    src: foto2,
    ancho: 1260,
    alto: 860,
    descripcion: "Fotografía urbana Buenos Aires, materia de Fotografía",
  },
  {
    id: 3,
    tipo: "imagen",
    src: foto3,
    ancho: 1256,
    alto: 892,
    descripcion: "Serie tipológica SERVICIOS, materia de Fotografía",
  },
  {
    id: 4,
    tipo: "imagen",
    src: foto4,
    ancho: 924,
    alto: 612,
    descripcion: "Sudáfrica - Safari, analógica, Kodak 200",
  },
  {
    id: 5,
    tipo: "imagen",
    src: foto5,
    ancho: 924,
    alto: 616,
    descripcion: "Sudáfrica - Safari, analógica, Kodak 200",
  },
  {
    id: 6,
    tipo: "imagen",
    src: foto6,
    ancho: 920,
    alto: 616,
    descripcion: "Sudáfrica - Safari, analógica, Kodak 200",
  },
  {
    id: 7,
    tipo: "imagen",
    src: foto7,
    ancho: 736,
    alto: 1108,
    descripcion: "Verano en Mallorca, analógica, Kodak Gold 200",
  },
  {
    id: 8,
    tipo: "imagen",
    src: foto8,
    ancho: 732,
    alto: 1108,
    descripcion: "Verano en Mallorca, analógica, Kodak Gold 200",
  },
  {
    id: 9,
    tipo: "imagen",
    src: foto9,
    ancho: 924,
    alto: 616,
    descripcion: "Córdoba, analógica, rollo Fujifilm 200",
  },
  {
    id: 10,
    tipo: "imagen",
    src: acuarela10,
    ancho: 432,
    alto: 396,
    descripcion: "Acuarela escaneada, intervenida en Photoshop",
  },
  {
    id: 11,
    tipo: "imagen",
    src: flyer11,
    ancho: 1008,
    alto: 1260,
    descripcion: "Flyer para marca de ropa circular",
  },
  {
    id: 12,
    tipo: "video",
    src: video12,
    ancho: 720,
    alto: 1280,
    descripcion: "Reel para la fiesta Treehouse",
  },
  {
    id: 13,
    tipo: "video",
    src: video13,
    ancho: 800,
    alto: 968,
    descripcion: "Ejercicio del curso de TouchDesigner",
  },
  {
    id: 14,
    tipo: "video",
    src: video14,
    ancho: 686,
    alto: 1210,
    descripcion: "Prueba de video para Treehouse",
  },
  {
    id: 15,
    tipo: "imagen",
    src: acuarela15,
    ancho: 880,
    alto: 704,
    descripcion: "Acuarela escaneada, intervenida en Photoshop",
  },
  {
    id: 16,
    tipo: "imagen",
    src: acuarela16,
    ancho: 436,
    alto: 396,
    descripcion: "Acuarela escaneada, intervenida en Photoshop",
  },
];
