"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Thành Đạt ©{new Date().getFullYear()} Created by @thanhdat
      </Footer>
    </>
  );
};

export default AdminFooter;
