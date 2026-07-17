"use client";

import { useEffect, useState } from "react";
import { getPods } from "@/services/api";
import { Pod } from "@/types/pod";

export default function usePods(){
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError ] = useState("");
  
  async function fetchPods() {
    try{
      setLoading(true);
      setError("");

      const data = await getPods();
      setPods(data.pods);
    }catch{
      setError("failed to fetch pods");
    }finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPods();
  }, []);

  return {
    pods,
    loading,
    error,
    refreshPods: fetchPods,
  };
}