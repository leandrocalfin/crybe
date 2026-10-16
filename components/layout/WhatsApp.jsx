"use client";
const WHATSAPP_DEF = "5492984254590";
const WhatsApp = ({ numero }) => {
  const href = `https://wa.me/${numero || WHATSAPP_DEF}?text=Hola%2C%20quiero%20hacer%20una%20consulta.`;
  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      
      {/* ONDAS */}
      <span className="whatsapp-pulse whatsapp-pulse-1" />
      <span className="whatsapp-pulse whatsapp-pulse-2" />

      {/* BOTÓN */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="
          relative z-10
          flex h-[52px] w-[52px]
          items-center justify-center
          rounded-full
          bg-[#25D366]
          shadow-[0_8px_25px_rgba(37,211,102,0.35)]
          transition-all duration-300
          hover:scale-110
          sm:h-[56px] sm:w-[56px]
          md:h-[60px] md:w-[60px]
        "
      >
        <svg
          viewBox="0 0 32 32"
          className="h-[28px] w-[28px] fill-white sm:h-[31px] sm:w-[31px] md:h-[34px] md:w-[34px]"
          aria-hidden="true"
        >
          <path d="M16.004 3C8.832 3 3 8.832 3 16c0 2.293.598 4.531 1.734 6.504L3 29l6.66-1.746A12.94 12.94 0 0 0 16 28.996C23.168 28.996 29 23.164 29 16S23.168 3 16.004 3Zm0 23.805a10.77 10.77 0 0 1-5.492-1.504l-.395-.234-3.953 1.035 1.055-3.852-.258-.398A10.77 10.77 0 0 1 5.195 16c0-5.957 4.848-10.805 10.809-10.805 5.957 0 10.805 4.848 10.805 10.805s-4.848 10.805-10.805 10.805Zm5.926-8.09c-.324-.164-1.922-.949-2.219-1.059-.297-.109-.516-.164-.73.164-.215.324-.84 1.059-1.027 1.273-.188.219-.379.246-.703.082-.324-.16-1.371-.504-2.609-1.609-.965-.859-1.617-1.922-1.805-2.246-.191-.324-.02-.5.141-.66.148-.145.324-.379.488-.57.16-.188.215-.324.324-.539.109-.219.055-.406-.027-.57-.082-.16-.73-1.758-1-2.406-.266-.633-.535-.547-.73-.559h-.625c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.598 1.164 3.141 1.324 3.359.164.215 2.289 3.496 5.547 4.902.773.336 1.379.535 1.852.684.777.246 1.484.211 2.043.129.625-.094 1.922-.785 2.191-1.543.27-.758.27-1.406.188-1.543-.082-.137-.297-.219-.621-.379Z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsApp;
