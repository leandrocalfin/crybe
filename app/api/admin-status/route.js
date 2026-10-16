import { NextResponse } from "next/server";
import { getAdminUser } from "../../../lib/supabaseServer";

// Dice si hay sesión de admin sin exponer nada sensible.
export async function GET() {
  try {
    const { sb, user, isAdmin } = await getAdminUser();
    if (!user || !isAdmin) return NextResponse.json({ admin: null });
    let avatar = "";
    if (sb) {
      const { data } = await sb.from("ajustes").select("valor").eq("clave", "avatar").maybeSingle();
      avatar = data?.valor || "";
    }
    return NextResponse.json({ admin: { email: user.email, avatar } });
  } catch {
    return NextResponse.json({ admin: null });
  }
}
