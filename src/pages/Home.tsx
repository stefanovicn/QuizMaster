import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';
import QuizList from '../components/QuizList';
import { RECOMMENDED, FEATURED } from '../data/quizzes';
import '../css/Home.css';

interface Quote {
  quote: string;
  author: string;
}

export default function HomePage() {
  const { user } = useUser();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch('https://dummyjson.com/quotes/random')
      .then(r => r.json())
      .then((data: Quote) => setQuote(data))
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="home-greeting">Welcome back, {user?.username ?? 'Guest'}!</h1>
      {quote ? (
        <div className="home-quote">
          <p className="home-quote-text">"{quote.quote}"</p>
          <span className="home-quote-author">— {quote.author}</span>
        </div>
      ) : (
        <div className="home-quote-skeleton">
          <div className="home-quote-skeleton-text" />
          <div className="home-quote-skeleton-author" />
        </div>
      )} 
      <QuizList title="Recommended" quizzes={RECOMMENDED} />
      <QuizList title="Featured" quizzes={FEATURED} />
    </Layout>
  );
}