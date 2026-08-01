import { useState } from "react";

import {
  getGeminiSettings,
  saveGeminiApiKey,
} from "@/services/api";

export default function useGeminiSettings() {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  async function checkConfiguration() {
    try {
      setLoading(true);
      setError("");

      const result = await getGeminiSettings();

      const savedInstanceId = localStorage.getItem("server_instance_id");
      if (result.serverInstanceId && result.serverInstanceId !== savedInstanceId) {
        // Server instance changed (fresh container setup)! Clear local storage API key
        localStorage.removeItem("gemini_api_key");
        localStorage.setItem("server_instance_id", result.serverInstanceId);
        setConfigured(false);
        setApiKey("");
        return false;
      }

      const localKey = localStorage.getItem("gemini_api_key");
      if (localKey) {
        setConfigured(true);
        setApiKey(localKey);
        return true;
      }

      setConfigured(false);
      setApiKey("");
      return false;
    } catch (err) {
      console.error(err);
      setError("Failed to load Gemini settings");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function save(apiKeyInput: string) {
    try {
      setLoading(true);
      setError("");

      // Validate the key on the backend
      await saveGeminiApiKey(apiKeyInput);

      // Save key locally
      localStorage.setItem("gemini_api_key", apiKeyInput);

      // Fetch settings again to guarantee the serverInstanceId is aligned
      const result = await getGeminiSettings();
      if (result.serverInstanceId) {
        localStorage.setItem("server_instance_id", result.serverInstanceId);
      }

      setConfigured(true);
      setApiKey(apiKeyInput);

      return true;
    } catch (err) {
      console.error(err);
      setError("Invalid Gemini API Key");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    configured,
    apiKey,
    error,
    checkConfiguration,
    save,
  };
}