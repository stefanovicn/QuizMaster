import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../css/ChangePassword.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/profile'), 1500);
  };

  return (
      <div className="chpw-page">
        <div className="chpw-card">
          <button className="chpw-back" onClick={() => navigate('/profile')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to profile
          </button>

          <h2 className="chpw-title">Change Password</h2>
          <p className="chpw-subtitle">Enter your current password and choose a new one.</p>

          <div className="chpw-form">
            <div className="chpw-field">
              <label className="chpw-label">Current password</label>
              <input
                className="chpw-input"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </div>

            <div className="chpw-field">
              <label className="chpw-label">New password</label>
              <input
                className="chpw-input"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <div className="chpw-field">
              <label className="chpw-label">Confirm new password</label>
              <input
                className="chpw-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="chpw-error">{error}</p>}
            {success && <p className="chpw-success">Password changed! Redirecting...</p>}

            <div className="chpw-actions">
              <Button onClick={handleSubmit}>Save changes</Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
  );
}