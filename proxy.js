import { updateSession } from "./lib/supabaseMiddleware";

export default async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
