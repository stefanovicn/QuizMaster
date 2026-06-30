import { useState, useEffect, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import QuizList from '../components/QuizList';
import QuizCard from '../components/QuizCard';
import { FEATURED, RECOMMENDED } from '../data/quizzes';
import { useQuizzes } from '../context/QuizContext';
import '../css/Browse.css';

const PAGE_SIZE = 6;

export default function Browse() {
  const { allQuizzes } = useQuizzes();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, categories]);

  const allCategories = useMemo(
    () => Array.from(new Set(allQuizzes.flatMap(q => q.categories))).sort(),
    [allQuizzes]
  );

  const isSearching = query.trim().length > 0 || categories.length > 0;

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    return allQuizzes.filter(quiz => {
      const matchesText =
        !search ||
        quiz.title.toLowerCase().includes(search) ||
        quiz.shortDescription.toLowerCase().includes(search) ||
        quiz.longDescription.toLowerCase().includes(search) ||
        quiz.author.toLowerCase().includes(search);
      const matchesCategory =
        categories.length === 0 ||
        categories.every(c => quiz.categories.includes(c));
      return matchesText && matchesCategory;
    });
  }, [query, categories, allQuizzes]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const availableCategories = allCategories.filter(c => !categories.includes(c));

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
    setPickerOpen(false);
  };

  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <Layout>
      <div className="browse-search">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <svg className="browse-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <div className="browse-filters">
        {categories.map(category => (
          <span className="browse-chip" key={category}>
            {category}
            <button className="browse-chip-x" onClick={() => removeCategory(category)} aria-label={`Remove ${category}`}>✕</button>
          </span>
        ))}
        {availableCategories.length > 0 && (
          <div className="browse-add-wrap" ref={pickerRef}>
            <button className="browse-add" onClick={() => setPickerOpen(open => !open)} aria-label="Add category">+</button>
            {pickerOpen && (
              <div className="browse-picker">
                {availableCategories.map(category => (
                  <button key={category} className="browse-picker-item" onClick={() => addCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isSearching ? (
        pageResults.length > 0 ? (
          <>
            <div className="browse-grid">
              {pageResults.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
            </div>
            {totalPages > 1 && (
              <div className="browse-pagination">
                <button
                  className="browse-page-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <span className="browse-page-info">{page} / {totalPages}</span>
                <button
                  className="browse-page-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="browse-empty">No quizzes found.</p>
        )
      ) : (
        <>
          <QuizList title="Featured" quizzes={FEATURED} />
          <QuizList title="Recommended" quizzes={RECOMMENDED} />
        </>
      )}
    </Layout>
  );
}