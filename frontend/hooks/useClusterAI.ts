import { useState } from "react";
import { analyzeCluster } from "@/services/api";

export default function useClusterAI() {
  const [analysis, setAnalysis] = useState("");
  const [healthScore, setHealthScore] = useState(0);
  const [pods, setPods] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    try {
      setLoading(true);
      setError("");

      const result = await analyzeCluster();

      setAnalysis(result.analysis);
      setHealthScore(result.health_score);
      setPods(result.pods);

    } catch (err) {
      console.error(err);
      setError("Failed to analyze cluster");
    } finally {
      setLoading(false);
    }
  }

  return {
    analysis,
    healthScore,
    pods,
    loading,
    error,
    analyze,
  };
}