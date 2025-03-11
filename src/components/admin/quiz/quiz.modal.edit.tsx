import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
  Spin,
} from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { UploadOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

interface PropPageQuiz {
  fetchQuiz: () => void;
  _id: string;
}

const ModalEditQuiz: React.FC<PropPageQuiz> = ({ fetchQuiz, _id }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const [detailQuizEdit, setDetailQuizEdit] = useState<any>({});

  const screens = useBreakpoint();

  const clickBtnEdit = async () => {
    const res = await sendRequest<any>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz-by-id`,
      method: "POST",
      body: { _id },
    });

    if (res && res.statusCode === 201) {
      setDetailQuizEdit(res.data[0]); // Giả sử bạn muốn lấy phần tử đầu tiên trong mảng
      setOpen(true);
    }
  };

  useEffect(() => {
    if (detailQuizEdit) {
      form.setFieldsValue(detailQuizEdit); // Populate the form with quiz details
    }
  }, [detailQuizEdit, form]);

  const getResponsiveWidth = (): string => {
    if (screens.xxl) return "40%";
    if (screens.xl) return "50%";
    if (screens.lg) return "60%";
    if (screens.md) return "70%";
    if (screens.sm) return "80%";
    return "90%";
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage;
  };

  // const handleFileChange = (info: any) => {
  //   if (info.file.status === "done") {
  //     const file = info.file.originFileObj;
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64Image = reader.result as string;
  //       setImage(base64Image);
  //     };
  //     if (file) reader.readAsDataURL(file);
  //   }
  // };

  const handleFileChange = (info: any) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        // Kiểm tra nếu base64Image chưa có phần định dạng
        if (!base64Image.startsWith("data:image/")) {
          const fileExtension = file.type.split("/")[1];
          setImage(
            `data:image/${fileExtension};base64,${base64Image.split(",")[1]}`
          );
        } else {
          setImage(base64Image);
        }
      };
      if (file) reader.readAsDataURL(file);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.image = image || "";

      setLoading(true);
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/edit-detail-quiz`,
        method: "POST",
        body: values,
      });

      if (+res.statusCode === 201) {
        message.success("Quiz updated successfully!");
        fetchQuiz();
        closeModal();
      } else {
        message.error("Failed to edit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Button
        type="primary"
        onClick={clickBtnEdit}
        style={{
          backgroundColor: "#ffc107",
          color: "black",
          border: "none",
          margin: "1rem 0 ",
        }}
      >
        Edit
      </Button>

      <Modal
        title="Edit Quiz Details"
        centered
        open={open}
        onOk={handleOk}
        onCancel={closeModal}
        width={getResponsiveWidth()}
        footer={
          <div style={{ textAlign: "right" }}>
            {loading ? (
              <Spin />
            ) : (
              <>
                <Button onClick={closeModal} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button type="primary" onClick={handleOk} loading={loading}>
                  Save
                </Button>
              </>
            )}
          </div>
        }
      >
        <Form
          form={form}
          name="edit-quiz"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          colon={false}
        >
          <Form.Item label="ID Quiz" name="_id" hidden>
            <Input />
          </Form.Item>

          <Form.Item>
            <h1>Modal Edit Quiz</h1>
          </Form.Item>
          <Form.Item
            label="Quiz Name"
            name="quiz_name"
            style={{ marginTop: "2rem" }}
            rules={[{ required: true, message: "Please input the quiz name!" }]}
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
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Duration (Minutes)"
            name="duration_minutes"
            rules={[
              {
                required: true,
                message: "Please input the duration in minutes!",
              },
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
                <img src={image} alt="quiz" style={{ width: "100%" }} />
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

export default ModalEditQuiz;
