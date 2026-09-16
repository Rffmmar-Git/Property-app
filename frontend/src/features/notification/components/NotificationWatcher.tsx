import { useNotificationWatcher } from "../hooks/useNotificationWatcher";
import { user_role } from "@/routes/route-config";

function getParsedAuth(): { token: string; role: string } {
  const rawAuth = localStorage.getItem("property-app-auth");
  if (!rawAuth) return { token: "", role: "" };
  try {
    const parsedAuth = JSON.parse(rawAuth);
    return {
      token: parsedAuth.state?.accessToken || "",
      role: parsedAuth.state?.user?.role || "",
    };
  } catch {
    return { token: "", role: "" };
  }
}

export function NotificationWatcher() {
  const { token, role } = getParsedAuth();
  const isCustomer = Boolean(token) && role === user_role.CUSTOMER;

  // Jalankan hook watcher hanya jika user adalah Customer yang valid
  useNotificationWatcher();

  // Jika bukan customer, jangan render apa pun (watcher diam di latar belakang)
  if (!isCustomer) {
    return null;
  }

  return null;
}