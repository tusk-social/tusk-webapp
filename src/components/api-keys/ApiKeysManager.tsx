"use client";
import { useEffect, useState } from "react";
import { ApiKeyWithoutSecret } from "@/services/apiKeyService";
import { Loader2, Copy, Key, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function ApiKeysManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyWithoutSecret[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeySecret, setNewKeySecret] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  async function loadApiKeys() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/api-keys");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to load API keys");
      setApiKeys(data.keys);
    } catch (error) {
      console.error("Failed to load API keys:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load API keys",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function createApiKey(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const text = await response.text(); // First get the raw text
      let data;
      try {
        data = JSON.parse(text); // Then try to parse it
      } catch (e) {
        console.error("Invalid JSON response:", text);
        if (response.status === 401) {
          throw new Error("Please log in to create an API key");
        }
        throw new Error("Invalid server response");
      }

      if (!response.ok)
        throw new Error(data.error || "Failed to create API key");

      setNewKeySecret(data.secret);
      setApiKeys((prev) => [data.key, ...prev]);
      setNewKeyName("");
    } catch (error) {
      console.error("Failed to create API key:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create API key",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function revokeApiKey(keyId: string) {
    try {
      setError(null);
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to revoke API key");

      setApiKeys((prev) =>
        prev.map((key) =>
          key.id === keyId ? { ...key, isActive: false } : key,
        ),
      );
    } catch (error) {
      console.error("Failed to revoke API key:", error);
      setError(
        error instanceof Error ? error.message : "Failed to revoke API key",
      );
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("API key copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setError("Failed to copy to clipboard");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#be3fd5] text-white rounded-full hover:bg-[#be3fd5]/90 transition-colors text-sm font-medium"
        >
          <Key className="w-4 h-4 mr-2" />
          Create API Key
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create API Key</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewKeySecret(null);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {newKeySecret ? (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium text-yellow-500">Important</p>
                        <p className="text-sm text-yellow-500/90">
                          This API key will only be shown once. Please copy it
                          now and store it securely.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-200">
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeySecret}
                        readOnly
                        className="flex-1 bg-black border border-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3fd5] focus:border-transparent"
                      />
                      <button
                        onClick={() => copyToClipboard(newKeySecret)}
                        className="px-3 py-2 bg-black border border-gray-800 rounded-full hover:bg-gray-900 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setNewKeySecret(null);
                        setError(null);
                      }}
                      className="px-4 py-2 bg-[#be3fd5] text-white rounded-full hover:bg-[#be3fd5]/90 transition-colors text-sm font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={createApiKey}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-200"
                      >
                        Key Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="e.g., Development API Key"
                        value={newKeyName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewKeyName(e.target.value)
                        }
                        required
                        className="w-full bg-black border border-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#be3fd5] focus:border-transparent"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="px-4 py-2 bg-[#be3fd5] text-white rounded-full hover:bg-[#be3fd5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center text-sm font-medium"
                      >
                        {isCreating && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Create Key
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No API keys found. Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 rounded-2xl border border-gray-800 space-y-4 bg-black"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-200">{key.name}</p>
                    <p className="text-sm text-gray-500">
                      Created {format(new Date(key.createdAt), "PPP")}
                    </p>
                    {key.lastUsedAt && (
                      <p className="text-sm text-gray-500">
                        Last used {format(new Date(key.lastUsedAt), "PPP")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {key.isActive ? (
                      <button
                        onClick={() => revokeApiKey(key.id)}
                        className="px-4 py-1.5 text-sm bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors font-medium"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">Revoked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
