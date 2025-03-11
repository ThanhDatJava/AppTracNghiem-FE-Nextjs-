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
  const [selectedKey, setSelectedKey] = useState<string>("/");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleMenuClick = (key: string) => {
    router.push(key);
    setSelectedKey(key); // Update selected key
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
            key: "/study/classroom",
            label: "Manage Classroom",
            icon: <ReadOutlined />,
            items: [
              // Using items instead of children
              {
                key: "/study/teacher/manage-classroom",
                label: "Classroom",
                // onClick: () =>
                //   handleMenuClick("/study/teacher/manage-classroom"),

                onClick: () => {
                  // const sessionId = session; // Thay thế bằng ID session thực tế
                  handleMenuClick(
                    `/study/teacher/manage-classroom/${session?.user?._id}`
                  );
                },
              },
            ],
          },

          {
            key: "/study/question",
            label: "Manage Question",
            icon: <ReadOutlined />,
            items: [
              // Using items instead of children
              {
                key: "/study/teacher/manage-question",
                label: "Question",
                onClick: () =>
                  handleMenuClick("/study/teacher/manage-question"),
              },
              {
                key: "/study/teacher/manage-quiz", // Unique path for the quiz
                label: "Quiz",
                onClick: () => handleMenuClick("/study/teacher/manage-quiz"),
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
                key: "/study/teacher/manage-student-info", // Changed to a unique path for student info
                label: "Information",
                onClick: () =>
                  handleMenuClick("/study/teacher/manage-student-info"),
              },
              {
                key: "/study/teacher/manage-score", // Changed to a unique path for score
                label: "Score",
                onClick: () => handleMenuClick("/study/teacher/manage-score"),
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
      className="sider-sidebar"
      style={{
        minHeight: "100vh",
        height: "100vh", // Đảm bảo Sider có chiều cao full màn hình
        position: "initial",
        top: 0,
        left: 0,
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["/"]}
        selectedKeys={[selectedKey]}
        className="menu-sidebar"
        style={{
          height: "100%", // Chiều cao menu chiếm hết chiều cao của Sider
          borderRight: 0, // Loại bỏ viền bên phải của menu
        }}
        items={items.map((menuItem) => ({
          key: menuItem.key,
          icon: (
            <span style={{ color: "#32CD32" }}>
              {/* Thay đổi màu label tại đây */}
              {menuItem.icon}
            </span>
          ),
          // label: menuItem.label,
          label: (
            <span style={{ color: "#f9f9f9" }}>
              {/* Thay đổi màu label tại đây */}
              {menuItem.label}
            </span>
          ),
          onClick: menuItem.onClick,
          children: menuItem.items
            ? menuItem.items.map((childItem) => ({
                key: childItem.key,

                label: (
                  <span style={{ color: "#f9f9f9" }}>
                    {/* Thay đổi màu label tại đây */}
                    {childItem.label}
                  </span>
                ),
                onClick: childItem.onClick,
              }))
            : undefined,
        }))}
      />
    </Sider>
  );
};

export default AdminSideBar;
