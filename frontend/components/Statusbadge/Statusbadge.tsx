import "./Statusbadge.css"

export default function Ststusbadge({status}: {status:string}) {
    return (
        <span className={'badge $(status.toLowerCase()}'}>
            {status}
        </span>
    );
}