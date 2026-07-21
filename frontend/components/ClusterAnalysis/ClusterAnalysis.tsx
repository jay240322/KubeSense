import "./ClusterAnalysis.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type ClusterAnalysisProps = {
  analysis: string;
  loading: boolean;
  error: string;
};

export default function ClusterAnalysis({
  analysis,
  loading,
  error,
}: ClusterAnalysisProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!analysis) return;

    await navigator.clipboard.writeText(analysis);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="cluster-analysis">
      <h2>🌐 AI Cluster Analysis</h2>

      {loading && (
        <p className="loading">
          Analyzing Kubernetes cluster...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {!loading && !error && analysis && (
        <>
          <div className="analysis-toolbar">
            <button
              className="copy-button"
              onClick={handleCopy}
            >
              {copied ? "✅ Copied!" : "📋 Copy Analysis"}
            </button>
          </div>

          <div className="analysis-content">
            <ReactMarkdown>
              {analysis}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}