import "./podTable.css";
import Statusbadge from "../Statusbadge/Statusbadge";
import { Pod } from "@/types/pod";

interface PodTableProps {
  pods: Pod[];
}

export default function PodTable({ pods }: PodTableProps) {
  return (
    <div className="table-container">
      <table className="pod-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Namespace</th>
            <th>Status</th>
            <th>Node</th>
            <th>Restarts</th>
            <th>Age</th>
          </tr>
        </thead>

        <tbody>
          {pods.map((pod) => (
            <tr key={`${pod.namespace}-${pod.name}`}>
              <td>{pod.name}</td>
              <td>{pod.namespace}</td>
              <td>
                <Statusbadge status={pod.status} />
              </td>
              <td>{pod.node}</td>
              <td>{pod.restarts}</td>
              <td>{pod.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}