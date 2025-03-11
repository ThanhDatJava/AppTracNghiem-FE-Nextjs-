"use client";

import React, { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import StudentCardInfor from "@/components/admin/student/student.card.infor";
import { useRouter } from "next/navigation";

// Define the expected structure of the student data, replace 'any' with the actual type.
interface IStudent {
  _id: string;
  name: string;
  email: string;
  // Add other fields based on the response structure.
}

interface IBackendRes<T> {
  data: T;
  // Add other fields like 'status', 'message' based on your API response.
}

const ManageStudentInfor = () => {
  const [detailStudent, setDetailStudent] = useState<IStudent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDetailStudent = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await sendRequest<IBackendRes<IStudent[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-detail-student`,
          method: "GET",
        });

        if (res?.data) {
          setDetailStudent(res.data);
        } else {
          setDetailStudent([]);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch student details");
        console.error("Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailStudent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDetailStudent = (_id: string) => {
    // Navigate to the quiz detail page

    router.push(`/study/teacher/manage-student-info/${_id}`);
  };

  return (
    <>
      <div
        className="manage-student-infor"
        style={{ display: "flex", gap: "20px" }}
      >
        {detailStudent?.length ? (
          // Mapping through each student and rendering StudentCardInfor
          detailStudent.map((student) => (
            <div onClick={() => handleDetailStudent(student._id)}>
              <StudentCardInfor key={student._id} student={student} />
            </div>
          ))
        ) : (
          <div>No student data found</div>
        )}
      </div>
    </>
  );
};

export default ManageStudentInfor;
