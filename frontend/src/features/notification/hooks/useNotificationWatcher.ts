import { useEffect } from "react";
import { useMyReservations } from "@/features/reservation/hooks/useMyReservation";
import { useNotificationStore } from "@/stores/notification.store";
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

const POLL_INTERVAL_MS = 15000;

export function useNotificationWatcher() {
  const { token, role } = getParsedAuth();
  const isCustomer = Boolean(token) && role === user_role.CUSTOMER;

  const { data: reservations } = useMyReservations({
    enabled: isCustomer,
    refetchInterval: isCustomer ? POLL_INTERVAL_MS : false,
  });

  const notifications = useNotificationStore((s) => s.notifications); // Asumsikan store menyimpan list notifikasi
  const addNotification = useNotificationStore((s) => s.addNotification);
  const setKnownStatus = useNotificationStore((s) => s.setKnownStatus);

  useEffect(() => {
    if (!reservations) return;

    reservations.forEach((reservation) => {
      const currentStatus = reservation.paymentStatus;

      // Contoh: Jika status ACCEPTED, kita pastikan itu masuk ke notifikasi
      if (currentStatus === "ACCEPTED") {
        // Cek apakah notifikasi untuk reservation.id ini sudah pernah dimasukkan sebelumnya
        // agar tidak duplikat setiap kali polling berjalan
        const alreadyNotified = notifications.some(
          (n) => n.reservationId === reservation.id
        );

        if (!alreadyNotified) {
          addNotification({
            reservationId: reservation.id,
            bookingCode: reservation.bookingCode,
            message: `Pembayaran untuk booking ${reservation.bookingCode} telah dikonfirmasi oleh tenant.`,
          });
        }
      }

      // Perbarui status yang diketahui
      setKnownStatus(reservation.id, currentStatus);
    });
  }, [reservations, notifications, addNotification, setKnownStatus]);
}