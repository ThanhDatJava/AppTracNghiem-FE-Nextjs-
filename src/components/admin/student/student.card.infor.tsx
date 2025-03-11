import React from "react";
import { Card } from "antd";

// Define the IStudent interface.
interface IStudent {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string; // Optional field for profile picture.
}

const { Meta } = Card;

// Make the component accept a `student` prop of type IStudent.
interface StudentCardInforProps {
  student: IStudent;
}

const StudentCardInfor: React.FC<StudentCardInforProps> = ({ student }) => (
  <Card
    hoverable
    style={{ width: 240 }}
    cover={
      <img
        alt={student.name} // Dynamically set alt text to student's name.
        src={
          student.profilePicture ||
          "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        } // Use a default image if profile picture is not provided.
      />
    }
  >
    <Meta
      title={student.name} // Set student's name as the card title.
      description={student.email} // Set student's email as the card description.
    />
  </Card>
);

export default StudentCardInfor;
