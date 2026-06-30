import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import QuizList from '../../components/QuizList';
import { useQuizzes } from '../../context/QuizContext';
import '../../css/MyQuizzes.css';

export default function MyQuizzes() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { allQuizzes } = useQuizzes();

  if (!user?.isAdmin) {
    return (
      <Layout>
        <p className="my-quizzes-unauthorized">You don't have access to this page.</p>
      </Layout>
    );
  }

  const myQuizzes = allQuizzes.filter(q => q.author.toLowerCase() === user.username.toLowerCase());
  const popular = myQuizzes.filter(q => q.rating >= 7);

  return (
    <Layout>
      <div className="my-quizzes-header">
        <Button onClick={() => navigate('/admin/quiz-editor/new')}>Create new quiz</Button>
        <h1 className="my-quizzes-title">My quizzes</h1>
      </div>

      {myQuizzes.length === 0 ? (
        <p className="my-quizzes-empty">You haven't created any quizzes yet.</p>
      ) : (
        <>
          {popular.length > 0 && (
            <QuizList title="Popular" quizzes={popular} />
          )}
          <QuizList title="All quizzes" quizzes={myQuizzes} />
        </>
      )}
    </Layout>
  );
}
