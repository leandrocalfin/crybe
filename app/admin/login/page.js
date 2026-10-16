import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUser } from "../../../lib/supabaseServer";
import FormularioLogin from "./FormularioLogin";

// Si ya hay sesión de admin no tiene sentido mostrar el formulario: el link
// "Acceso admin" del footer apunta acá y obligaba a volver a loguearse.
// Solo redirige si isAdmin: alguien logueado que no es admin igual puede
// entrar con otra cuenta.
export default async function AdminLogin() {
  const { isAdmin } = await getAdminUser().catch(() => ({ isAdmin: false }));
  if (isAdmin) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#E9F1F8] via-[#F4F8FB] to-[#E2EBF4] px-4 py-10">
      <Suspense>
        <FormularioLogin />
      </Suspense>
    </main>
  );
}