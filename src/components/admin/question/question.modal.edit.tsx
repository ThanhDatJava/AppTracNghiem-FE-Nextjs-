import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { sendRequest } from "@/utils/api";
import { Option } from "antd/es/mentions";

interface ModalEditQuestionProps {
  isOpenModalEdit: boolean;
  closeModal: () => void;
  updateQuestion: (updatedQuestion: QuestionDetail) => void;
  detailModalEdit?: QuestionDetail;
}

interface QuestionDetail {
  _id: string;
  category: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string[];
  difficulty_level: string;
  image: string;
  _id_quiz: string;
}

interface Quiz {
  _id: string;
  quiz_name: string;
}

const ModalEditQuestion: React.FC<ModalEditQuestionProps> = ({
  isOpenModalEdit,
  closeModal,
  detailModalEdit,
  updateQuestion,
}) => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>(
    detailModalEdit?.image
  );
  const [nameQuiz, setNameQuiz] = useState<Quiz[]>([]);
  const getResponsiveWidth = (): string => {
    if (screens.xxl) return "40%";
    if (screens.xl) return "50%";
    if (screens.lg) return "60%";
    if (screens.md) return "70%";
    if (screens.sm) return "80%";
    return "90%"; // Default width for xs screens
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resNameQuiz = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-name-quiz`,
          method: "GET",
        });
        if (resNameQuiz) {
          setNameQuiz(resNameQuiz.data);
        }

        if (isOpenModalEdit && detailModalEdit) {
          form.setFieldsValue(detailModalEdit);
          setImage(detailModalEdit.image);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch quiz data.");
      }
    };

    fetchData();
  }, [isOpenModalEdit, detailModalEdit, form]);

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage;
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImage(base64Image);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.image = image || "";

      if (detailModalEdit) {
        values._id = detailModalEdit._id;
      }

      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/edit-detail-question`,
        method: "POST",
        body: values,
      });

      if (+res.statusCode === 201) {
        message.success("Question details updated successfully.");
        updateQuestion(values);
        closeModal(); // Close modal after successful update
      } else {
        message.error("Failed to update question details. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update question details. Please try again.");
    }
  };

  const closeModalHandler = () => {
    closeModal();
    form.resetFields();
  };

  return (
    <Modal
      centered
      open={isOpenModalEdit}
      onOk={handleOk}
      onCancel={closeModalHandler}
      width={getResponsiveWidth()}
      maskClosable={false}
    >
      <Form
        form={form}
        name="wrap"
        labelCol={{ flex: "110px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
      >
        <Form.Item label="Id" name="_id" hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          style={{ marginTop: "2rem" }}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Level" name="difficulty_level">
          <Select style={{ width: "20%" }}>
            <Select.Option value="easy">Easy</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="hard">Hard</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Question" name="question_text">
          <Input />
        </Form.Item>

        <Form.Item label="Options" name="options" style={{ width: "90%" }}>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row key={field.key} gutter={20} align="middle">
                    <Col flex="auto">
                      <Form.Item
                        {...field}
                        label={`Option ${index + 1}`}
                        style={{ marginBottom: 10 }}
                      >
                        <Input defaultValue={detailModalEdit?.options[index]} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button
                        type="text"
                        onClick={() => remove(field.name)}
                        icon={<DeleteOutlined />}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    disabled={fields.length >= 4}
                  >
                    Add Option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Correct answer" name="correct_answer">
          <Input />
        </Form.Item>

        <Form.Item label="Explanation" name="explanation">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
          >
            {image ? (
              <img src={image} alt="question" style={{ width: "100%" }} />
            ) : (
              <UploadOutlined />
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Quiz name" name="_id_quiz" style={{ width: "90%" }}>
          <Form.List name="_id_quiz">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row key={field.key} gutter={20} align="middle">
                    <Col flex="auto">
                      <Form.Item {...field} style={{ marginBottom: 10 }}>
                        <Select>
                          {nameQuiz.map((quiz) => (
                            <Option key={quiz._id} value={quiz._id}>
                              {quiz.quiz_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button
                        type="text"
                        onClick={() => remove(field.name)}
                        icon={<DeleteOutlined />}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    disabled={fields.length >= 10}
                  >
                    Add Option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditQuestion;
