import React, { useState } from 'react';
import { fetchQuizData } from './api/api';
import { QuizQuestion } from '../../types/quizTypes';
import "./globals.css";
import Link from 'next/link';

interface QuizPageProps {
  quizData: QuizQuestion[];
}

const QuizPage: React.FC<QuizPageProps> = ({ quizData }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(quizData.length).fill(''));
  const correctAnswers = ['Paris', 'William Shakespeare', 'H2O', 'Jupiter', 'Australia', 'Avocado', 'Japanese Yen', 'Leonardo da Vinci', 'Nitrogen', 'Africa'];
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const totalMarks = 10;

  const handleInputChange = (index: number, value: string) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const calculateTotalScore = () => {
    let score = 0;
    for (let i = 0; i < quizData.length; i++) {
      if (userAnswers[i].trim().toLowerCase() === correctAnswers[i].trim().toLowerCase()) {
        score += 1;
      }
    }
    return score;
  };

  const handleSubmit = () => {
    const score = calculateTotalScore();
    setTotalScore(score);
  };

  const renderAnswerBoxColor = (index: number) => {
    if (totalScore !== null && userAnswers[index].trim().toLowerCase() === correctAnswers[index].trim().toLowerCase()) {
      return "bg-green-200"; // Green color for correct answers
    }
    return "bg-red-200"; // Red color for incorrect answers
  };

  return (
    <div className="p-4">
      <Link href='/' className="mt-4 text-blue  p-2 pd-2.5 ml-2 rounded-md hover:bg-gray-200 transition-all duration-200">
        Home
      </Link>
      <h1 className="text-3xl font-semibold p-4">Quiz Questions</h1>
      <form>
        <ul className="bg-gray-100 p-4 rounded-md">
          {quizData.map((ques, index) => (
            <li className={`mb-4 p-2 rounded-md ${totalScore !== null && renderAnswerBoxColor(index)}`} key={ques._uid}>
              <p className="text-lg ">{ques.question}</p>
              <input
                type="text"
                value={userAnswers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="border p-2 mt-2 rounded-md w-96 md:w-80 lg:w-96"
              />
            </li>
          ))}
        </ul>
      </form>
      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200">
        Submit
      </button>
      
      {totalScore !== null && (
        <p className="mt-2 text-xl font-semibold">Total Score: {totalScore} out of {totalMarks}</p>
      )}
    </div>
  );
};

export async function getStaticProps() {
  const quizData = await fetchQuizData();
  return {
    props: { quizData },
    revalidate: 5,
  };
}

export default QuizPage;
