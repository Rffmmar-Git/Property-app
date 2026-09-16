import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/stores/notification.store";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const notifications = useNotificationStore((s) => s.notifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);


    if (nextOpen && unreadCount > 0) {
      setTimeout(() => {
        markAllAsRead();
      }, 0);
    }
  };

  const handleNotificationClick = (reservationId: number | string) => {
    setOpen(false);
    navigate(`/reservations/${String(reservationId)}`);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full p-2 text-midnight-indigo transition-colors hover:bg-slate-100"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[13px] font-semibold text-midnight-indigo">Notifikasi</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-[12px] text-slate-muted">
                Belum ada notifikasi
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.reservationId)}
                  className={`cursor-pointer border-b border-slate-100 px-4 py-3 text-left text-[12px] transition-colors hover:bg-slate-50 last:border-b-0 ${
                    notification.read ? "text-slate-muted" : "font-medium text-midnight-indigo"
                  }`}
                >
                  <p>{notification.message}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {new Date(notification.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}