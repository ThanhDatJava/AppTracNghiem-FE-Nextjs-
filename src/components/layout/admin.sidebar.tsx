"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/library/admin.context";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext) || { collapseMenu: false };

  const [isMounted, setIsMounted] = useState(false); // To track client-side mounting
  const router = useRouter(); // Initialize useRouter hook

  // Set isMounted to true once the component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null or loading state if not mounted yet
  if (!isMounted) {
    return null;
  }

  // Handle click and navigate using router.push()
  const handleMenuClick = (key: string) => {
    // Navigate to the corresponding route

    router.push(key);
  };

  const items: MenuItem[] = [
    {
      key: "grp",
      label: "Thành Đạt",
      type: "group",
      children: [
        {
          key: "/dashboard", // The path to navigate
          label: "Dashboard", // The text label
          icon: <AppstoreOutlined />,
          onClick: () => handleMenuClick("/dashboard"), // Handle click and navigate
        },
        {
          key: "/dashboard/user",
          label: "Manage Users",
          icon: <TeamOutlined />,
          onClick: () => handleMenuClick("/dashboard/user"), // Handle click and navigate
        },
        {
          key: "/dashboard/question",
          label: "Manage Question",
          icon: <SettingOutlined />,
          children: [
            {
              key: "/dashboard/question/manage-question",
              label: "Question",
              onClick: () =>
                handleMenuClick("/dashboard/question/manage-question"),
            },
            {
              key: "/dashboard/question/manage-quiz",
              label: "Quiz",
              onClick: () => handleMenuClick("/dashboard/question/manage-quiz"),
            },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["/dashboard"]}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
