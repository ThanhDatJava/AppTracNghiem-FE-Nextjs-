import React from "react";
import { MailOutlined, ReadOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const PlayoutHomePage: React.FC = () => {
  const router = useRouter();
  // Define the items in the menu
  const menuItems: MenuItem[] = [
    {
      key: "1",
      icon: <ReadOutlined />,
      label: "TĐ-Quizzes",
      style: { flex: 1, textAlign: "left" }, // Căn logo sang trái
    },
    {
      key: "2",
      icon: <MailOutlined />,
      label: "Login",
      children: [
        {
          key: "3",
          label: "Login",
          onClick: () => router.push("/auth/login"),
        },
      ],
      style: { textAlign: "right" }, // Căn Login/Logout sang phải
    },
  ];

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <div style={{ padding: " 0 20px ", background: "#rgb(240, 225, 205)" }}>
        <Menu
          mode="horizontal"
          theme="dark"
          defaultSelectedKeys={["4"]} // Chỉ áp dụng defaultSelectedKeys cho Login/Logout
          items={menuItems}
          style={{
            display: "flex", // Sử dụng Flexbox để căn chỉnh các phần tử
            justifyContent: "space-between", // Căn đều các phần tử
            padding: " 20px 10px",
          }}
        />
      </div>
    </div>
  );
};

export default PlayoutHomePage;
