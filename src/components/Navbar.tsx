import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../css/Navbar.css';

export default function Navbar() {
  const { user } = useUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={close}>
          <div className="logo-icon">
            <img src="/src/assets/logo.png" alt="Logo sajta" className="logo-img" />
          </div>
          <span className="logo-text">Quiz<br/>Master</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Browse
          </Link>
          {user?.isAdmin && (
            <Link to="/admin/my-quizzes" className={`nav-link ${isActive('/admin/my-quizzes') ? 'active' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              My quizzes
            </Link>
          )}
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Contact
          </Link>
        </div>

        {/* Desktop profile */}
        <Link to="/profile" className="navbar-profile">
          <div className="profile-text">
            <span className="profile-welcome">Welcome, {user?.username ?? 'Guest'}!</span>
            <span className="profile-link">Go to profile</span>
          </div>
          <div className="profile-avatar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </Link>

        {/* Hamburger button — mobile only */}
        <button className="navbar-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <span className={`hamburger-line ${open ? 'open' : ''}`} />
          <span className={`hamburger-line ${open ? 'open' : ''}`} />
          <span className={`hamburger-line ${open ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="navbar-mobile-menu">
          <Link to="/browse" className={`mobile-nav-link ${isActive('/browse') ? 'active' : ''}`} onClick={close}>Browse</Link>
          {user?.isAdmin && (
            <Link to="/admin/my-quizzes" className={`mobile-nav-link ${isActive('/admin/my-quizzes') ? 'active' : ''}`} onClick={close}>My quizzes</Link>
          )}
          <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={close}>Contact</Link>
          <Link to="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={close}>
            Profile {user ? `(${user.username})` : ''}
          </Link>
        </div>
      )}
    </nav>
  );
}
