import React, { useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
} from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

interface PropPageQuiz {
  fetchQuiz: () => void;
}

const ModalCreateQuiz: React.FC<PropPageQuiz> = ({ fetchQuiz }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // Initialize form instance
  const [image, setImage] = useState<string | undefined>();

  const screens = useBreakpoint();

  const getResponsiveWidth = (): string => {
    if (screens.xxl) return "40%";
    if (screens.xl) return "50%";
    if (screens.lg) return "60%";
    if (screens.md) return "70%";
    if (screens.sm) return "80%";
    return "90%"; // Default width for xs screens
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

  const handleOk = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      values.image = image || ""; // Add image to form values
      // Send data to backend
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/create-detail-quiz`,
        method: "POST",
        body: values, // Send the entire values object to the API
      });

      if (+res.statusCode === 201) {
        message.success("Question created successfully!");
        fetchQuiz();
        // values._id = res.data._id;
        // Gọi hàm createQuestion và truyền values với _id mới
        // createQuestion(values);
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

  return (
    <Flex vertical gap="middle" align="flex-start">
      {/* Responsive */}
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: "1rem", background: "#28a745" }}
        icon={<PlusOutlined />}
      >
        Create Quiz
      </Button>
      <Modal
        title="Modal responsive width"
        centered
        open={open}
        onOk={handleOk}
        onCancel={closeModal}
        width={getResponsiveWidth()}
      >
        <Form
          form={form} // Attach form instance
          name="create-quiz"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item
            label="Quiz name"
            name="quiz_name"
            style={{ marginTop: "2rem" }}
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Level"
            name="difficulty_level"
            rules={[
              {
                required: true,
                message: "Please select the difficulty level!",
              },
            ]}
          >
            <Select style={{ width: "20%" }}>
              <Select.Option value="easy">Easy</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="hard">Hard</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the question text!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Duration minutes"
            name="duration_minutes"
            rules={[
              { required: true, message: "Please input the question text!" },
            ]}
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

export default ModalCreateQuiz;
