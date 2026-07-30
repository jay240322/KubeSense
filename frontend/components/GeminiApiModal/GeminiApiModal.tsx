"use client";

import { useState, useEffect } from "react";
import useGeminiSettings from "@/hooks/useGeminiSettings";

import "./GeminiApiModal.css";

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
  const {
    loading,
    error,
    apiKey: savedApiKey,
    checkConfiguration,
    save,
  } = useGeminiSettings();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkConfiguration();
    }
  }, [isOpen]);

  useEffect(() => {
    if (savedApiKey) {
      setApiKeyInput(savedApiKey);
    }
  }, [savedApiKey]);

  if (!isOpen) return null;

  async function handleSave() {
    const success = await save(apiKeyInput);

    if (success) {
      onSuccess();
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fa-solid fa-key"></i> Configure Gemini API Key
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
          <p>
            Enter your Gemini API key to enable AI cluster analytics and troubleshooting.
          </p>

          <label className="modal-input-label">Gemini API Key</label>
          <div className="modal-input-wrapper">
            <input
              type={showKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter Gemini API Key"
              className="modal-input"
            />
            <button
              type="button"
              className="modal-toggle-visibility"
              onClick={() => setShowKey(!showKey)}
            >
              <i className={`fa-solid ${showKey ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          {error && (
            <div className="modal-error">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button className="modal-btn cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button
              className="modal-btn save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}