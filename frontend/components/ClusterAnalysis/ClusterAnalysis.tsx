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
      return { label: "CRITICAL", className: "critical", icon: "fa-circle-radiation" };
    }

    if (text.includes("high")) {
      return { label: "HIGH", className: "high", icon: "fa-triangle-exclamation" };
    }

    if (text.includes("medium")) {
      return { label: "MEDIUM", className: "medium", icon: "fa-circle-info" };
    }

    if (text.includes("low")) {
      return { label: "LOW", className: "low", icon: "fa-circle-check" };
    }

    return null;
  };

  const severity = type === "pod" ? getSeverity() : null;

  return (
    <div className="cluster-analysis">
      <div className="analysis-header">
        <h2>
          {type === "cluster" ? (
            <>
              <i className="fa-solid fa-circle-nodes"></i> AI Cluster Analysis
            </>
          ) : (
            <>
              <i className="fa-solid fa-brain"></i> AI Pod Analysis
            </>
          )}
        </h2>
        <button className="close-button" onClick={onClose} aria-label="Close analysis">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {loading && (
        <p className="loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i> {type === "cluster" ? "Analyzing Kubernetes cluster..." : "Analyzing Kubernetes pod..."}
        </p>
      )}

      {error && (
        <p className="error">
          <i className="fa-solid fa-triangle-exclamation"></i> {error}
        </p>
      )}

      {!loading && !error && analysis && (
        <>
          <div className="analysis-toolbar">
            {severity && (
              <div className={`severity-badge ${severity.className}`}>
                <i className={`fa-solid ${severity.icon}`}></i> {severity.label}
              </div>
            )}
            <button
              className="copy-button"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <i className="fa-solid fa-check"></i> Copied!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-copy"></i> Copy Analysis
                </>
              )}
            </button>
          </div>

          <div className="analysis-content">
            <ReactMarkdown
              components={{
                h2({ children, ...props }) {
                  const text = String(children || "");
                  const lowerText = text.toLowerCase();
                  if (lowerText.includes("critical issues") || lowerText.includes("root cause")) {
                    return <h2 className="markdown-critical-title" {...props}>{children}</h2>;
                  }
                  if (lowerText.includes("warnings") || lowerText.includes("evidence") || lowerText.includes("severity")) {
                    return <h2 className="markdown-warning-title" {...props}>{children}</h2>;
                  }
                  if (lowerText.includes("recommendations") || lowerText.includes("best practices")) {
                    return <h2 className="markdown-info-title" {...props}>{children}</h2>;
                  }
                  return <h2 {...props}>{children}</h2>;
                }
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}