"use client";

import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { AdminContext } from "@/library/admin.context";
import "./admin.sidebar.css";
const { Sider } = Layout;

type MenuItem = {
  key: string;
  label: string;
  icon?: JSX.Element;
  items?: MenuItem[]; // Using items instead of children for submenus
  onClick?: () => void;
};

const AdminSideBar = (props: any) => {
  const { session } = props;
  const { collapseMenu } = useContext(AdminContext) || { collapseMenu: false };
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  const getMenuItems = (role: string): MenuItem[] => {
    let items: MenuItem[] = [];

    switch (role) {
      case "ADMIN":
        items = [
          {
            key: "/study",
            label: "Admin",
            icon: <AppstoreOutlined />,
            onClick: () => handleMenuClick("/study"),
          },
          {
            key: "/study/user",
            label: "Manage Users",
            icon: <TeamOutlined />,
            onClick: () => handleMenuClick("/study/user"),
          },
        ];
        break;

      case "TEACHER":
        items = [
          {
            key: "/study",
            label: "Teacher",
            icon: <UserOutlined />,
            onClick: () => handleMenuClick("/study"),
          },

          {
            key: "/study/question",
            label: "Manage Question",
            icon: <ReadOutlined />,
            items: [
              // Using items instead of children
              {
                key: "/study/question/manage-question",
                label: "Question",
                onClick: () =>
                  handleMenuClick("/study/question/manage-question"),
              },
              {
                key: "/study/question/manage-quiz", // Unique path for the quiz
                label: "Quiz",
                onClick: () => handleMenuClick("/study/question/manage-quiz"),
              },
            ],
          },
          {
            key: "/study/student", // Changed to ensure uniqueness for student management
            label: "Manage Student",
            icon: <UsergroupAddOutlined />,
            items: [
              // Using items instead of children
              {
                key: "/study/student/manage-score", // Changed to a unique path for score
                label: "Score",
                onClick: () => handleMenuClick("/study/student/manage-score"),
              },
              {
                key: "/study/question/manage-student-info", // Changed to a unique path for student info
                label: "Information",
                onClick: () =>
                  handleMenuClick("/study/question/manage-student-info"),
              },
            ],
          },
        ];
        break;

      case "USER":
        items = [
          {
            key: "/study",
            label: "Student",
            icon: <AppstoreOutlined />,
            onClick: () => handleMenuClick("/study"),
          },
          {
            key: "/study/user/profile",
            label: "My Profile",
            icon: <TeamOutlined />,
            onClick: () => handleMenuClick("/study/user/profile"),
          },
        ];
        break;
      default:
        items = [
          {
            key: "/study",
            label: "Default",
            icon: <AppstoreOutlined />,
            onClick: () => handleMenuClick("/study"),
          },
        ];
        break;
    }

    return items;
  };

  const items = getMenuItems(session.user.role);

  return (
    <Sider
      collapsed={collapseMenu}
      style={{
        backgroundColor: "#f0f2f5", // Adjust this to your preferred color
        height: "100vh", // Make sure the sidebar takes full height
        position: "initial", // Keep it fixed to the left
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["/study"]}
        style={{
          height: "100%",
          borderRight: 0,
          backgroundColor: "#f0f2f5", // Change this to your desired color
        }}
        items={items.map((menuItem) => ({
          key: menuItem.key,
          icon: menuItem.icon,
          label: menuItem.label,
          onClick: menuItem.onClick,
          children: menuItem.items
            ? menuItem.items.map((childItem) => ({
                key: childItem.key,
                label: childItem.label,
                onClick: childItem.onClick,
              }))
            : undefined,
        }))}
      />
    </Sider>
  );
};

export default AdminSideBar;
