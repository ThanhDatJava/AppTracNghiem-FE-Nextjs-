import React, { useState } from "react";
import * as mammoth from "mammoth";
import { Button, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import FormDetailQuestion from "../question/question.form.detail";
import FormDetailQuestionToWord from "../question/question.form.detail.to.word";

interface QuestionDetail {
  question_text: string;
  options: string[];
  correct_answer: string;
  image: string;
  _id_quiz: string;
}

interface ModalEditQuestionProps {
  _id_quiz: string;
}

const ModalCreateQuestionByQuizToWord: React.FC<ModalEditQuestionProps> = ({
  _id_quiz,
}) => {
  const [questions, setQuestions] = useState<QuestionDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const [submitQuestion, setSubmitQuestion] = useState(false);

  const handleFileChange = async (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      setError("");
      setSuccess(false);
      return;
    }

    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      if (
        file &&
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        mammoth
          .extractRawText({ arrayBuffer })
          .then((result) => {
            const content = result.value;
            // Parse content into questions
            const parsedQuestions: QuestionDetail[] =
              parseContentToQuestions(content);
            if (parsedQuestions.length > 0) {
              setQuestions(parsedQuestions);
              setSuccess(true);
              // Gửi câu hỏi lên server để lưu vào DB
              // saveQuestionsToDatabase(parsedQuestions);
            } else {
              setError("Không tìm thấy câu hỏi hợp lệ trong file.");
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error extracting text from docx file:", err);
            setError("Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.");
            setLoading(false);
          });
      } else {
        message.error("Vui lòng chọn file Word (.docx)");
        setLoading(false);
      }
    }

    if (info.file.status === "error") {
      message.error("Đã xảy ra lỗi khi tải lên file.");
      setLoading(false);
    }
  };

  const parseContentToQuestions = (content: string): QuestionDetail[] => {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const questions: QuestionDetail[] = [];
    let currentQuestion: QuestionDetail | null = null;

    // Iterate over lines
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Identify a question line (ends with '?')
      if (line.endsWith("?") && !currentQuestion) {
        currentQuestion = {
          question_text: line,
          options: [],
          correct_answer: "",
          _id_quiz: "",
          image: "",
        };
      }
      // Identify options (starts with a letter followed by a period)
      else if (currentQuestion && line.match(/^[a-dA-D]\./)) {
        // Extract the option text (after the 'a.', 'b.', etc.)
        currentQuestion.options.push(line.substring(3).trim());
      }
      // Identify correct answer (line starts with "Correct Answer:")
      else if (currentQuestion && line.startsWith("Correct Answer:")) {
        currentQuestion.correct_answer = line.substring(15).trim();
        questions.push(currentQuestion); // Push the question when the correct answer is found
        currentQuestion = null; // Reset for next question
      }

      i++;
    }

    return questions;
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isDocx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        message.error("Vui lòng chọn file Word (.docx)");
      }
      return isDocx;
    },
    onChange: handleFileChange,
    showUploadList: false, // Hide uploaded file list
  };

  const handleClick = () => {
    setSubmitQuestion(true); // Thay đổi trạng thái để thông báo con biết
  };

  return (
    <div>
      {/* Button to open file selection dialog */}
      <Upload {...uploadProps}>
        <Button
          icon={<UploadOutlined />}
          style={{
            backgroundColor: "#00677f", // Màu xanh nước biển
            borderColor: "#00bcd4", // Màu viền xanh nước biển
            color: "white", // Màu chữ trắng
            padding: "10px 20px", // Điều chỉnh padding
            fontWeight: "bold", // Chữ đậm
            borderRadius: "8px", // Bo góc
            transition: "all 0.3s ease", // Thêm hiệu ứng chuyển động mượt mà
          }}
        >
          Create Question From Word
        </Button>
      </Upload>

      {loading && (
        <div style={{ marginTop: "20px" }}>
          <Spin tip="Đang tải..." />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {success && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <p>Câu hỏi đã được trích xuất thành công!</p>
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          <h3 style={{ marginBottom: "20px", whiteSpace: "pre-wrap" }}>
            Thông Tin Các Câu Hỏi:
          </h3>

          {questions.map((question, idx) => (
            <>
              <FormDetailQuestionToWord
                question={{ ...question, _id_quiz: _id_quiz }}
                submitQuestion={submitQuestion}
              />
            </>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <Button
          type="primary"
          htmlType="submit"
          style={{
            background: "hsl(345deg 100% 47%)",
            borderColor: "#fff000",
            color: "white   ",
          }}
          onClick={handleClick}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default ModalCreateQuestionByQuizToWord;
