import "./ClusterAnalysis.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type ClusterAnalysisProps = {
  type: "cluster" | "pod";
  analysis: string;
  loading: boolean;
  error: string;
  onClose: () => void;
};

export default function ClusterAnalysis({
  type,
  analysis,
  loading,
  error,
  onClose,
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

  const getSeverity = () => {
    if (!analysis) return null;
    const text = analysis.toLowerCase();

    if (text.includes("critical")) {
      return { label: "🔴 CRITICAL", className: "critical" };
    }

    if (text.includes("high")) {
      return { label: "🟠 HIGH", className: "high" };
    }

    if (text.includes("medium")) {
      return { label: "🟡 MEDIUM", className: "medium" };
    }

    if (text.includes("low")) {
      return { label: "🟢 LOW", className: "low" };
    }

    return null;
  };

  const severity = type === "pod" ? getSeverity() : null;

  return (
    <div className="cluster-analysis">
      <div className="analysis-header">
        <h2>
          {type === "cluster" ? "🌐 AI Cluster Analysis" : "🤖 AI Pod Analysis"}
        </h2>
        <button className="close-button" onClick={onClose} aria-label="Close analysis">
          ✕
        </button>
      </div>

      {loading && (
        <p className="loading">
          {type === "cluster" ? "Analyzing Kubernetes cluster..." : "Analyzing Kubernetes pod..."}
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
            {severity && (
              <div className={`severity-badge ${severity.className}`}>
                {severity.label}
              </div>
            )}
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