"use client";

import React, { useEffect, useState } from "react";
import ClassroomCard from "@/components/admin/classroom/classroom.card.detail";

const ManageClassroom = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      <ClassroomCard _id_teacher={id} />
    </div>
  );
};

export default ManageClassroom;
