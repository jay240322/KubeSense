import "./PodDetails.css";

interface PodDetailsProps {
  pod: {
    name: string;
    namespace: string;
    status: string;
    node: string;
    restarts: number;
    age: string;
    images: string[];
  } | null;

  onViewLogs: (namespace: string, podName: string) => void;
  onViewEvents: (namespace: string, podName: string) => void;
}

export default function PodDetails({
  pod,
  onViewLogs,
  onViewEvents,
}: PodDetailsProps) {
  if (!pod) {
    return (
      <div className="pod-details">
        <h2>Pod Details</h2>
        <p>Select a pod to view its details.</p>
      </div>
    );
  }

  return (
    <div className="pod-details">
      <h2>Pod Details</h2>

      <div className="detail-row">
        <span>Name</span>
        <span>{pod.name}</span>
      </div>

      <div className="detail-row">
        <span>Namespace</span>
        <span>{pod.namespace}</span>
      </div>

      <div className="detail-row">
        <span>Status</span>
        <span>{pod.status}</span>
      </div>

      <div className="detail-row">
        <span>Node</span>
        <span>{pod.node}</span>
      </div>

      <div className="detail-row">
        <span>Restarts</span>
        <span>{pod.restarts}</span>
      </div>

      <div className="detail-row">
        <span>Age</span>
        <span>{pod.age}</span>
      </div>

      <div className="images-section">
        <h3>Container Images</h3>

        <ul>
          {pod.images.map((image, index) => (
            <li key={index}>{image}</li>
          ))}
        </ul>
      </div>

      <div className="button-group">
        <button
          className="logs-button"
          onClick={() => onViewLogs(pod.namespace, pod.name)}
        >
          📜 View Logs
        </button>

        <button
          className="events-button"
          onClick={() => onViewEvents(pod.namespace, pod.name)}
        >
          📅 View Events
        </button>
      </div>
    </div>
  );
}