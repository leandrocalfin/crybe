import {
  Baby,
  Brain,
  HeartHandshake,
  Mic,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";

export const profesionales = [
  {
    id: 1,
    slug: "pamela-garrido",
    nombre: "Lic. Pamela Garrido",

    genero: "mujer",

    especialidad: "Psicología",
    especialidadSlug: "psicologia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento psicológico desde una mirada integral y personalizada.",

    descripcion:
      "Clinica de Niños, Adolescentes y Adultos. Psicoterapia Integrativa Cognitivo Conductual.",

    whatsapp: "549XXXXXXXXXX",

    dias: ["Lunes", "Miércoles", "Viernes"],
    horarios: "14:00 a 19:00",

    mostrarHorarios: true,
    activo: true,
  },

  {
    id: 2,
    slug: "helga-ticac",
    nombre: "Dra. Helga Ticac",

    genero: "mujer",

    especialidad: "Psicología",
    especialidadSlug: "psicologia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Espacio de acompañamiento emocional para niños, adolescentes y adultos.",

    descripcion:
      "Clínica de niños, adolescentes, adultos y familias. Psicoterapia individual y grupal. Formación cognitivo conductual y sistémica.",

    areas: [
      "Doctora en Psicología (Universidad Nacional de La Plata)",
      "Magister en problemas y patologías del desvalimiento (UCES)",
      "Licenciada en Psicología (UFLO)",
      "Licenciada en Servicio Social (UNC)",
      "Diplomatura en gerencia social y políticas de la discapacidad (FLACSO)",
    ],

    destacados: [
      { icono: Users, texto: "Niños, adolescentes y familias" },
      { icono: HeartHandshake, texto: "Psicoterapia individual y grupal" },
      { icono: Brain, texto: "Enfoque cognitivo y sistémico" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: ["Martes", "Jueves"],
    horarios: "15:00 a 20:00",

    mostrarHorarios: true,
    activo: true,
  },

  {
    id: 3,
    slug: "juan-pablo-bourre",
    nombre: "Dr. Juan Pablo Bourre",

    genero: "hombre",

    especialidad: "Psiquiatría",
    especialidadSlug: "psiquiatria",

    modalidad: "Atención presencial y online",

    foto:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Atención especializada para el cuidado integral de la salud mental.",

    descripcion:
      "Médico Psiquiatra formado en el Hospital Argerich y Moyano de la Ciudad Autónoma de Buenos Aires. Orientado a un abordaje integral de la salud mental. Combino herramientas clínicas con una mirada empática y personalizada, acompañando procesos de cambio, autoconocimiento y bienestar.",

    destacados: [
      { icono: Video, texto: "Atención presencial y virtual" },
      { icono: Stethoscope, texto: "Abordaje integral de la salud mental" },
      { icono: HeartHandshake, texto: "Mirada empática y personalizada" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: ["Miércoles", "Viernes"],
    horarios: "16:00 a 20:00",

    mostrarHorarios: true,
    activo: true,
  },

  {
    id: 4,
    slug: "julieta-cayul",
    nombre: "Lic. Julieta Cayul",

    genero: "mujer",

    especialidad: "Fonoaudiología",
    especialidadSlug: "fonoaudiologia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento en lenguaje, habla, voz y comunicación.",

    descripcion:
      "Licenciada en Fonoaudiología, formada en Córdoba. Cuento con 10 años de experiencia en el ámbito clínico, acompañando a niños, adolescentes y adultos en las áreas de Neurofonoaudiología, Lenguaje y Deglución.",

    areas: [
      "Residencia en Neurofonoaudiología",
      "Posgrado en Clínica del Lenguaje",
      "Formación en Fonoestomatología",
      "Formación en Fonoaudiología Crítica: deglución normal y patológica en adultos",
    ],

    destacados: [
      { icono: Mic, texto: "Lenguaje y habla" },
      { icono: Baby, texto: "Niños y adolescentes" },
      { icono: Sparkles, texto: "Deglución y fonoestomatología" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: ["Lunes", "Jueves"],
    horarios: "14:00 a 18:00",

    mostrarHorarios: true,
    activo: true,
  },

  {
    id: 5,
    slug: "estefani-salaya",
    nombre: "Lic. Estefani Salaya",

    genero: "mujer",

    especialidad: "Psicopedagogía",
    especialidadSlug: "psicopedagogia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento de procesos de aprendizaje respetando cada recorrido.",

    descripcion:
      "Clínica de Niños, Adolescentes y adultos con desafíos en el desarrollo.",

    areas: [
      "Diplomada en prácticas inclusivas en condición del espectro autista (FACSO)",
      "Certificada en DIR Floortime Nivel I (Profectum Argentina)",
      "Certificada en ADOS-2 (Actualizados Argentina)",
      "Especialista en prácticas basadas en experiencia Nivel I",
    ],

    destacados: [
      { icono: Baby, texto: "Niños y adolescentes" },
      { icono: Sparkles, texto: "Espectro autista e inclusión" },
      { icono: HeartHandshake, texto: "Desafíos en el desarrollo" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: ["Martes", "Jueves", "Viernes"],
    horarios: "13:00 a 18:00",

    mostrarHorarios: true,
    activo: true,
  },

  {
    id: 6,
    slug: "paula-vega",
    nombre: "Lic. Paula Vega",

    genero: "mujer",

    especialidad: "Psicología",
    especialidadSlug: "psicologia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=90",

    matricula: "MP RN 2770",

    resumen:
      "Clínica de Niños, Adolescentes y Adultos. Terapia Cognitivo Conductual.",

    descripcion:
      "Clínica de Niños, Adolescentes y Adultos. Psicotécnicos y Psicodiagnósticos. Terapia Cognitivo Conductual.",

    areas: [
      "Licenciada en Psicología de la Facultad de Flores",
      "Diplomada en Terapia Cognitivo Conductual en Niños y Adolescentes (Centro Internacional de Psicología y Psicoterapia Cognitiva Comportamental)",
      "Diplomada en Psico Grafología Forense para la detección de maltrato y abuso infantojuvenil (Centro de Estudios Avanzados en Derecho)",
      "Diplomada en Psicodiagnóstico (Universidad del Aconcagua)",
    ],

    destacados: [
      { icono: Users, texto: "Niños, adolescentes y adultos" },
      { icono: Sparkles, texto: "Psicotécnicos y psicodiagnósticos" },
      { icono: Brain, texto: "Terapia cognitivo conductual" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: [],
    horarios: "",

    mostrarHorarios: false,
    activo: true,
  },

  {
    id: 7,
    slug: "susana-lopez-baez",
    nombre: "Lic. Susana Lopez Baez",

    genero: "mujer",

    especialidad: "Psicopedagogía",
    especialidadSlug: "psicopedagogia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento de procesos de aprendizaje respetando cada recorrido.",

    descripcion:
      "Clínica de niños, adolescentes y adultos.",

    areas: [
      "Licenciada en Psicopedagogía (Universidad del Gran Rosario)",
      "Maestranda en Neuropsicología Infantil (UNSAM)",
      "Diploma Superior en prácticas inclusivas en condiciones del espectro autista (FLACSO)",
      "Diplomatura Superior en Neuropsicología Clínica (UNAJ)",
      "Diplomada en Evaluación y Tratamiento Neurocognitivo (UFLO - AIDYNE)",
    ],

    destacados: [
      { icono: Baby, texto: "Niños y adolescentes" },
      { icono: Brain, texto: "Neuropsicología infantil" },
      { icono: Sparkles, texto: "Espectro autista e inclusión" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: [],
    horarios: "",

    mostrarHorarios: false,
    activo: true,
  },

  {
    id: 8,
    slug: "lucia-del-castillo",
    nombre: "Lucía del Castillo",

    genero: "mujer",

    especialidad: "Psicopedagogía",
    especialidadSlug: "psicopedagogia",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento de procesos de aprendizaje respetando cada recorrido.",

    descripcion:
      "Clínica de Niños, Adolescentes y adultos. Tratamientos enfocados en discapacidad, dificultades específicas de aprendizaje, organización escolar y habilidades de la vida diaria.",

    areas: [
      "Nivel I en Lengua de Señas Argentina",
      "Diplomatura en Discapacidad",
      "Garantizar el acceso a la justicia para personas con discapacidad (UNSAM)",
      "Formación en TCC (Academia Walden)",
    ],

    destacados: [
      { icono: HeartHandshake, texto: "Discapacidad e inclusión" },
      { icono: Sparkles, texto: "Dificultades de aprendizaje" },
      { icono: Baby, texto: "Niños y adolescentes" },
    ],

    whatsapp: "549XXXXXXXXXX",

    dias: [],
    horarios: "",

    mostrarHorarios: false,
    activo: true,
  },

  {
    id: 9,
    slug: "camila-mussi-saluj",
    nombre: "Camila Mussi Saluj",

    genero: "mujer",

    especialidad: "Kinesiología y Psicomotricidad",
    especialidadSlug: "kinesiologia-psicomotricidad",

    modalidad: "Atención presencial",

    foto:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=90",

    matricula: "MP 0000",

    resumen:
      "Acompañamiento del desarrollo motor y corporal desde una mirada integral.",

    whatsapp: "549XXXXXXXXXX",

    dias: [],
    horarios: "",

    mostrarHorarios: false,
    activo: true,
  },
];