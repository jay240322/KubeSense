import "./Statusbadge.css";

interface Props {
  status: string;
}

export default function Statusbadge({ status }: Props) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}