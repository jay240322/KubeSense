import "./Statusbadge.css";

interface Props {
  status: string;
}

export default function Statusbadge({ status }: Props) {
  const statusLower = status.toLowerCase();

  const getIcon = () => {
    switch (statusLower) {
      case "running":
        return <i className="fa-solid fa-circle-check status-icon-badge"></i>;
      case "pending":
        return <i className="fa-solid fa-circle-notch fa-spin status-icon-badge"></i>;
      case "failed":
        return <i className="fa-solid fa-circle-exclamation status-icon-badge"></i>;
      default:
        return <i className="fa-solid fa-circle-question status-icon-badge"></i>;
    }
  };

  return (
    <span className={`badge ${statusLower}`}>
      {getIcon()}
      <span>{status}</span>
    </span>
  );
}