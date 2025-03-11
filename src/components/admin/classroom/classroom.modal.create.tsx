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

interface ClassroomCardProps {
  _id_teacher: string;
}

interface QuestionDetail {
  _id: string;

  question_text: string;
  options: string[];
  correct_answer: string;

  image: string;
  _id_quiz: string;
}

// const ModalCreateClassroom: React.FC<ModalEditQuestionProps> = ({
//   createQuestion,
// }) => {

const ModalCreateClassroom: React.FC<ClassroomCardProps> = ({
  _id_teacher,
}) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const [form] = Form.useForm(); // Initialize form instance

  const screens = useBreakpoint();

  console.log("check is clasroom modal", _id_teacher);

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

      const dataWithId = { ...values, _id_teacher: _id_teacher };

      // Send data to backend
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/classroom/create-detail-classroom`,
        method: "POST",
        body: dataWithId, // Send the entire values object to the API
      });

      if (+res.statusCode === 201) {
        message.success("Question created successfully!");

        // Gán _id từ phản hồi API vào values
        values._id = res.data._id;

        // Gọi hàm createQuestion và truyền values với _id mới

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
        Create Classroom
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
            <h1>Modal Create Classroom</h1>
          </Form.Item>

          <Form.Item
            label="Name Classroom"
            name="name_classroom"
            rules={[
              { required: true, message: "Please input the question text!" },
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

export default ModalCreateClassroom;
