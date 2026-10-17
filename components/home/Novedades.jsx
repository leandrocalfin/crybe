"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const novedades = [
  {
    id: 4,
    categoria: "Psicopedagogía",
    fecha: "Recurso para familias",
    autor: "Equipo CRyBE",
    titulo: "Caricaturas recomendadas",
    descripcion:
      "No todas las caricaturas son malas: estas cuatro enseñan sin gritar, acompañan sin sobreestimular y abren conversaciones en casa.",
    imagen: "/dibujos1.png",
    cuerpo: [
      "Papás, ojo: no todas las caricaturas son malas. Estas cuatro sí aportan: enseñan sin gritar, acompañan sin sobreestimular y abren conversaciones.",
      "Si eligen usar pantallas, que sea con criterio: momentos acotados, contenido elegido y, siempre que se pueda, mirando juntos para conversar después.",
      "Ningún dibujo va a educar a tus hijos por ti, pero algunos pueden ayudarte a que el aprendizaje fluya más fácil. Estas series no reemplazan tu presencia: tú sigues siendo el primer maestro en casa.",
    ],
    galeria: [
      "/dibujos2.png",
      "/dibujos3.png",
      "/dibujos4.png",
      "/dibujos5.png",
      "/dibujos6.png",
    ],
  },
  {
    id: 5,
    categoria: "Psicología",
    fecha: "Recurso para familias",
    autor: "Equipo CRyBE",
    titulo: "¿Ir a terapia?",
    descripcion:
      "Comenzar terapia es decidir enfrentar lo que te hace mal con acompañamiento profesional. No hace falta tener todo claro para empezar.",
    imagen: "/terapia1.png",
    cuerpo: [
      "Comenzar terapia es tomar la decisión de enfrentarte a lo que te está haciendo mal, pero con acompañamiento profesional y herramientas efectivas.",
      "En CRyBE trabajamos con profesionales que tienen un enfoque basado en evidencia, como la Terapia Cognitivo Conductual, para ayudarte a entender lo que te pasa y lograr cambios.",
      "No hace falta tener todo claro para empezar. A veces, el primer paso es simplemente empezar a hablar.",
      "Si estás pensando en empezar terapia, escribinos. Podemos ayudarte a encontrar el profesional más adecuado para vos.",
    ],
    galeria: [
      "/terapia2.png",
      "/terapia3.png",
      "/terapia4.png",
    ],
  },
  {
    id: 1,
    categoria: "Psicopedagogía",
    fecha: "12 de Octubre, 2024",
    autor: "Lic. Estefani Salaya",
    titulo:
      "¿Cómo saber cuándo consultar con un psicopedagogo? Signos de alerta en la etapa escolar.",
    descripcion:
      "Identificar a tiempo las dificultades en lectoescritura, razonamiento lógico y atención permite brindar estrategias tempranas que evitan la frustración infantil.",
    imagen:
      "/consultarPsicologo.png",
    cuerpo: [
      "Cada niño tiene su propio ritmo de aprendizaje, pero existen señales que nos invitan a prestar atención: dificultad persistente para reconocer letras o sonidos, rechazo a leer en voz alta, problemas para seguir instrucciones de varios pasos o frustración desproporcionada frente a la tarea escolar.",
      "Una evaluación psicopedagógica a tiempo permite identificar el origen de estas dificultades —ya sean del orden del lenguaje, la atención, las funciones ejecutivas o el procesamiento visual y auditivo— y diseñar estrategias de acompañamiento ajustadas a cada niño.",
      "En CRYBE trabajamos de manera coordinada con las familias y las instituciones educativas, porque el aprendizaje no ocurre solo en el consultorio: se construye entre la casa, la escuela y el espacio terapéutico.",
      "Si observás alguna de estas señales, una consulta a tiempo puede hacer una gran diferencia. Escribinos y conversemos sobre la situación de tu hijo o hija.",
    ],
  },
  {
    id: 2,
    categoria: "Equipo CRYBE",
    fecha: "28 de Septiembre, 2024",
    autor: "Equipo CRYBE",
    titulo:
      "La importancia del abordaje interdisciplinario en el neurodesarrollo infantil.",
    descripcion:
      "Por qué coordinar la mirada del psicólogo, fonoaudiólogo y psicomotricista multiplica los resultados terapéuticos y cuida la serenidad de los padres.",
    imagen:
      "/interdisciplinario.jpg",
    cuerpo: [
      "El desarrollo infantil no ocurre por compartimentos: el lenguaje, el movimiento, las emociones y el aprendizaje se influyen mutuamente. Por eso, cuando un niño consulta por una dificultad, mirar solo un aspecto suele ser insuficiente.",
      "En CRYBE realizamos ateneos clínicos y reuniones periódicas entre nuestros profesionales para construir una mirada compartida sobre cada caso. El psicólogo, el fonoaudiólogo, el psicopedagogo y el kinesiólogo diseñan juntos planes terapéuticos sinérgicos.",
      "Este modo de trabajo tiene un beneficio adicional muy valorado por las familias: un solo relato, una sola historia clínica compartida y criterios coherentes entre todos los terapeutas. Menos idas y vueltas, más serenidad para los padres.",
      "Si tu hijo realiza varios tratamientos, te invitamos a conocer nuestra propuesta interdisciplinaria.",
    ],
  },
  {
    id: 3,
    categoria: "Fonoaudiología",
    fecha: "15 de Septiembre, 2024",
    autor: "Lic. Julieta Cayul",
    titulo:
      "El lenguaje se construye todos los días: cómo acompañar desde casa.",
    descripcion:
      "El desarrollo del lenguaje ocurre en lo cotidiano: cómo la mirada, el juego y la escucha de todos los días favorecen el habla y la comunicación.",
    imagen:
      "/fono.jpg",
    cuerpo: [
      "El lenguaje no se aprende solo en un consultorio: se construye en la mesa, en el juego, en el cuento antes de dormir. Cada intercambio cotidiano —mirar, nombrar, esperar el turno para hablar— es una oportunidad de estimulación.",
      "Hay señales que vale la pena observar: si a los dos años el vocabulario es muy reducido, si cuesta combinar palabras, si no responde al nombre o si la frustración aparece cada vez que quiere comunicar algo. Una consulta fonoaudiológica a tiempo permite evaluar si se trata de una variación del desarrollo o de una dificultad que necesita acompañamiento.",
      "En CRYBE evaluamos el lenguaje comprensivo y expresivo, la articulación, la voz y la deglución, y diseñamos planes de estimulación que incluyen a la familia, porque el trabajo continúa en casa.",
      "Si tenés dudas sobre el lenguaje de tu hijo o hija, escribinos y conversemos.",
    ],
  },
  ];

