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
        className="login-form animate-fade-in"
      >
        <div className="text-center mb-6">
          <div className="login-step-icon-wrapper">
            <i className="fa-solid fa-key"></i>
          </div>
          <h2 className="login-step-title">Configure Gemini API Key</h2>
          <p className="login-step-desc">
            Since you are using the default admin credentials, configure your Gemini API key to enable AI cluster insights.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">
            Gemini API Key
          </label>
          <div className="form-input-wrapper">
            <i className="fa-solid fa-key form-input-icon"></i>
            <input
              type="password"
              placeholder="Enter Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="form-input"
              required={!isAlreadyConfigured}
              autoFocus
            />
          </div>
        </div>

        {apiKeyError && (
          <div className="form-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{apiKeyError}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={apiKeyLoading}
            className="form-submit-btn"
          >
            {apiKeyLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Verifying...
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check"></i> Save & Continue
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="form-secondary-btn"
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
      className="login-form"
    >
      <div className="form-group">
        <label className="form-label">
          Username
        </label>
        <div className="form-input-wrapper">
          <i className="fa-solid fa-user form-input-icon"></i>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Password
        </label>
        <div className="form-input-wrapper">
          <i className="fa-solid fa-lock form-input-icon"></i>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {error && (
        <div className="form-error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="form-submit-btn"
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin"></i> Signing In...
          </>
        ) : (
          <>
            <i className="fa-solid fa-right-to-bracket"></i> Sign In
          </>
        )}
      </button>
    </form>
  );
}