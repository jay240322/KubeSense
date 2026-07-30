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

      setConfigured(result.geminiConfigured);
      setApiKey(result.geminiApiKey || "");

      return result.geminiConfigured;
    } catch (err) {
      console.error(err);
      setError("Failed to load Gemini settings");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function save(apiKey: string) {
    try {
      setLoading(true);
      setError("");

      await saveGeminiApiKey(apiKey);

      setConfigured(true);
      setApiKey(apiKey);

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