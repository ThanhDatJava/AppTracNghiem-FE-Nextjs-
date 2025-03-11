"use client";

import React, { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import StudentCardInfor from "@/components/admin/student/student.card.infor";
import { useRouter } from "next/navigation";

// Define the expected structure of the student data.
interface IStudent {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IBackendRes<T> {
  data: T;
  statusCode: number;
  message: string;
}

const StudentInforPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [detailStudent, setDetailStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDetailStudent = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await sendRequest<IBackendRes<IStudent>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-detail-student-by-id`,
          method: "POST",
          body: { _id: id },
        });

        if (res?.data) {
          setDetailStudent(res.data);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError("Failed to fetch student details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailStudent();
  }, [id]); // Ensure this hook is triggered when 'id' changes.

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {detailStudent ? (
        <>
          <StudentCardInfor student={detailStudent} />
        </>
      ) : (
        <p>No student data available.</p>
      )}
    </div>
  );
};

export default StudentInforPage;
