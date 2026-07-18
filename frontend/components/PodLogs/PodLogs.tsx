import "./PodLogs.css";

interface PodLogsProps {
    logs: string;
}

export default function PodLogs({
    logs,
}: PodLogsProps){
    return (
        <div className="pod-logs">
            <h2>Pod Logs</h2>

            <pre>{logs}</pre>
        </div>
    );
}