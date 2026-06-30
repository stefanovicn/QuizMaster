import { Link } from 'react-router-dom';
import '../css/NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-bg">
      <div className="not-found-card">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page Not Found</p>
        <Link to="/" className="not-found-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}