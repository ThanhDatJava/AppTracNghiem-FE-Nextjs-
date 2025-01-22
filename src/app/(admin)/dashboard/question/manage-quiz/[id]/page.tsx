"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";

interface Question {
  _id: string;
  category: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string[];
  difficulty_level: string;
  image: string;
}

const DetailQuiz = ({ params }: { params: { id: string } }) => {
  const [quiz, setQuiz] = useState<any>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = params; // Extract id from params

  useEffect(() => {
    const fetchDetailByIdQuiz = async () => {
      try {
        const res = await sendRequest<{ data: { question: Question[] } }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/get-detail-question-by-id-quiz`,
          method: "POST",
          body: { _id_quiz: id }, // Wrap the id in an object
        });

        setQuiz(res.data.question);

        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchDetailByIdQuiz();
  }, [id]); // Add `id` to the dependency array to refetch if it changes

  console.log("check quiz", quiz);

  return (
    <>
      <h1>Quản lý Quiz có ID: {id}</h1>

      {quiz.length > 0 ? (
        quiz.map((question: Question) => (
          <div key={question._id}>
            <h3>Category: {question.category}</h3>
            <p>
              <strong>Question:</strong> {question.question_text}
            </p>
            <p>
              <strong>Options:</strong>
            </p>
            <ul>
              {question.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
            <p>
              <strong>Correct Answer:</strong> {question.correct_answer}
            </p>

            <p>
              <strong>Difficulty Level:</strong> {question.difficulty_level}
            </p>
          </div>
        ))
      ) : (
        <p>No questions available for this quiz.</p>
      )}
    </>
  );
};

export default DetailQuiz;
