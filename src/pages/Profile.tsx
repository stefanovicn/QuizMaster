import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import type { QuizResultEntry } from '../context/UserContext';
import '../css/Profile.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function ResultCard({ entry }: { entry: QuizResultEntry }) {
  return (
    <div className="profile-result-card">
      <div className="profile-result-header">
        <span className="profile-result-title">{entry.quizTitle}</span>
        <span className="profile-result-score">{entry.scorePercent}%</span>
      </div>
      <div className="profile-result-meta">
        <span>{entry.correct}/{entry.total} correct</span>
        <span>·</span>
        <span>{formatTime(entry.timeElapsed)}</span>
        <span>·</span>
        <span>{formatDate(entry.date)}</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, quizResults } = useUser();

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(quizResults.length / PAGE_SIZE);
  const pageResults = quizResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const displayName = user?.username ?? 'Guest';
  const displayEmail = user?.email ?? '';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Layout>
      <div className="profile-user-info">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-fallback">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-user-details">
          <h2 className="profile-username">{displayName}</h2>
          {displayEmail && <p className="profile-email">{displayEmail}</p>}
        </div>
      </div>

      <div className="profile-section">
        <h3 className="profile-section-title">Recent Results</h3>
        {quizResults.length > 0 ? (
          <>
            <div className="profile-results-list">
              {pageResults.map((entry, i) => (
                <ResultCard key={i} entry={entry} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="browse-pagination">
                <button className="browse-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                <span className="browse-page-info">{page} / {totalPages}</span>
                <button className="browse-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <p className="profile-no-results">No quiz results yet. Complete a quiz to see your history!</p>
        )}
      </div>

      <div className="profile-actions">
        <Button onClick={() => navigate('/changepassword')}>Change password</Button>
        <Button variant="secondary" onClick={handleLogout}>Log out</Button>
      </div>
    </Layout>
  );
}