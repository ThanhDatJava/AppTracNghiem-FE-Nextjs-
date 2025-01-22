"use client";

import { Card } from "antd";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface QuizCardProps {
  dataQuestion: {
    category: string;

    correct_answer: string;

    difficulty_level: string;

    explanation: string;

    image: string;

    options: string[];

    question_text: string;

    _id: string;

    _id_quiz: string;
  };
}

const { Meta } = Card;

const QuestionCard: React.FC<QuizCardProps> = ({ dataQuestion }) => {
  const defaultImage = "/path/to/default-image.jpg"; // Default image in case the quiz image is unavailable

  const imageUrl = dataQuestion.image || defaultImage; // Use default image if dataQuestion.image is empty or undefined

  return (
    <>
      <h1>hehe</h1>

      {/* <Card
       hoverable
       style={{ width: "100%", maxWidth: 240 }}
       cover={
        <img
          alt={dataQuestion.quiz_name}
          src={imageUrl}
         style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
    }
    >
       <Meta title={dataQuestion.quiz_name} description={dataQuestion.description} />
    </Card>
    */}
    </>
  );
};

export default QuestionCard;
