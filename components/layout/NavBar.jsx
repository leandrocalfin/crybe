"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

import { cerrarSesion } from "../../app/admin/actions";

const Navbar = ({ adminEmail: emailInicial = null, adminAvatar: avatarInicial = "" }) => {
  const [abierto, setAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [panel, setPanel] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [adminEmail, setAdminEmail] = useState(emailInicial);
  const [adminAvatar, setAdminAvatar] = useState(avatarInicial);
  const menuUsuarioRef = useRef(null);
  const botonUsuarioRef = useRef(null);
  const botonUsuarioMobileRef = useRef(null);
  const menuUsuarioMobileRef = useRef(null);
  const pathname = usePathname();

  // El layout de /admin es compartido: al ir de /admin a /admin/login el Navbar
  // no se remonta y el useState conservaba la sesión vieja, dejando el ícono de
  // perfil visible después de cerrar sesión. Sincronizamos con el prop del server.
  const [emailPrevio, setEmailPrevio] = useState(emailInicial);
  if (emailPrevio !== emailInicial) {
    setEmailPrevio(emailInicial);
    setAdminEmail(emailInicial);
    setAdminAvatar(avatarInicial);
  }

  const sesionAdmin = Boolean(adminEmail);
  // El ícono de perfil es solo para quien tiene sesión: en /admin/login todavía no
  // hay nadie adentro, así que no debe figurar.
  const mostrarAdmin = sesionAdmin;
  // El CTA de consulta desaparece solo con sesión iniciada, sin importar la ruta.
  const mostrarConsulta = !sesionAdmin;
  // No hay un nombre de admin guardado, así que sale del email.
  const mostrarAdminNombre = adminEmail
    ? adminEmail.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const links = [
    {
      nombre: "Inicio",
      href: "/#inicio",
      id: "inicio",
    },
    {
      nombre: "Nosotros",
      href: "/#nosotros",
      id: "nosotros",
    },
    {
      nombre: "Especialidades",
      href: "/#especialidades",
      id: "especialidades",
    },
    {
      nombre: "Profesionales",
      href: "/#equipo",
      id: "staff",
    },
    {
      nombre: "Recursos",
      href: "/#novedades",
      id: "novedades",
    },
    {
      nombre: "Contacto",
      href: "/#contacto",
      id: "contacto",
    },
  ];

  const nombreAdmin = adminEmail ? adminEmail.split("@")[0] : "Administrador";

  useEffect(() => {
    if (emailInicial) return; // Ya viene del servidor.
    // Atajo anti-costo: sin cookie de sesión de Supabase no hay sesión
    // posible y nos ahorramos el fetch (1 invocación del Worker + auth +
    // query a admins por cada visita anónima). Cubre .0/.1 (cookies partidas
    // cuando es larga) y cualquier ref del proyecto. No valida nada: el
    // servidor sigue verificando con getUser().
    if (!/(^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    let vivo = true;
    (async () => {
      try {
        const res = await fetch("/api/admin-status", { cache: "no-store" });
        const { admin } = await res.json();
        if (!vivo) return;
        // Sin sesión también hay que limpiar: si el server ya la cerró, el ícono desaparece.
        if (admin?.email) {
          setAdminEmail(admin.email);
          setAdminAvatar(admin.avatar || "");
        } else {
          setAdminEmail(null);
          setAdminAvatar("");
        }
      } catch {
        // Sin sesión: el CTA se muestra igual.
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const actualizarNavbar = () => {
      setScrolled(window.scrollY > 20);

      const secciones = Array.from(
        document.querySelectorAll("[data-navbar-color]")
      );

      if (secciones.length === 0) {
        return;
      }

      const puntoDeteccion = window.scrollY + 120;

      let seccionActual = secciones[0];

      secciones.forEach((seccion) => {
        const inicio = seccion.offsetTop;

        if (inicio <= puntoDeteccion) {
          seccionActual = seccion;
        }
      });

      if (!seccionActual) {
        return;
      }

      const id = seccionActual.getAttribute("id");

      if (id === "equipo" || id === "staff") {
        setSeccionActiva("staff");
      } else if (id) {
        setSeccionActiva(id);
      }
    };

    actualizarNavbar();

    window.addEventListener(
      "scroll",
      actualizarNavbar,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      actualizarNavbar
    );

    return () => {
      window.removeEventListener(
        "scroll",
        actualizarNavbar
      );

      window.removeEventListener(
        "resize",
        actualizarNavbar
      );
    };
  }, []);

  useEffect(() => {
    const manejarResize = () => {
      if (window.innerWidth >= 1024) {
        setAbierto(false);
      }
    };

    window.addEventListener(
      "resize",
      manejarResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        manejarResize
      );
    };
  }, []);

  // El menú de usuario se cierra solo: tocás afuera, Esc o navegás.
  useEffect(() => {
    if (!menuUsuario) return;

    const alTocarAfuera = (e) => {
      const dentro = [menuUsuarioRef.current, menuUsuarioMobileRef.current].some(
        (nodo) => nodo && nodo.contains(e.target)
      );
      if (!dentro) setMenuUsuario(false);
    };

    const alPulsarEsc = (e) => {
      if (e.key === "Escape") setMenuUsuario(false);
    };

    document.addEventListener("pointerdown", alTocarAfuera);
    document.addEventListener("keydown", alPulsarEsc);

    return () => {
      document.removeEventListener("pointerdown", alTocarAfuera);
      document.removeEventListener("keydown", alPulsarEsc);
    };
  }, [menuUsuario]);

  // El panel se ancla a la pantalla, no al botón: si la navbar desborda, el botón
  // puede quedar fuera del viewport y el menú se iría con él. Se recoloca al
  // desplazar o redimensionar, y siempre con 16px de margen a cada lado.
  useEffect(() => {
    if (!menuUsuario) return;

    const ANCHO = 230;
    const MARGEN = 16;

    const ubicar = () => {
      // Hay dos botones (desktop y mobile) y solo uno está visible según el
      // breakpoint, pero ambos quedan montados. El ref compartido lo apuntaría
      // al oculto, que devuelve un rect de ceros, así que elegimos el visible.
      const candidatos = [botonUsuarioRef.current, botonUsuarioMobileRef.current];
      const boton = candidatos.find((b) => {
        if (!b) return false;
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (!boton) return;
      const r = boton.getBoundingClientRect();
      const ancho = Math.min(ANCHO, window.innerWidth - MARGEN * 2);
      let left = r.right - ancho;
      if (left < MARGEN) left = MARGEN;
      if (left + ancho > window.innerWidth - MARGEN) {
        left = window.innerWidth - MARGEN - ancho;
      }
      setPanel({ top: r.bottom + 8, left, ancho });
    };

    ubicar();
    window.addEventListener("scroll", ubicar, { passive: true });
    window.addEventListener("resize", ubicar);
    return () => {
      window.removeEventListener("scroll", ubicar);
      window.removeEventListener("resize", ubicar);
    };
  }, [menuUsuario]);

  const irArriba = (e) => {
    // En la home el hash solo no resetea el scroll si ya estás arriba, así que
    // interceptamos y submimos. Fuera de la home dejamos que el href (/#inicio)
    // navegue de verdad: antes el preventDefault cancelaba el salto y en /admin
    // el click no hacía nada.
    if (e && pathname === "/") {
      e.preventDefault();
      setAbierto(false);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      setSeccionActiva("inicio");
      return;
    }
    setAbierto(false);
    setSeccionActiva("inicio");
  };

  // Desplazamiento a una sección.
  //
  // Va con scrollIntoView y no con window.scrollTo por dos motivos:
  //  1) globals.css define `section[id] { scroll-margin-top: 78px / 84px }`,
  //     así que el scrollIntoView deja la sección justo en el cambio de color
  //     sin que Calculate el offset a mano.
  //  2) `html, body { overflow-x: hidden }` (globals.css) convierte al raíz en
  //     contenedor de scroll, y con eso window.scrollTo deja de ser confiable:
  //     respondía la primera vez y después ya no bajaba.
  //
  // El scroll va en requestAnimationFrame porque antes cerramos el menú: sin
  // esperar a que React monte el DOM, el panel todavía ocupa lugar y falsea el
  // cálculo de la posición destino.
  const irASeccion = (e, id) => {
    if (pathname !== "/") return false;
    e.preventDefault();
    setAbierto(false);
    setSeccionActiva(id);
    const destinoId = id === "staff" ? "equipo" : id;
    requestAnimationFrame(() => {
      const destino = document.getElementById(destinoId);
      if (!destino) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return true;
  };

  // Un solo handler para los dos menús. El móvil antes hacía setAbierto(false)
  // y dejaba que el navegador siguiera el hash: al desmontarse el <a> en el
  // mismo click, la activación se perdía y el menú no hacía nada.
  const irAlLink = (e, link) => {
    if (link.id === "inicio") {
      irArriba(e);
      return;
    }
    irASeccion(e, link.id);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Velo para cerrar el menú al tocar afuera */}
      {abierto && (
        <div
          aria-hidden="true"
          onClick={() => setAbierto(false)}
          className="fixed inset-0 z-40 bg-transparent lg:hidden"
        />
      )}

      {/* Franja superior — azul, marquesina continua, se repliega al deslizar */}
      <div
        className={`
          relative z-[60] flex w-full items-center overflow-hidden px-0 text-center
          transition-all duration-500
          ${scrolled ? "max-h-0 py-0 opacity-0" : "max-h-[40px] py-2.5 opacity-100"}
        `}
        style={{
          background:
            "linear-gradient(90deg, #0F3A7A 0%, #2AA3D5 50%, #0F3A7A 100%)",
        }}
      >
        <div className="animate-marquee flex w-max shrink-0 items-center">
          {[0, 1].map((copia) => (
            <div key={copia} aria-hidden={copia > 0} className="flex items-center">
              {[
                "CRYBE · Centro de Rehabilitación y Bienestar Emocional",
                "Atención integral para todas las edades",
                "Fonoaudiología · Kinesiología · Psicología · Psiquiatría",
                "Profesionales especializados",
                "Alquiler de módulos: sumate al equipo",
              ].map((texto) => (
                <span key={texto} className="flex items-center">
                  <span className="whitespace-nowrap px-10 text-[10px] font-bold tracking-wide text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] sm:text-[11.5px] md:text-[13px]">
                    {texto}
                  </span>
                  <span aria-hidden="true" className="mx-2 h-1 w-1 rounded-full bg-white/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <header
      style={{
        background: scrolled
          ? "rgba(255,255,255,0.55)"
          : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
      }}
      className={`
        relative
        z-[70]
        transition-[background-color,box-shadow,backdrop-filter]
        duration-500
        ease-in-out
        ${
          scrolled
            ? "shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
            : ""
        }
      `}
      >
      <nav
        className="
          mx-auto
          flex
          h-[78px]
          max-w-[1500px]
          items-center
          justify-between
          px-5
          md:px-7
          lg:h-[84px]
          lg:px-8
          xl:px-10
        "
      >
        {/* IDENTIDAD */}
        <Link
          href="/#inicio"
          onClick={irArriba}
          className="
            flex
            shrink-0
            items-center
            gap-2
            xl:gap-3
          "
          aria-label="CRYBE - Inicio"
        >
          <img
            src="/logoSinFondo.png"
            alt="Logo CRYBE"
            className="
              h-[52px]
              w-auto
              object-contain
              sm:h-[56px]
              md:h-[62px]
              lg:h-[66px]
              xl:h-[72px]
            "
          />

          <div
            className="
              hidden
              border-l
              border-[#D8E5F1]
              pl-2
              sm:block
              lg:pl-3
            "
          >
            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                leading-[1.45]
                tracking-[0.05em]
                text-[#111111]
                md:text-[12px]
                lg:text-[13px]
              "
            >
              Centro de Rehabilitación
              <br />
              y Bienestar Emocional
            </p>
          </div>
        </Link>

        {/* DESKTOP */}
        <div
          className="
            hidden
            items-center
            gap-4
            lg:flex
            xl:gap-7
          "
        >
          {links.map((link) => {
            const activo =
              seccionActiva === link.id;

            return (
              <a
                key={link.nombre}
                href={link.href}
                onClick={(e) => irAlLink(e, link)}
                className={`
                  group
                  relative
                  flex
                  h-[40px]
                  items-center
                  whitespace-nowrap
                  text-[14px]
                  font-semibold
                  transition-colors
                  duration-300
                  xl:text-[15px]
                  ${
                    activo
                      ? "text-[#0F3A7A]"
                      : "text-[#1F1F1F] hover:text-[#0F3A7A]"
                  }
                `}
              >
                {link.nombre}

                <span
                  className={`
                    absolute
                    -bottom-[2px]
                    left-1/2
                    h-[3px]
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-r
                    from-[#0F3A7A]
                    via-[#2AA3D5]
                    to-[#7CD2EC]
                    transition-all
                    duration-300
                    ${
                      activo
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-60"
                    }
                  `}
                />
              </a>
            );
          })}
        </div>


        {/* LADO DERECHO: perfil + consulta.
            Van juntos en un solo contenedor para que el justify-between de la
            nav siempre tenga los mismos hijos: si el perfil no está (sin sesión),
            el menú no se corre de lugar. */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          {mostrarAdmin && (
            <div ref={menuUsuarioRef} className="relative shrink-0">
            <button
              ref={botonUsuarioRef}
              type="button"
              onClick={() => {
                if (menuUsuario) setPanel(null);
                setMenuUsuario(!menuUsuario);
              }}
              aria-haspopup="menu"
              aria-expanded={menuUsuario}
              aria-label="Menú de usuario"
              className="
                flex
                items-center
                gap-1
                rounded-full
                p-0.5
                transition
                hover:bg-black/5
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0F3A7A]/40
              "
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={adminAvatar || "/logoSinFondo.png"}
                alt=""
                className="h-9 w-9 rounded-full bg-white object-cover ring-2 ring-lila-500"
              />
              <ChevronDown
                size={15}
                strokeWidth={2.2}
                className={`
                  shrink-0
                  text-[#5B6B7B]
                  transition-transform
                  duration-200
                  ${menuUsuario ? "rotate-180" : ""}
                `}
              />
            </button>

            {menuUsuario && panel && (
              <div
                role="menu"
                style={{
                  top: panel.top,
                  left: panel.left,
                  width: panel.ancho,
                }}
                className="
                  fixed
                  z-[70]
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  py-1
                  shadow-[0_10px_30px_-8px_rgba(15,58,122,0.25)]
                "
              >
                <div className="border-b border-[#F1F3F5] px-4 py-3">
                  <p className="truncate text-[13.5px] font-semibold text-[#111827]">
                    {`Bienvenida/o ${mostrarAdminNombre}`}
                  </p>
                  {adminEmail && (
                    <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">
                      {adminEmail}
                    </p>
                  )}
                </div>
                <a
                  href="/admin"
                  role="menuitem"
                  onClick={() => setMenuUsuario(false)}
                  className="
                    flex
                    items-center
                    gap-2.5
                    px-4
                    py-2.5
                    text-[13.5px]
                    font-medium
                    text-[#374151]
                    transition-colors
                    hover:bg-[#F3F4F6]
                  "
                >
                  <User size={16} className="shrink-0 text-[#6B7280]" />
                  Mi perfil
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuUsuario(false);
                    // El logout real lo hace el server action; el refresh limpio
                    // el estado del cliente y del layout de /admin de una vez.
                    setAdminEmail(null);
                    setAdminAvatar("");
                    cerrarSesion();
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2.5
                    px-4
                    py-2.5
                    text-left
                    text-[13.5px]
                    font-semibold
                    text-red-600
                    transition-colors
                    hover:bg-red-50
                    hover:text-red-700
                  "
                >
                  <LogOut size={16} className="shrink-0 text-red-600" />
                  Cerrar sesión
                </button>
              </div>
            )}
            </div>
          )}

          {mostrarConsulta && (
            <Link
              href="/#contacto"
              onClick={() => setSeccionActiva("contacto")}
              style={{
                background:
                  "linear-gradient(90deg, #0F3A7A 0%, #2AA3D5 50%, #0F3A7A 100%)",
                color: "#FFFFFF",
              }}
              className="
                flex
                items-center
                whitespace-nowrap
                rounded-full
                px-4
                py-2.5
                text-[12.5px]
                font-semibold
                shadow-[0_8px_22px_rgba(15,58,122,0.35)]
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:shadow-[0_12px_28px_rgba(15,58,122,0.45)]
                hover:brightness-110
                xl:px-5
                xl:text-[13.5px]
              "
            >
              <span style={{ color: "#FFFFFF" }}>Hacé tu consulta</span>
            </Link>
          )}
        </div>

        {/* MOBILE + TABLET: CTA compacto afuera + hamburguesa */}
        <div className="flex items-center gap-2 lg:hidden">
          {mostrarConsulta && (
          <Link
            href="/#contacto"
            onClick={() => {
              setAbierto(false);
              setSeccionActiva("contacto");
            }}
            style={{
              background:
                "linear-gradient(90deg, #0F3A7A 0%, #2AA3D5 50%, #0F3A7A 100%)",
              color: "#FFFFFF",
            }}
            className="
              flex
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              px-4
              py-1
              text-[11.5px]
              font-semibold
              min-h-8
              shadow-[0_8px_22px_rgba(15,58,122,0.35)]
              transition-all
              duration-300
              hover:brightness-110
              sm:px-5
              sm:text-[13px]
              sm:py-2
            "
          >
            <span style={{ color: "#FFFFFF" }}>Hacé tu consulta</span>
          </Link>
          )}

          {/* Sesión en mobile/tablet: avatar a la izquierda de la hamburguesa.
              Reutiliza el mismo panel anclado a la pantalla que en desktop. */}
          {mostrarAdmin && (
            <div ref={menuUsuarioMobileRef} className="relative shrink-0">
              <button
                ref={botonUsuarioMobileRef}
                type="button"
                onClick={() => {
                  if (menuUsuario) setPanel(null);
                  setMenuUsuario(!menuUsuario);
                }}
                aria-haspopup="menu"
                aria-expanded={menuUsuario}
                aria-label="Menú de usuario"
                className="
                  flex
                  items-center
                  gap-1
                  rounded-full
                  p-0.5
                  transition
                  hover:bg-black/5
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#0F3A7A]/40
                "
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adminAvatar || "/logoSinFondo.png"}
                  alt=""
                  className="h-9 w-9 rounded-full bg-white object-cover ring-2 ring-lila-500"
                />
                <ChevronDown
                  size={15}
                  strokeWidth={2.2}
                  className={`
                    shrink-0
                    text-[#5B6B7B]
                    transition-transform
                    duration-200
                    ${menuUsuario ? "rotate-180" : ""}
                  `}
                />
              </button>

              {menuUsuario && panel && (
                <div
                  role="menu"
                  style={{
                    top: panel.top,
                    left: panel.left,
                    width: panel.ancho,
                  }}
                  className="
                    fixed
                    z-[70]
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    py-1
                    shadow-[0_10px_30px_-8px_rgba(15,58,122,0.25)]
                  "
                >
                  <div className="border-b border-[#F1F3F5] px-4 py-3">
                    <p className="truncate text-[13.5px] font-semibold text-[#111827]">
                      {`Bienvenida/o ${mostrarAdminNombre}`}
                    </p>
                    {adminEmail && (
                      <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">
                        {adminEmail}
                      </p>
                    )}
                  </div>
                  <a
                    href="/admin"
                    role="menuitem"
                    onClick={() => setMenuUsuario(false)}
                    className="
                      flex
                      items-center
                      gap-2.5
                      px-4
                      py-2.5
                      text-[13.5px]
                      font-medium
                      text-[#374151]
                      transition-colors
                      hover:bg-[#F3F4F6]
                    "
                  >
                    <User size={16} className="shrink-0 text-[#6B7280]" />
                    Mi perfil
                  </a>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuUsuario(false);
                      setAdminEmail(null);
                      setAdminAvatar("");
                      cerrarSesion();
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2.5
                      px-4
                      py-2.5
                      text-left
                      text-[13.5px]
                      font-semibold
                      text-red-600
                      transition-colors
                      hover:bg-red-50
                      hover:text-red-700
                    "
                  >
                    <LogOut size={16} className="shrink-0 text-red-600" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setAbierto((prev) => !prev)
            }
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              text-[#111111]
              transition
              hover:bg-[#F1F3F5]
            "
          aria-label={
            abierto
              ? "Cerrar menú"
              : "Abrir menú"
          }
          aria-expanded={abierto}
        >
          {abierto ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
          </button>
        </div>
      </nav>

      {/* MENÚ MOBILE / TABLET - blanco sólido, tapa hero/texto para lectura */}
      {abierto && (
        <div
          style={{
            background: "#FFFFFF",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
          className="
            absolute
            inset-x-0
            top-full
            z-[70]
            max-h-[calc(100vh-110px)]
            overflow-y-auto
            overscroll-contain
            border-t
            border-[#E9EEF5]
            px-4
            py-0
            shadow-[0_16px_30px_-12px_rgba(15,58,122,0.18)]
            sm:px-6
            lg:hidden
          "
        >
          <div className="mx-auto flex w-full max-w-[1500px] flex-col divide-y divide-[#D8E5F1]">
            {links.map((link) => {
              const activo =
                seccionActiva === link.id;

              return (
                <a
                  key={link.nombre}
                  href={link.href}
                  onClick={(e) => irAlLink(e, link)}
                  className={`
                    group
                    relative
                    flex
                    min-h-[38px]
                    items-center
                    justify-center
                    px-3
                    py-2
                    text-[13px]
                    font-semibold
                    tracking-wide
                    transition-colors
                    duration-300
                    sm:min-h-[36px]
                    sm:text-[13.5px]
                    ${
                      activo
                        ? "text-[#0F3A7A]"
                        : "text-[#1F1F1F] hover:text-[#0F3A7A]"
                    }
                  `}
                >
                  {link.nombre}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
      {/* Velo suave detrás del navbar — solo arriba del todo, sin bordes */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px]
          transition-opacity duration-500
          ${scrolled ? "opacity-0" : "opacity-100"}
        `}
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};

export default Navbar;
