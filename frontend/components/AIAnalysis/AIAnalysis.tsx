import "./AIAnalysis.css";
import ReactMarkdown from "react-markdown";

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
         <div className="analysis-content">
          <ReactMarkdown>
          {analysis}            
          </ReactMarkdown>
        </div>
      )}

    </div>
  );
}