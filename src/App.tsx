import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { QuizProvider } from './context/QuizContext';
import './index.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Browse from './pages/Browse';
import QuizStart from './pages/QuizStart';
import QuizPlay from './pages/QuizPlay';
import QuizResult from './pages/QuizResult';
import QuizFlashcard from './pages/QuizFlashcard';
import MyQuizzes from './pages/admin/MyQuizzes';
import QuizEditor from './pages/admin/QuizEditor';
import QuestionsEditor from './pages/admin/QuestionsEditor';


export default function App() {
  return (
    <UserProvider>
      <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz/:id" element={<QuizStart />} />
          <Route path="/quiz/:id/play" element={<QuizPlay />} />
          <Route path="/quiz/:id/flashcards" element={<QuizFlashcard />} />
          <Route path="/quiz/:id/result" element={<QuizResult />} />
          <Route path="/admin/my-quizzes" element={<MyQuizzes />} />
          <Route path="/admin/quiz-editor/:id" element={<QuizEditor />} />
          <Route path="/admin/quiz-editor/:id/questions" element={<QuestionsEditor />} />
        </Routes>
      </BrowserRouter>
      </QuizProvider>
    </UserProvider>
  );
}
