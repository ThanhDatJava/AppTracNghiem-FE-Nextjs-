"use client"; // This line ensures the component is treated as a Client Component

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./homepage.css"; // Ensure you have a CSS file for styling
import PlayoutHomePage from "../page/playoutHomePage/playoutHomePage";
import { Button } from "antd";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleClickBtn = () => {
    router.push("/auth/login");
  };

  return (
    <div className="page-container">
      {/* Video background only renders client-side */}

      <div className="content-header">
        <PlayoutHomePage />
      </div>

      <div className="content-body">
        <div className="content-text">
          "Chỉ có con đường học tập không ngừng nghỉ mới dẫn đến sự trưởng thành
          và thành công bền vững trong cuộc sống."{" "}
          <Button
            type="primary"
            onClick={handleClickBtn}
            style={{ backgroundColor: "#ff5733", borderColor: "#ff5733" }}
          >
            Nhấn vào đây để bắt đầu !
          </Button>
        </div>

        <div className="content-btn"></div>
      </div>
    </div>
  );
};

export default HomePage;
