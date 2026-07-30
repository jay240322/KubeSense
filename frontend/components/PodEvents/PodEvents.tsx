import "./PodEvents.css";

interface Event {
    type: string;
    reason: string;
    message: string;
    time: string;
}

interface PodEventsProps {
    events: Event[];
    onClose: () => void;
}

export default function PodEvents({
    events,
    onClose,
}: PodEventsProps) {
    if(events.length === 0) {
        return (
            <div className="pod-events">
                <div className="pod-events-header">
                    <h2>Pod Events</h2>
                    <button className="close-button" onClick={onClose} aria-label="Close events">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <p>No events available.</p>
            </div>
        );
    }

    return (
       <div className="pod-events">
          <div className="pod-events-header">
             <h2>Pod Events</h2>
             <button className="close-button" onClick={onClose} aria-label="Close events">
                 <i className="fa-solid fa-xmark"></i>
             </button>
          </div>

          {events.map((event, index) => (
             <div
          key={index}
          className="event-card"
            >
          <div className="event-header">
            <span className={`event-type ${event.type.toLowerCase()}`}>
              {event.type}
            </span>

            <span className="event-time">
              {event.time}
            </span>
          </div>

          <h3>{event.reason}</h3>

          <p>{event.message}</p>
        </div>
          ))}
       </div>
    );
}
