"use client"; // This line ensures the component is treated as a Client Component

import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./homepage.css"; // Ensure you have a CSS file for styling

import { Button } from "antd";
import { useRouter } from "next/navigation";
import BannerHomePage from "../page/bannerHomePage";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleClickBtn = () => {
    router.push("/auth/login");
  };

  return (
    <div className="page-container">
      <div className="content-body">
        <BannerHomePage />
      </div>
    </div>
  );
};

export default HomePage;
