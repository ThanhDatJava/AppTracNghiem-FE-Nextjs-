"use client";

import React, { useEffect, useState } from "react";
import { message } from "antd";
import QuestionTable from "@/components/admin/question/question.table";
import { sendRequest } from "@/utils/api";

// Define types for the question data
type QuestionDetail = {
  _id: string;
  category: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string[];
  difficulty_level: string;
  image: string;
};

type IBackendRes<T> = {
  data: T;
  // other fields like status, error message, etc.
};

const ManageQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await sendRequest<IBackendRes<QuestionDetail[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/get-detail-question`,
          method: "GET",
        });

        setQuestions(res.data);
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await sendRequest<IBackendRes<QuestionDetail[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/get-detail-question`,
        method: "GET",
      });

      setQuestions(res.data);
    } catch (err) {
      setError("Failed to load questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading message when the data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching fails
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Pass questions as an object with a `data` property to QuestionTable */}

      <QuestionTable
        detailQuestion={{ data: questions }}
        fetchQuestions={fetchQuestions}
      />
    </div>
  );
};

export default ManageQuestion;
