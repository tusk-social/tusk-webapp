import AppLayout from "@/components/layout/AppLayout";
import ApiKeysManager from "@/components/api-keys/ApiKeysManager";

export const metadata = {
  title: "API Keys | Tusk",
  description: "Manage your API keys for external integrations",
};

export default function ApiKeysPage() {
  return (
    <AppLayout>
      <main className="flex-1 min-h-screen border-l border-r border-gray-800 max-w-[600px]">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800">
          <h1 className="text-xl font-bold p-4">API Keys</h1>
        </div>
        <div className="p-4">
          <ApiKeysManager />
        </div>
      </main>
    </AppLayout>
  );
}
