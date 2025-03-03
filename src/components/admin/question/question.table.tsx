import { Button, Table, Popconfirm, message } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import ModalEditQuestion from "./question.modal.edit";
import ModalCreateQuestion from "./question.modal.create";

interface QuestionDetail {
  _id: string; // Assuming ObjectId from MongoDB

  question_text: string;
  options: string[];
  correct_answer: string;

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

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: initialData.length, // Set the total number of items
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: initialData.length }));
  }, [initialData]);

  const columns = [
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

  const updateQuestion = (updatedQuestion: QuestionDetail) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedQuestion._id ? updatedQuestion : item
      )
    );
  };

  const createQuestion = (newQuestion: QuestionDetail) => {
    setData((prevData) => [...prevData, newQuestion]);
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

  const handleTableChange = (pagination: any) => {
    // Handle pagination change
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: data.length, // You might want to dynamically adjust this
    });
  };

  return (
    <div>
      <ModalCreateQuestion createQuestion={createQuestion} />

      <Table
        bordered
        dataSource={data.slice(
          (pagination.current - 1) * pagination.pageSize,
          pagination.current * pagination.pageSize
        )}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={pagination}
        onChange={handleTableChange} // Handle pagination changes
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
