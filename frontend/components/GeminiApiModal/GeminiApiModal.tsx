"use client";

import { useState } from "react";
import useGeminiSettings from "@/hooks/useGeminiSettings";

interface GeminiApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GeminiApiModal({
  isOpen,
  onClose,
  onSuccess,
}: GeminiApiModalProps) {
  const [apiKey, setApiKey] = useState("");

  const {
    loading,
    error,
    save,
  } = useGeminiSettings();

  if (!isOpen) return null;

  async function handleSave() {
    const success = await save(apiKey);

    if (success) {
      setApiKey("");
      onSuccess();
      onClose();
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 500,
          background: "#1f2937",
          color: "white",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <h2>🔑 Configure Gemini API Key</h2>

        <p style={{ marginTop: 10 }}>
          Enter your Gemini API key to enable AI analysis.
        </p>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter Gemini API Key"
          style={{
            width: "100%",
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            border: "1px solid gray",
            background: "#111827",
            color: "white",
          }}
        />

        {error && (
          <p style={{ color: "#ef4444", marginTop: 10 }}>
            {error}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 25,
          }}
        >
          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}