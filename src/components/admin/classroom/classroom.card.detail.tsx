// "use client";

// import { auth } from "@/auth";
// import { sendRequest } from "@/utils/api";
// import { Card, Col, Row } from "antd";
// import { useEffect, useState } from "react";

// interface ClassroomCardProps {
//   _id_teacher: string;
// }

// interface ClassroomDetail {
//   image: string;
//   _id: string;
//   _id_quiz: string;
//   _id_student: string[];
//   _id_teacher: string;
//   name_classroom: string;
// }

// const ClassroomCard: React.FC<ClassroomCardProps> = ({ _id_teacher }) => {
//   const [classrooms, setClassrooms] = useState<ClassroomDetail[]>([]);

//   useEffect(() => {
//     const fetchDetailClassrooms = async () => {
//       const res = await sendRequest<IBackendRes<ClassroomDetail[]>>({
//         url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/classroom/get-detail-classroom-by-id-teacher`,
//         method: "POST",
//         body: { _id_teacher: _id_teacher },
//       });

//       if (res && res?.data) {
//         setClassrooms(res.data);
//       }
//     };

//     fetchDetailClassrooms();
//   }, [_id_teacher]);

//   return (
//     <Row gutter={16}>
//       {classrooms.map((classroom) => (
//         <Col span={8} key={classroom._id_teacher}>
//           <Card title={classroom.name_classroom}>img</Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default ClassroomCard;

"use client";

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import ModalCreateClassroom from "./classroom.modal.create";

interface ClassroomCardProps {
  _id_teacher: string;
}

interface ClassroomDetail {
  image: string; // Giả sử API trả về chuỗi Base64 trong trường "image"
  _id: string;
  _id_quiz: string;
  _id_student: string[];
  _id_teacher: string;
  name_classroom: string;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ _id_teacher }) => {
  const [classrooms, setClassrooms] = useState<ClassroomDetail[]>([]);

  useEffect(() => {
    const fetchDetailClassrooms = async () => {
      const res = await sendRequest<IBackendRes<ClassroomDetail[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/classroom/get-detail-classroom-by-id-teacher`,
        method: "POST",
        body: { _id_teacher: _id_teacher },
      });

      if (res && res?.data) {
        setClassrooms(res.data);
      }
    };

    fetchDetailClassrooms();
  }, [_id_teacher]);

  const onclick = (_id: any) => {
    console.log("check click", _id);
  };
  return (
    <>
      <ModalCreateClassroom _id_teacher={_id_teacher} />
      <Row gutter={16}>
        {classrooms.map((classroom) => (
          <Col span={5} key={classroom._id}>
            <Card
              title={classroom.name_classroom}
              onClick={() => onclick(classroom._id)}
            >
              {/* Nội dung khác của Card (nếu có) */}
              <div
                style={{
                  backgroundImage: `url(${classroom.image})`, // Sử dụng chuỗi Base64 làm background
                  backgroundSize: "cover", // Đảm bảo hình nền phủ kín Card
                  backgroundPosition: "center", // Căn giữa hình nền
                  maxHeight: 200,
                  minHeight: 200,
                  minWidth: 100,
                  maxWidth: 250,
                  color: "black", // Đảm bảo văn bản có màu sáng để nổi bật trên nền tối
                }}
              ></div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ClassroomCard;
