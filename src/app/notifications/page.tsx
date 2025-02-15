import AppLayout from "@/components/layout/AppLayout";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationTabs from "@/components/notifications/NotificationTabs";

export default function NotificationsPage() {
  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">Notifications</h1>
          <NotificationTabs />
        </div>
        <NotificationList />
      </main>
    </AppLayout>
  );
} 