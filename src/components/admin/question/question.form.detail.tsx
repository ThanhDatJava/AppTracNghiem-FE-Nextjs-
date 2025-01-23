import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface Question {
  question: {
    _id: string;
    category: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string[];
    difficulty_level: string;
    image: string;
  };
}

interface question {
  _id: string;
  category: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string[];
  difficulty_level: string;
  image: string;
}

const FormDetailQuestion: React.FC<Question> = ({ question }) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>(question?.image);

  useEffect(() => {
    if (question) {
      form.setFieldsValue(question);
      // setImage(detailModalEdit.image);
    }
  }, [question, form]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();

      // Manually add the image data to the form values
      values.image = image || ""; // Assuming `image` is the Base64 string of the image
      if (values) {
        values._id = values._id; // Ensure _id is included in the payload
      }

      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/question/edit-detail-question`,
        method: "POST",
        body: values, // Send the entire values object to the API endpoint
      });

      if (+res.statusCode === 201) {
        message.success("Question details updated successfully.");
      } else {
        message.error("Failed to update question details. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update question details. Please try again.");
    }
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

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="_id" label="Id" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="Category">
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

        <Form.Item name="question_text" label="Question text">
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
                        <Input defaultValue={question?.options[index]} />
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

        <Form.Item name="correct_answer" label="Correct answer">
          <Input />
        </Form.Item>

        <Form.Item name="explanation" label="Explanation">
          <Input />
        </Form.Item>

        <Form.Item name="difficulty_level" label="Level">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <Divider />
      </Form>
    </>
  );
};

export default FormDetailQuestion;
