import "./PodLogs.css";

interface PodLogsProps {
    logs: string;
    onClose: () => void;
}

export default function PodLogs({
    logs,
    onClose,
}: PodLogsProps){
    return (
        <div className="pod-logs">
            <div className="pod-logs-header">
                <h2>Pod Logs</h2>
                <button className="close-button" onClick={onClose} aria-label="Close logs">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <pre>{logs}</pre>
        </div>
    );
}