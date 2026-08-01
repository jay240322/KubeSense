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

  onClose: () => void;
}

export default function PodDetails({
  pod,
  onClose,
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
      <div className="pod-details-header">
        <h2>Pod Details</h2>
        <button className="close-button" onClick={onClose} aria-label="Close pod details">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

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
    </div>
  );
}