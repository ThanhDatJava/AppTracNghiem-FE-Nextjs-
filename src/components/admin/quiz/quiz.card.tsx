"use client";

import { Card } from "antd";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface QuizCardProps {
  dataQuiz: {
    _id: string;
    quiz_name: string;
    description: string;
    questions: Question[];
    duration_minutes: string;
    image: string;
  };
}

const { Meta } = Card;

const QuizCard: React.FC<QuizCardProps> = ({ dataQuiz }) => {
  const defaultImage = "/path/to/default-image.jpg"; // Default image in case the quiz image is unavailable

  const imageUrl = dataQuiz.image || defaultImage; // Use default image if dataQuiz.image is empty or undefined

  return (
    <Card
      hoverable
      style={{ width: "100%", maxWidth: 240 }}
      cover={
        <img
          alt={dataQuiz.quiz_name}
          src={imageUrl}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            minHeight: "200px",
            maxHeight: "350px",
            overflow: "auto",
          }}
        />
      }
    >
      <Meta title={dataQuiz.quiz_name} description={dataQuiz.description} />
    </Card>
  );
};

export default QuizCard;
