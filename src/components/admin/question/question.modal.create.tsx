import React, { useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { sendRequest } from "@/utils/api";

interface ModalEditQuestionProps {
  createQuestion: (createQuestion: QuestionDetail) => void;
}

interface QuestionDetail {
  _id: string;

  question_text: string;
  options: string[];
  correct_answer: string;

  image: string;
  _id_quiz: string;
}

const ModalCreateQuestion: React.FC<ModalEditQuestionProps> = ({
  createQuestion,
}) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const [form] = Form.useForm(); // Initialize form instance

  const screens = useBreakpoint();

  const getResponsiveWidth = (): string => {
    if (screens.xxl) return "40%";
    if (screens.xl) return "50%";
    if (screens.lg) return "60%";
    if (screens.md) return "70%";
    if (screens.sm) return "80%";
    return "90%"; // Default width for xs screens
  };

  const handleOk = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      values.image = image || ""; // Add image to form values

      // Send data to backend
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/create-detail-question`,
        method: "POST",
        body: values, // Send the entire values object to the API
      });

      if (+res.statusCode === 201) {
        message.success("Question created successfully!");

        // Gán _id từ phản hồi API vào values
        values._id = res.data._id;

        // Gọi hàm createQuestion và truyền values với _id mới
        createQuestion(values);

        closeModal(); // Close the modal on success
      } else {
        message.error("Failed to create question. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to create question. Please try again.");
    }
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields(); // Reset form fields when closing modal
  };

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
      if (file) reader.readAsDataURL(file);
    }
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: "1rem", background: "#28a745" }}
        icon={<PlusOutlined />}
      >
        Create Question Handicraft
      </Button>

      <Modal
        centered
        open={open}
        onOk={handleOk}
        onCancel={closeModal}
        width={getResponsiveWidth()}
        maskClosable={false}
      >
        <Form
          form={form} // Attach form instance
          name="create-question"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item>
            <h1>Modal Create Question</h1>
          </Form.Item>
          <Form.Item
            label="Question"
            name="question_text"
            rules={[
              { required: true, message: "Please input the question text!" },
            ]}
            style={{ width: "95%" }}
          >
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
                          <Input defaultValue={[]} />
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

          <Form.Item
            label="Correct answer"
            name="correct_answer"
            rules={[
              { required: true, message: "Please provide the correct answer!" },
            ]}
            style={{ width: "95%" }}
          >
            <Input />
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
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default ModalCreateQuestion;
