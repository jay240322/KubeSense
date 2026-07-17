import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>KubeSense</h2>
        <span>AI Kubernetes Assistant</span>
      </div>
      
      <div className="navbar-status">
        <div className="status-dot"></div>
        <span>Connected</span>
      </div>
    </nav>
  );
}