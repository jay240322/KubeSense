"use client";

import { useEffect, useState } from "react";
import { getPods } from "@/services/api";
import { Pod } from "@/types/pod";

export default function usePods() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPods() {
      try {
        const data = await getPods();
        setPods(data.pods);
      } catch (err) {
        setError("Failed to fetch pods");
      } finally {
        setLoading(false);
      }
    }

    fetchPods();
  }, []);

  return {
    pods,
    loading,
    error,
  };
}