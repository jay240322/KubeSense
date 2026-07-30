"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step state for Gemini API key configuration
  const [showApiKeyStep, setShowApiKeyStep] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [isAlreadyConfigured, setIsAlreadyConfigured] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Log the user in to AuthContext so subsequent requests use the JWT token
      login(data.access_token);

      // Check if credentials are the default KubeSense ones
      if (username === "admin" && password === "KubeSense@123") {
        // Fetch current settings to see if Gemini is already configured
        try {
          const settingsRes = await fetch("/api/v1/settings", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.access_token}`,
            },
          });
          if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            setIsAlreadyConfigured(!!settingsData.geminiConfigured);
          }
        } catch (err) {
          console.error("Failed to check if Gemini API key is configured:", err);
        }
        setShowApiKeyStep(true);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleApiKeySubmit(e: React.FormEvent) {
    e.preventDefault();

    setApiKeyLoading(true);
    setApiKeyError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "/api/v1/settings/gemini",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gemini_api_key: apiKey,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save Gemini API key.");
      }

      router.push("/dashboard");
    } catch (err) {
      let errMsg = "Invalid Gemini API Key. Please try again.";
      if (err instanceof Error) {
        try {
          // If error is JSON, try to parse details
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.detail) {
            errMsg = parsed.detail;
          } else {
            errMsg = err.message;
          }
        } catch {
          errMsg = err.message;
        }
      }
      setApiKeyError(errMsg);
    } finally {
      setApiKeyLoading(false);
    }
  }

  if (showApiKeyStep) {
    return (
      <form
        onSubmit={handleApiKeySubmit}
        className="space-y-6 animate-fade-in"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
            🔑
          </div>
          <h2 className="text-xl font-bold text-white">Configure Gemini API Key</h2>
          <p className="text-slate-400 text-sm mt-1">
            Since you are using the default admin credentials, configure your Gemini API key to enable AI cluster insights.
          </p>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Gemini API Key
          </label>
          <input
            type="password"
            placeholder="Enter Gemini API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500 placeholder-slate-500 text-sm"
            required={!isAlreadyConfigured}
            autoFocus
          />
        </div>

        {apiKeyError && (
          <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-400 text-xs">
            {apiKeyError}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={apiKeyLoading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 text-sm cursor-pointer"
          >
            {apiKeyLoading ? "Verifying & Saving..." : "Save & Continue"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-xl border border-slate-700 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 text-sm cursor-pointer"
          >
            {isAlreadyConfigured ? "Skip to Dashboard" : "Skip for Now"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Username
        </label>

        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500 text-sm"
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500 text-sm"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 text-sm cursor-pointer"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}