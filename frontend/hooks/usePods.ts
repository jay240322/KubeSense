"use client";

import { useEffect, useState } from "react";
import { getPods } from "@/services/api";
import { Pod } from "@/types/pod";

export default function usePods(){
    const [pods, setPods ] = useState<Pod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError ] = useState("");

    useEffect(() => {
        async function loadPods(){
            try {
                const data = await getPods();
                setPods(data.pods);
            } catch (err) {
                setLoading(false);
            }            
        }
        loadPods();
    }, []);
    return {
        pods,
        loading,
        error,
    };
}