import { Button, Table, Popconfirm, message } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { sendRequest } from "@/utils/api";

import ModalEditQuestion from "./question.modal.edit";
import ModalCreateQuestion from "./question.modal.create";

interface QuestionDetail {
  _id: string; // Assuming ObjectId from MongoDB
  category: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string[];
  difficulty_level: string;
  image: string;
  _id_quiz: string;
}

interface QuestionTableProps {
  detailQuestion: { data: QuestionDetail[] };

  fetchQuestions: () => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  detailQuestion,
  fetchQuestions,
}) => {
  const { data: initialData } = detailQuestion;
  const [data, setData] = useState<QuestionDetail[]>(initialData);

  const [detailModalEdit, setDetailModalEdit] = useState<
    QuestionDetail | undefined
  >();
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Degree",
      dataIndex: "difficulty_level",
      key: "degree",
    },
    {
      title: "Question Text",
      dataIndex: "question_text",
      key: "question_text",
    },
    {
      title: "Correct Answer",
      dataIndex: "correct_answer",
      key: "correct_answer",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: QuestionDetail) => (
        <div>
          <Button
            icon={<EditTwoTone />}
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteTwoTone />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Hàm cập nhật câu hỏi
  const updateQuestion = (updatedQuestion: QuestionDetail) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedQuestion._id ? updatedQuestion : item
      )
    );
  };

  // Hàm tạo câu hỏi
  const createQuestion = (newQuestion: QuestionDetail) => {
    setData((prevData) => [...prevData, newQuestion]); // Thêm câu hỏi mới vào dữ liệu bảng
  };

  const handleEdit = (record: QuestionDetail) => {
    setIsOpenModalEdit(true);
    setDetailModalEdit(record);
  };

  const handleCloseModal = () => {
    setIsOpenModalEdit(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/delete-detail-question`,
        method: "POST",
        body: { _id: id },
      });

      if (+res.statusCode === 201) {
        setData(data.filter((item) => item._id !== id));
        fetchQuestions();
        message.success("Question deleted successfully");
      } else {
        message.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
      message.error("Failed to delete question");
    }
  };

  return (
    <div>
      <ModalCreateQuestion createQuestion={createQuestion} />

      <Table
        bordered
        dataSource={data}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      <ModalEditQuestion
        isOpenModalEdit={isOpenModalEdit}
        closeModal={handleCloseModal}
        detailModalEdit={detailModalEdit}
        updateQuestion={updateQuestion}
      />
    </div>
  );
};

export default QuestionTable;
