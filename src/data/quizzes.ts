import type { Quiz } from '../models/Quiz';
import type { Question } from '../models/Question';
import type { Flashcard } from '../models/Flashcard';
import fonImage from '../assets/fon.png';
import csImage from '../assets/cs.png';
import gkImage from '../assets/gk.png';

const generalKnowledgeQuestions: Question[] = [
  {
    id: 1,
    type: 'single_choice',
    text: 'What is the capital of Argentina?',
    correctAnswer: 'Buenos Aires',
    wrongOptions: ['Montevideo', 'Rio de Janeiro', 'Madrid', 'Ciudad de Argentina'],
  },
  {
    id: 2,
    type: 'multiple_choice',
    text: 'Which of the following are NOT states of matter?',
    correctAnswers: ['Quark', 'Particle'],
    wrongOptions: ['Plasma', 'Liquid', 'Solid'],
  },
  {
    id: 3,
    type: 'text',
    text: 'What year did the moon landing happen?',
    correctAnswers: ['1969'],
  },
  {
    id: 4,
    type: 'text',
    text: 'What was the first civilization?',
    correctAnswers: ['Mesopotamia', 'Mesopotamian civilization'],
  },
  {
    id: 5,
    type: 'multiple_choice',
    text: 'Which animals are mammals?',
    correctAnswers: ['Dog', 'Cow', 'Dolphin'],
    wrongOptions: ['Eagle', 'Chicken'],
  },
];

const arosCards: Flashcard[] = [
  {
    id: 1,
    front: 'Ko je napravio Linux kernel?',
    back: 'Linus Torvalds.',
  },
  {
    id: 2,
    front: 'Koji je osnovni zadatak operativnog sistema?',
    back: 'Upravljanje hardverskim resursima računara i pružanje servisa korisničkim programima.',
  },
  {
    id: 3,
    front: 'Šta je proces?',
    back: 'Program u izvršavanju — instanca programa zajedno sa stanjem izvršavanja (programski brojač, registri, stek).',
  },
  {
    id: 4,
    front: 'Razlika između procesa i niti (thread)?',
    back: 'Procesi imaju odvojene adresne prostore, niti dele adresni prostor istog procesa.',
  },
  {
    id: 5,
    front: 'Šta je deadlock?',
    back: 'Situacija u kojoj dva ili više procesa čekaju jedan na drugog da oslobodi resurs, pa nijedan ne može da nastavi.',
  },
];

export const ALL_QUIZZES: Quiz[] = [
  {
    id: 1,
    title: 'General knowledge quiz',
    shortDescription: 'Five elementary questions every child should know.',
    longDescription: 'A comprehensive general knowledge quiz covering science, history, geography, pop culture, and more. Challenge yourself and see how much you really know!',
    author: 'Hugh J.',
    rating: 7,
    questionCount: 5,
    type: 'form',
    categories: ['General', 'History', 'Biology'],
    language: 'English',
    timeLimit: 300,
    questions: generalKnowledgeQuestions,
    imageUrl: gkImage
  },
  {
    id: 2,
    title: 'Counter-Strike quiz',
    shortDescription: 'Every player should know these facts.',
    longDescription: 'Think you know Counter-Strike inside out? Test your knowledge of maps, weapons, pro players, and the history of one of the most iconic FPS games ever made.',
    author: 'SuperKillerMan',
    rating: 10,
    questionCount: 20,
    type: 'form',
    categories: ['Gaming'],
    language: 'English',
    questions: [],
    imageUrl: csImage
  },
  {
    id: 3,
    title: 'WWII History',
    shortDescription: 'Detailed history quiz for WWII.',
    longDescription: 'Test your knowledge of World War II — from the causes of the war to the major battles, key figures, and the aftermath. Suitable for history enthusiasts of all levels.',
    author: 'Historian',
    rating: 8,
    questionCount: 50,
    type: 'form',
    categories: ['History'],
    language: 'English',
    timeLimit: 600,
    questions: [],
  },
  {
    id: 4,
    title: 'Engleski jezik u informatici',
    shortDescription: 'General quiz for English language use in comp-sci.',
    longDescription: 'A quiz focused on technical English vocabulary and phrases used in computer science, software engineering, and IT. Great for students preparing for international exams or job interviews.',
    author: 'HR',
    rating: 10,
    questionCount: 100,
    type: 'form',
    categories: ['English', 'IT'],
    language: 'English',
    timeLimit: 1200,
    questions: [],
  },
  {
    id: 5,
    title: 'Ekonomija',
    shortDescription: 'Proverite svoje znanje iz ekonomije.',
    longDescription: 'Kviz iz osnova ekonomije koji pokriva mikroekonomiju, makroekonomiju i osnove finansija. Pogodan za studente i sve koji žele da osveže znanje.',
    author: 'John Keynes',
    rating: 2,
    questionCount: 15,
    type: 'form',
    categories: ['Economics', 'Finances'],
    language: 'Serbian',
    questions: [],
  },
  {
    id: 6,
    title: 'AROS - flashcards',
    shortDescription: 'Brzi kviz iz AROS-a za ispit i kolokvijume.',
    longDescription: 'Flashcards kviz za studente FON-a koji spremaju AROS. Ima pitanja za oba kolokvijuma.',
    author: 'Admin',
    rating: 8,
    questionCount: 5,
    type: 'flashcards',
    categories: ['IT', 'School'],
    language: 'Serbian',
    cards: arosCards,
    imageUrl: fonImage
  },
  {
    id: 7,
    title: 'FMIR',
    shortDescription: 'Proverite svoje znanje iz finansija.',
    longDescription: 'Kviz iz finansijskog menadžmenta i računovodstva. Pokriva osnove bilansa stanja, računa dobiti i gubitka i analize finansijskih izveštaja.',
    author: 'Z',
    rating: 5,
    questionCount: 15,
    type: 'form',
    categories: ['Finances', 'Accounting'],
    language: 'Serbian',
    questions: [],
  },
  {
    id: 8,
    title: 'Geografija sveta',
    shortDescription: 'Prepoznaj države, prestonice i reke.',
    longDescription: 'Testirajte svoje poznavanje svetske geografije — države, prestonice, planine, reke i okeani. Idealno za sve koji vole da putuju ili da uče o svetu oko sebe.',
    author: 'Mapper',
    rating: 9,
    questionCount: 30,
    type: 'form',
    categories: ['Geography'],
    language: 'Serbian',
    questions: [],
  },
  {
    id: 9,
    title: 'Music through decades',
    shortDescription: 'How well do you know music from the 60s to today?',
    longDescription: 'From the Beatles to Billie Eilish — this quiz covers iconic songs, albums, and artists across six decades of popular music. Great for music lovers of all ages.',
    author: 'MusicFan',
    rating: 7,
    questionCount: 30,
    type: 'form',
    categories: ['Music', 'Culture'],
    language: 'English',
    questions: [],
  },
];

export const RECOMMENDED = ALL_QUIZZES.filter(q => [1, 2, 3, 8].includes(q.id));
export const FEATURED = ALL_QUIZZES.filter(q => [4, 5, 6].includes(q.id));
