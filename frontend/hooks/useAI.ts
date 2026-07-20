import { useState } from "react";
import { analyzePod } from "@/services/api";

export default function useAI(){
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading ] = useState(false);
    const [error, setError ] = useState("");

    async function analyze(
         namespace: string,
         podName: string
    ){
        try {
            setLoading(true);
            setError("");

            const result = await analyzePod(
                namespace,
                podName,
            );

            console.log(result);
            setAnalysis(result.analysis);
        }catch(err){
            console.error(err);
            setError("Failed to analyze pod");
        }finally{
            setLoading(false);
        }
    }

    return{
        analysis,
        loading,
        error,
        analyze,
    };
}