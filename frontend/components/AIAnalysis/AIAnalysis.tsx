import "./AIAnalysis.css";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type AIAnalysisProps = {
  analysis: string;
  loading: boolean;
  error: string;
};

export default function AIAnalysis({
  analysis,
  loading,
  error,
}: AIAnalysisProps) {

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

const severity = getSeverity();

  return (
    <div className="ai-analysis">

      <h2>🤖 AI Analysis</h2>

      {loading && (
        <p className="loading">
          Analyzing Kubernetes pod...
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

          {severity && (
            <div className={`severity-badge ${severity.className}`}>
              {severity.label}
            </div>
          )}

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