// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Flex,
//   Form,
//   Input,
//   message,
//   Modal,
//   Select,
//   Upload,
// } from "antd";
// import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import { sendRequest } from "@/utils/api";

// interface PropPageQuiz {
//   fetchQuiz: () => void;
//   _id: string;
// }

// const ModalEditQuiz: React.FC<PropPageQuiz> = ({ fetchQuiz, _id }) => {
//   const [open, setOpen] = useState(false);
//   const [form] = Form.useForm(); // Initialize form instance
//   const [image, setImage] = useState<string | undefined>();

//   const screens = useBreakpoint();

//   useEffect(() => {
//     const fetchQuizDetailEdit = async () => {
//       try {
//         const res = await sendRequest<any>({
//           url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz-by-id`,
//           method: "POST",
//           body: { _id: _id },
//         });

//         console.log("check res :", res); // Logging the response for debugging

//         // Assuming you have a state variable and setter for questions
//         // setQuestions(res.data); // Uncomment this line to update state with fetched data
//       } catch (err) {
//         console.error("Failed to load questions. Please try again later.", err); // Log error for debugging
//         // setError("Failed to load questions. Please try again later.");
//       }
//     };

//     fetchQuizDetailEdit();
//   }, []); // Empty dependency array means this effect runs once after initial render

//   const getResponsiveWidth = (): string => {
//     if (screens.xxl) return "40%";
//     if (screens.xl) return "50%";
//     if (screens.lg) return "60%";
//     if (screens.md) return "70%";
//     if (screens.sm) return "80%";
//     return "90%"; // Default width for xs screens
//   };

//   const beforeUpload = (file: any) => {
//     const isImage = file.type.startsWith("image/");
//     if (!isImage) {
//       message.error("You can only upload image files!");
//     }
//     return isImage;
//   };

//   const handleFileChange = (info: any) => {
//     if (info.file.status === "done") {
//       const file = info.file.originFileObj;
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Image = reader.result as string;
//         setImage(base64Image);
//       };
//       if (file) reader.readAsDataURL(file);
//     }
//   };

//   const handleOk = async () => {
//     try {
//       // Validate form fields
//       const values = await form.validateFields();
//       values.image = image || ""; // Add image to form values
//       // Send data to backend
//       const res = await sendRequest<any>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/edit-detail-quiz`,
//         method: "POST",
//         body: values, // Send the entire values object to the API
//       });

//       if (+res.statusCode === 201) {
//         message.success("Question edit successfully!");
//         fetchQuiz();
//         // values._id = res.data._id;
//         // Gọi hàm createQuestion và truyền values với _id mới
//         // createQuestion(values);
//         closeModal(); // Close the modal on success
//       } else {
//         message.error("Failed to edit question. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       message.error("Failed to create question. Please try again.");
//     }
//   };

//   const closeModal = () => {
//     setOpen(false);
//     form.resetFields(); // Reset form fields when closing modal
//   };

//   return (
//     <Flex vertical gap="middle" align="flex-start">
//       {/* Responsive */}
//       <Button
//         type="primary"
//         onClick={() => setOpen(true)}
//         style={{
//           backgroundColor: "#ffc107",
//           color: "black",
//           border: "none",
//           margin: "1rem 0 ",
//         }}
//       >
//         Edit
//       </Button>
//       <Modal
//         title="Modal edit detail quiz"
//         centered
//         open={open}
//         onOk={handleOk}
//         onCancel={closeModal}
//         width={getResponsiveWidth()}
//       >
//         <Form
//           form={form} // Attach form instance
//           name="create-quiz"
//           labelCol={{ flex: "110px" }}
//           labelAlign="left"
//           labelWrap
//           wrapperCol={{ flex: 1 }}
//           colon={false}
//         >
//           <Form.Item
//             label="Quiz name"
//             name="quiz_name"
//             style={{ marginTop: "2rem" }}
//             rules={[{ required: true, message: "Please input the category!" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             label="Level"
//             name="difficulty_level"
//             rules={[
//               {
//                 required: true,
//                 message: "Please select the difficulty level!",
//               },
//             ]}
//           >
//             <Select style={{ width: "20%" }}>
//               <Select.Option value="easy">Easy</Select.Option>
//               <Select.Option value="medium">Medium</Select.Option>
//               <Select.Option value="hard">Hard</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[
//               { required: true, message: "Please input the question text!" },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             label="Duration minutes"
//             name="duration_minutes"
//             rules={[
//               { required: true, message: "Please input the question text!" },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item label="Image">
//             <Upload
//               listType="picture-card"
//               showUploadList={false}
//               beforeUpload={beforeUpload}
//               onChange={handleFileChange}
//             >
//               {image ? (
//                 <img src={image} alt="question" style={{ width: "100%" }} />
//               ) : (
//                 <div>
//                   <UploadOutlined />
//                   <div style={{ marginTop: 8 }}>Upload</div>
//                 </div>
//               )}
//             </Upload>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Flex>
//   );
// };

// export default ModalEditQuiz;

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
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";

interface PropPageQuiz {
  fetchQuiz: () => void;
  _id: string;
}

const ModalEditQuiz: React.FC<PropPageQuiz> = ({ fetchQuiz, _id }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false); // Track loading state for API calls

  const screens = useBreakpoint();

  useEffect(() => {
    const fetchQuizDetailEdit = async () => {
      setLoading(true); // Start loading
      try {
        const res = await sendRequest<any>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz-by-id`,
          method: "POST",
          body: { _id: _id },
        });

        if (res && res.data) {
          const quizData = res.data;
          // Populate form with fetched data
          form.setFieldsValue({
            quiz_name: quizData.quiz_name,
            difficulty_level: quizData.difficulty_level,
            description: quizData.description,
            duration_minutes: quizData.duration_minutes,
          });

          // If the quiz has an image, set it
          if (quizData.image) {
            setImage(quizData.image);
          }
        }
      } catch (err) {
        console.error("Failed to load quiz details.", err);
        message.error("Failed to load quiz details. Please try again later.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchQuizDetailEdit();
  }, [_id, form]); // Run the effect only when _id changes

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

      setLoading(true); // Start loading
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/edit-detail-quiz`,
        method: "POST",
        body: values, // Send the entire values object to the API
      });

      if (+res.statusCode === 201) {
        message.success("Quiz updated successfully!");
        fetchQuiz(); // Refresh quiz data
        closeModal(); // Close the modal on success
      } else {
        message.error("Failed to edit quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update quiz. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields(); // Reset form fields when closing modal
  };
  const fetchQuizDetailEdit = async () => {
    setLoading(true); // Start loading
    try {
      const res = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quiz/get-detail-quiz-by-id`,
        method: "POST",
        body: { _id: _id },
      });
      console.log("chcek res", res);

      if (res && res.data) {
        const quizData = res.data;
        // Populate form with fetched data
        form.setFieldsValue({
          quiz_name: quizData.quiz_name,
          difficulty_level: quizData.difficulty_level,
          description: quizData.description,
          duration_minutes: quizData.duration_minutes,
        });

        // If the quiz has an image, set it
        if (quizData.image) {
          setImage(quizData.image);
        }
      }
    } catch (err) {
      console.error("Failed to load quiz details.", err);
      message.error("Failed to load quiz details. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const clickBtnEdit = (_id: string) => {
    setOpen(true);
    console.log("check _id : ", _id);

    fetchQuizDetailEdit();

    // Reset form fields when closing modal
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Button
        type="primary"
        onClick={() => clickBtnEdit(_id)}
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
                <Button
                  type="primary"
                  onClick={handleOk}
                  loading={loading} // Show loading spinner on button
                >
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
