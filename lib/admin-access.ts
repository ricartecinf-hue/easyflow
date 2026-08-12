import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/lib/access-control";

export async function getSystemAdminSession() {
  const session = await auth();
  if (!session?.user?.id || !isSystemAdmin(session.user.email)) return null;
  return session;
}
