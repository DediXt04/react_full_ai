import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-page fade-in">
      <div className="not-found-card">
        <div className="not-found-icon">🎰</div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">This table doesn't exist</p>
        <p className="not-found-desc">
          Looks like you wandered into the wrong room. The house always wins, but not on this URL.
        </p>
        <Link to="/" className="not-found-btn">
          🏠 Back to Lobby
        </Link>
      </div>
    </div>
  );
}
