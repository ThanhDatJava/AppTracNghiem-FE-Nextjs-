"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { sendRequest } from "@/utils/api";
import QuizCard from "@/components/admin/quiz/quiz.card";
import ModalCreateQuiz from "@/components/admin/quiz/quiz.modal.create";
import { Button, Popconfirm } from "antd";
// import ModalEditQuiz from "@/components/admin/quiz/quiz.modal.edit";
import ModalEditQuiz from "@/components/admin/quiz/quiz.modal.edit";
interface IQuiz {
  _id: string;
  quiz_name: string;
  description: string;
  questions: any[]; // Adjust the type according to your data structure
  duration_minutes: string;
  image: string;
}

const ManageQuiz = () => {
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<IQuiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const res = await sendRequest<{ data: IQuiz[] }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz`,
          method: "GET",
        });

        setQuiz(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError("Failed to load questions. Please try again later.");
      }
    };

    fetchQuiz();
  }, []);

  const handleDetailQuiz = (quizId: string, quiz_name: string) => {
    // Navigate to the quiz detail page

    router.push(`/study/teacher/manage-quiz/${quizId}`); // Replace `/quiz/${quizId}` with your actual route
  };

  const handleDeleteQuiz = async (quizId: string) => {
    // Navigate to the quiz detail page

    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/delete-detail-quiz`,
      method: "POST",
      body: { _id: quizId },
    });
    if (+res?.statusCode === 201) {
      fetchQuiz();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const fetchQuiz = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<{ data: IQuiz[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz`,
        method: "GET",
      });

      setQuiz(res.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to load questions. Please try again later.");
    }
  };

  return (
    <>
      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        Manage Quiz
      </h1>

      <ModalCreateQuiz fetchQuiz={fetchQuiz} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
        }}
      >
        {quiz.map((quizItem) => (
          <div key={quizItem._id}>
            <div
              onClick={() => handleDetailQuiz(quizItem._id, quizItem.quiz_name)}
            >
              <QuizCard dataQuiz={quizItem} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",

                maxHeight: "1000px",
              }}
            >
              <ModalEditQuiz fetchQuiz={fetchQuiz} _id={quizItem._id} />
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleDeleteQuiz(quizItem._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="dashed"
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    marginLeft: "1rem",
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageQuiz;
