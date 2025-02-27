"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import FormDetailQuestion from "@/components/admin/question/question.form.detail";
import { Button } from "antd";
import ModalCreateQuestionByQuiz from "@/components/admin/quiz/quiz.modal.create.question";

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

  const [quiz_name, setQuiz_name] = useState<string>("");
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
    const getNameByIdQuiz = async () => {
      const res = await sendRequest<{ data: any }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-name-by-id-quiz`,
        method: "POST",
        body: { _id: id }, // Wrap the id in an object
      });

      setQuiz_name(res.data.quiz_name);
    };
    getNameByIdQuiz();
    fetchDetailByIdQuiz();
  }, [id]); // Add `id` to the dependency array to refetch if it changes

  const createQuestionByQuiz = async () => {
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

  return (
    <>
      <h1 style={{ marginBottom: "3rem" }}>Bài quiz : {quiz_name}</h1>
      <ModalCreateQuestionByQuiz
        createQuestionByQuiz={createQuestionByQuiz}
        _id_quiz={id}
      />
      {quiz.length > 0 ? (
        quiz.map((question: Question, index: number) => (
          <>
            <h2>Câu : {index + 1}</h2>
            <FormDetailQuestion question={question} />
          </>
        ))
      ) : (
        <p>No questions available for this quiz.</p>
      )}
    </>
  );
};

export default DetailQuiz;
