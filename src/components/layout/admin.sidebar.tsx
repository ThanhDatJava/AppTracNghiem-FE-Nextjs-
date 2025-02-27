"use client";

import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  TeamOutlined,
  SettingOutlined,
  BookTwoTone,
  FileTextOutlined,
  AppstoreAddOutlined,
  ReadOutlined,
  UserAddOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
// import { useRouter } from "next/router";

import { useRouter } from "next/navigation";
import { AdminContext } from "@/library/admin.context";

const { Sider } = Layout;
const { SubMenu } = Menu;

type MenuItem = {
  key: string;
  label: string;
  icon?: JSX.Element;
  children?: MenuItem[];
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
            children: [
              {
                key: "/study/question/manage-question",
                label: "Question",
                onClick: () =>
                  handleMenuClick("/study/question/manage-question"),
              },
              {
                key: "/study/question/manage-quiz",
                label: "Quiz",
                onClick: () => handleMenuClick("/study/question/manage-quiz"),
              },
            ],
          },
          {
            key: "/study/question",
            label: "Manage Student",
            icon: <UsergroupAddOutlined />,
            children: [
              {
                key: "/study/question/manage-question",
                label: "Score",
                onClick: () =>
                  handleMenuClick("/study/question/manage-question"),
              },
              {
                key: "/study/question/manage-quiz",
                label: "Information",
                onClick: () => handleMenuClick("/study/question/manage-quiz"),
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
          // Add more menu items specific to USER role as needed
        ];
        break;
      default:
        // Default menu items for roles other than ADMIN and USER
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
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["/study"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        {items.map((menuItem) =>
          menuItem.children ? (
            <SubMenu
              key={menuItem.key}
              icon={menuItem.icon}
              title={menuItem.label}
            >
              {menuItem.children.map((childItem) => (
                <Menu.Item key={childItem.key} onClick={childItem.onClick}>
                  {childItem.label}
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item
              key={menuItem.key}
              icon={menuItem.icon}
              onClick={menuItem.onClick}
            >
              {menuItem.label}
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
  );
};

export default AdminSideBar;
