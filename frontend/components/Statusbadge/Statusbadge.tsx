import "./Statusbadge.css";

interface Props {
  status: string;
}

export default function Statusbadge({ status }: Props) {
  const badgeClass = `badge ${status.toLowerCase()}`;

  return <span className={badgeClass}>{status}</span>;
}