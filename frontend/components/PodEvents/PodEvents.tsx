import "./PodEvents.css";

interface Event {
    type: string;
    reason: string;
    message: string;
    time: string;
}

interface PodEventsProps {
    events: Event[];
}

export default function PodEvents({
    events,
}: PodEventsProps) {
    if(events.length === 0) {
        return (
            <div className="pod-events">
                <h2>Pod Events</h2>
                <p>No events available.</p>
            </div>
        );
    }

    return (
       <div className="pod-events">
          <h2>Pod events</h2>

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
