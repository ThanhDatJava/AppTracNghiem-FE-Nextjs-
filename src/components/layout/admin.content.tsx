"use client";

import { Layout } from "antd";

const AdminContent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { Content } = Layout;

  return (
    <Content>
      <div
        style={{
          padding: 24,
          minHeight: "calc(100vh - 180px)",
          background: `linear-gradient(to right, #00b09b, #96c93d)`,
          // borderRadius: "#ccc",
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default AdminContent;
