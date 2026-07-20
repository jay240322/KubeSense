import "./AIAnalysis.css";

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
        <pre className="analysis-text">
          {analysis}
        </pre>
      )}

    </div>
  );
}