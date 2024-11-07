"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuBookRounded,
  StarsRounded,
  ManageAccountsRounded,
  TopicRounded,
  Logout,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import UserProfile from "./userprofile";
import { useUser } from "@/context/userContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { FileText } from "lucide-react";

interface LinkItem {
  name: string;
  path: string;
  target?: string;
  icon: React.ReactNode;
  isAdmin?: boolean;
}

const NavRail: React.FC = () => {
  const pathname = usePathname();
  const { User, isLoading, refreshUser } = useUser();

  const links: LinkItem[] = useMemo(
    () => [
      { name: "เลือกหมวดหมู่", path: "/selectgame", icon: <MenuBookRounded /> },
      {
        name: "สรุปคะแนนรวม",
        path: "/score",
        icon: <StarsRounded />,
        target: "",
        isAdmin: true,
      },
      {
        name: "จัดการผู้ใช้",
        path: "/user",
        icon: <ManageAccountsRounded />,
        target: "",
        isAdmin: true,
      },
      {
        name: "จัดการหัวข้อ",
        path: "/topic",
        icon: <TopicRounded />,
        target: "",
        isAdmin: true,
      },
      {
        name: "ดาวน์โหลดคู่มือ",
        path: "https://www.google.co.th",
        icon: <FileText />,
        target: "_blank",
        isAdmin: true,
      },
    ],
    []
  );

  if (isLoading || pathname === "/" || pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    refreshUser();
  };

  const renderNavLink = (link: LinkItem) => {
    if (link.target === "_blank") {
      return (
        <a
          href={link.path}
          target="_blank"
          className={`group flex flex-col items-center gap-1 transition-all ${
            pathname.startsWith(link.path) ? "text-[#FA8072]" : "text-[default]"
          }`}
        >
          <IconButton
            size="large"
            className="transition-all duration-300 ease-in-out group-hover:bg-[rgba(250,128,114,0.05)]"
          >
            {React.cloneElement(link.icon as React.ReactElement, {
              className: `${
                pathname.startsWith(link.path)
                  ? "text-[#FA8072]"
                  : "text-[default]"
              } group-hover:text-[#E9967A]`,
            })}
          </IconButton>
          <span className="text-xs text-center transition-colors duration-300 group-hover:text-[#E9967A]">
            {link.name}
          </span>
        </a>
      );
    } else {
      return (
        <Link
          href={link.path}
          className={`group flex flex-col items-center gap-1 transition-all ${
            pathname.startsWith(link.path) ? "text-[#FA8072]" : "text-[default]"
          }`}
        >
          <IconButton
            size="large"
            className="transition-all duration-300 ease-in-out group-hover:bg-[rgba(250,128,114,0.05)]"
          >
            {React.cloneElement(link.icon as React.ReactElement, {
              className: `${
                pathname.startsWith(link.path)
                  ? "text-[#FA8072]"
                  : "text-[default]"
              } group-hover:text-[#E9967A]`,
            })}
          </IconButton>
          <span className="text-xs text-center transition-colors duration-300 group-hover:text-[#E9967A]">
            {link.name}
          </span>
        </Link>
      );
    }
  };

  return (
    <>
      <nav className="hidden sm:flex flex-col justify-between fixed z-20 gap-4 h-screen sm:w-20 px-2 py-4 bg-white shadow-md">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/profile"
            className={`group flex flex-col items-center gap-1 transition-all ${
              pathname.startsWith("/profile")
                ? "text-[#FA8072]"
                : "text-[default]"
            }`}
          >
            <UserProfile />
            <span className="text-xs text-center transition-colors duration-300 group-hover:text-[#E9967A]">
              โปรไฟล์
            </span>
          </Link>
          {links.map((link, index) => (
            <React.Fragment key={link.name}>
              {(!link.isAdmin || (User && User.isAdmin)) && renderNavLink(link)}
              {index === 0 && <div className="w-3/4 h-px bg-gray-300" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-col items-center mb-10">
          <IconButton
            onClick={handleLogout}
            size="large"
            className="transition-all duration-300 ease-in-out text-[default] hover:bg-[rgba(250,128,114,0.05)] hover:text-[#E9967A]"
          >
            <Logout />
          </IconButton>
          <span className="text-xs text-center text-[default]">ออกจากระบบ</span>
        </div>
      </nav>

      <nav className="flex items-start gap-2 sm:hidden fixed z-20 left-2 top-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <div className="w-8">
                  <UserProfile />
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="divide-y w-32">
                <div className="p-2">
                  <Link
                    href="/profile"
                    className={`group flex flex-col items-center transition-all ${
                      pathname.startsWith("/profile")
                        ? "text-[#FA8072]"
                        : "text-[default]"
                    }`}
                  >
                    โปรไฟล์
                  </Link>
                </div>
                {links.map(
                  (link, index) =>
                    (!link.isAdmin || (User && User.isAdmin)) && (
                      <div key={index} className="p-2">
                        <Link
                          href={link.path}
                          className={`group flex flex-col items-center gap-1 transition-all ${
                            pathname.startsWith(link.path)
                              ? "text-[#FA8072]"
                              : "text-[default]"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </div>
                    )
                )}
                <div
                  onClick={handleLogout}
                  className="p-2 flex justify-center items-center cursor-pointer"
                >
                  ออกจากระบบ
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </>
  );
};

export default NavRail;
