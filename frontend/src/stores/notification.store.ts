import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaymentStatus } from "../types/payment";

export interface NotificationItem {
  id: string;
  reservationId: number;
  bookingCode: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  knownPaymentStatus: Record<number, PaymentStatus | null>;
  addNotification: (
    notification: Omit<NotificationItem, "id" | "createdAt" | "read">
  ) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  setKnownStatus: (reservationId: number, status: PaymentStatus | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      knownPaymentStatus: {},

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `${notification.reservationId}-${Date.now()}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // batasi max 50 biar localStorage tidak membengkak
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      setKnownStatus: (reservationId, status) =>
        set((state) => ({
          knownPaymentStatus: {
            ...state.knownPaymentStatus,
            [reservationId]: status,
          },
        })),
    }),
    {
      name: "property-app-notifications",
    }
  )
);