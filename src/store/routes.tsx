import type { MenuRoute } from "@/interfaces";
import {
  FaPenNib,
  FaBalanceScale,
  FaStream,
  FaLanguage,
  FaPodcast,
  FaImage,
  FaMagic,
  FaCommentDots,
  FaUser,
} from "react-icons/fa";

export const menuRoutes: MenuRoute[] = [
  {
    path: "/orthography",
    Icon: FaPenNib,
    title: "Ortografía",
    description: "Corrige la ortografía de tus textos",
  },
  {
    path: "/pros-cons",
    Icon: FaBalanceScale,
    title: "Pros & Cons",
    description: "Compara los pros y contras de diferentes opciones",
  },
  {
    path: "/pros-cons-stream",
    Icon: FaStream,
    title: "Como stream",
    description: "Comparación de pros y contras en tiempo real",
  },
  {
    path: "/translate",
    Icon: FaLanguage,
    title: "Traducir",
    description: "Traduce textos a varios idiomas",
  },
  {
    path: "/text-to-audio",
    Icon: FaPodcast,
    title: "Texto a audio",
    description: "Convierte texto escrito en audio",
  },
  {
    path: "/image-generation",
    Icon: FaImage,
    title: "Imágenes",
    description: "Genera imágenes a partir de descripciones",
  },
  {
    path: "/image-tunning",
    Icon: FaMagic,
    title: "Editar imagen",
    description: "Edita y mejora tus imágenes generadas",
  },
  {
    path: "/audio-to-text",
    Icon: FaCommentDots,
    title: "Audio a texto",
    description: "Transcribe audio a texto escrito",
  },
  {
    path: "/assistant",
    Icon: FaUser,
    title: "Asistente",
    description: "Obtén información y ayuda del asistente",
  },
];