const CarruselArticulo = ({ articulo }) => {
  const imagenes = [articulo.imagen, ...(articulo.galeria || [])];
  const [indice, setIndice] = useState(0);
  const ref = useRef(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el || el.clientWidth === 0) return;
    // Sin este guard se hacía setState por cada píxel scrolleado y el modal
    // se re-renderizaba entero durante el gesto (tirones en tablet).
    const siguiente = Math.round(el.scrollLeft / el.clientWidth);
    setIndice((prev) => (prev === siguiente ? prev : siguiente));
  };

  const irA = (i) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const anterior = () => irA((indice - 1 + imagenes.length) % imagenes.length);
  const siguiente = () => irA((indice + 1) % imagenes.length);

  if (imagenes.length === 1) {
    return (
      <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-none bg-[#0B1F3A] md:h-64">
        <img
          src={imagenes[0]}
          alt={articulo.titulo}
          className="h-full w-full object-contain"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0F3A7A] backdrop-blur">
          {articulo.categoria}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-none bg-[#0B1F3A]">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex h-60 snap-x snap-mandatory overflow-x-auto md:h-64"
        style={{ scrollbarWidth: "none" }}
      >
        {imagenes.map((img) => (
          <div
            key={img}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center"
          >
            <img
              src={img}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full select-none object-contain"
            />
          </div>
        ))}
      </div>

      <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0F3A7A] backdrop-blur">
        {articulo.categoria}
      </span>

      {/* FLECHAS */}
      <button
        type="button"
        onClick={anterior}
        aria-label="Imagen anterior"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F3A7A] shadow transition-all hover:bg-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={siguiente}
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F3A7A] shadow transition-all hover:bg-white"
      >
        <ChevronRight size={20} />
      </button>

      {/* PUNTOS */}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
        {imagenes.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ver imagen ${i + 1}`}
            className={`h-[6px] rounded-full transition-all duration-300 ${
              indice === i ? "w-8 bg-white" : "w-[6px] bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Paginación: coincide con las columnas de la grilla (lg: 4 columnas,
// mobile/tablet: 2).
const POR_PAGINA_DESKTOP = 8;
const POR_PAGINA_MOVIL = 6;
const QUERY_DESKTOP = "(min-width: 1024px)";

const Novedades = ({ items }) => {
  const [articulo, setArticulo] = useState(null);
  const [porPagina, setPorPagina] = useState(POR_PAGINA_MOVIL);
  const [pagina, setPagina] = useState(1);
  const lista = items?.length ? items : novedades;

  // 8 por página en desktop (4 columnas × 2 filas) y 6 en tablet/mobile
  // (2 columnas × 3 filas). Arranca en 6 a propósito: el primer render del
  // cliente tiene que coincidir con el del servidor o Next hydration warns.
  useEffect(() => {
    const mq = window.matchMedia(QUERY_DESKTOP);
    const aplicar = () => setPorPagina(mq.matches ? POR_PAGINA_DESKTOP : POR_PAGINA_MOVIL);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  // pagActual recorta el estado: si llegan artículos o cambia el tamaño de
  // página, el usuario nunca queda en una página que ya no existe.
  const pagActual = Math.min(pagina, totalPaginas);
  const visibles = lista.slice((pagActual - 1) * porPagina, pagActual * porPagina);

  const irA = (p) => {
    setPagina(p);
    const seccion = document.getElementById("novedades");
    if (seccion) {
      window.scrollTo({ top: seccion.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
    }
  };

  // Cerrar con Escape y congelar el scroll de fondo
  useEffect(() => {
    if (!articulo) return;
    const onKey = (e) => {
      if (e.key === "Escape") setArticulo(null);
    };
    document.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [articulo]);

  return (
    <section
      id="novedades"
      data-navbar-color="#FAFBFF"
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-16"
      style={{ background: "#FAFBFF" }}
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ENCABEZADO CENTRADO */}
        <div className="mx-auto mb-10 max-w-[720px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-titulo text-[13px] font-semibold uppercase tracking-[0.24em] text-[#0F3A7A] sm:text-[15px]">
              Divulgación y Salud
            </p>
            <h2 className="mt-2 font-titulo text-[26px] font-semibold leading-tight text-[#1F1F1F] sm:text-[30px] md:text-[38px]">
              Blog & Recursos para la Comunidad
            </h2>
            <p className="mx-auto mt-4 text-[15px] leading-7 text-[#3D3D3D] sm:text-[16px]">
              Artículos elaborados por nuestros terapeutas con información
              clara y fundamentada para acompañar a las familias.
            </p>
          </motion.div>
        </div>

        {/* ARTÍCULOS */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {visibles.map((novedad, index) => (
            <Reveal
              as="article"
              key={novedad.id}
              onClick={() => setArticulo(novedad)}
              delay={index * 0.08}
              className="
                group flex w-[calc(50%-0.5rem)] cursor-pointer flex-col justify-between overflow-hidden rounded-[16px] border border-[#D5E0EE] bg-white
                shadow-[0_12px_32px_-8px_rgba(30,40,80,0.28)]
                transition-all duration-500
                hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(15,58,122,0.35)]
                sm:w-[calc(50%-1rem)] sm:rounded-[20px] lg:w-[calc(25%-1.2rem)] lg:max-w-[270px]
              "
            >
              <div>
                <div className="relative h-32 overflow-hidden bg-[#EAF4FB] sm:h-40">
                  <img
                    src={novedad.imagen}
                    alt={novedad.titulo}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-[#0F3A7A] backdrop-blur sm:left-3 sm:top-3 sm:px-2.5 sm:py-0.5 sm:text-[10px]">
                    {novedad.categoria}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3.5">
                  <span className="text-[10px] font-medium text-[#6B7280] sm:text-[11px]">
                    Por {novedad.autor}
                  </span>
                  <h3 className="mt-1 font-titulo text-[13px] font-semibold leading-snug text-[#1F1F1F] [overflow-wrap:anywhere] sm:mt-1 sm:text-[14px]">
                    {novedad.titulo}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#4B5563] [overflow-wrap:anywhere] sm:mt-1 sm:text-[12px] sm:leading-5">
                    {novedad.descripcion}
                  </p>
                </div>
              </div>

              <div className="flex justify-center px-2 pb-2 sm:px-3 sm:pb-3">
                <button
                  type="button"
                  onClick={() => setArticulo(novedad)}
                  className="flex items-center text-[11px] font-semibold text-[#0F3A7A] transition-colors hover:text-[#1A63B4] min-h-[28px] sm:text-[12.5px] sm:min-h-[44px]"
                >
                  Leer artículo completo
                </button>
              </div>
</Reveal>
          ))}
        </div>

        {/* ÍNDICE DE PÁGINAS */}
        {totalPaginas > 1 && (
          <nav
            aria-label="Paginación de recursos"
            className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => irA(pagActual - 1)}
              disabled={pagActual === 1}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#D5E0EE] bg-white px-4 text-[12px] font-semibold text-[#0F3A7A] transition hover:bg-[#EAF4FB] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white"
            >
              <ChevronLeft size={15} /> Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => irA(n)}
                aria-current={n === pagActual ? "page" : undefined}
                aria-label={`Página ${n}`}
                className={`inline-flex h-10 min-w-[40px] items-center justify-center rounded-full border px-3 text-[12px] font-semibold transition ${
                  n === pagActual
                    ? "border-[#0F3A7A] bg-[#0F3A7A] text-white"
                    : "border-[#D5E0EE] bg-white text-[#0F3A7A] hover:bg-[#EAF4FB]"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => irA(pagActual + 1)}
              disabled={pagActual === totalPaginas}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-[#D5E0EE] bg-white px-4 text-[12px] font-semibold text-[#0F3A7A] transition hover:bg-[#EAF4FB] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white"
            >
              Siguiente <ChevronRight size={15} />
            </button>
          </nav>
        )}
      </div>

      {/* MODAL DE LECTURA */}
      <AnimatePresence>
        {articulo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setArticulo(null)}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0A1830]/60 backdrop-blur-sm sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={articulo.titulo}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-[680px] overflow-y-auto rounded-none bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:pb-0 sm:rounded-none"
            >
              <button
                type="button"
                onClick={() => setArticulo(null)}
                aria-label="Cerrar artículo"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0F3A7A] shadow transition-colors hover:bg-[#0F3A7A] hover:text-white"
              >
                <X size={19} />
              </button>

              <CarruselArticulo articulo={articulo} />

              <div className="p-5 md:p-7 lg:p-9">
                <span className="text-[12px] text-[#6B7280] sm:text-[12.5px]">
                  {articulo.fecha}
                </span>
                <p className="mt-1 text-[12px] font-semibold text-[#0F3A7A] sm:text-[13px]">
                  Autor: {articulo.autor}
                </p>
                <h3 className="mt-2 font-titulo text-[22px] font-semibold leading-tight text-[#1F1F1F] md:text-[24px] lg:text-[28px]">
                  {articulo.titulo}
                </h3>
                <div className="mt-4 space-y-4">
                  {(articulo.cuerpo || [articulo.descripcion]).map((parrafo, i) => (
                    <p key={i} className="text-[14px] leading-7 text-[#3D3D3D] sm:text-[15px]">
                      {parrafo}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Novedades;

