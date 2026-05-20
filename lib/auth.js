import { cookies } from "next/headers";
import { verifyToken } from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== 'admin') {
    return null;
  }
  return session;
}
