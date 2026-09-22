"use client";

import React from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import Logout from "@/module/auth/components/logout";

/* ---------------- ICONS ---------------- */

const DashboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const GithubIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.71.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.48a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10a1.7 1.7 0 0 0-.34-1.88L9 8.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2v.48a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2h-.04A1.7 1.7 0 0 0 19.4 15Z" />
  </svg>
);

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

/* ---------------- SIDEBAR ---------------- */

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();


  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
    },
    {
      title: "Repository",
      url: "/dashboard/repository",
      icon: GithubIcon,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: DashboardIcon,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: DashboardIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ];

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

if (!session) {
  return null;
}

  const user = session.user;

  const userName = user.name || "GUEST";
  const userEmail = user.email || "";
  const userAvatar = user.image || "";

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar className="border-r bg-white">
      {/* HEADER */}
      <SidebarHeader className="border-b px-4 py-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 rounded-md">
            <AvatarImage
              src={userAvatar || "/placeholder.svg"}
              alt={userName}
            />

            <AvatarFallback className="rounded-md bg-[#59483f] text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              Connected Account
            </p>

            <p className="truncate text-sm font-medium text-gray-700">
              @{userName}
            </p>

            <p className="truncate text-xs text-gray-500">
              aka {userName}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-3 py-6">
        <p className="mb-4 px-3 text-xs font-medium tracking-wider text-gray-400">
          MENU
        </p>

        <SidebarMenu className="gap-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
<SidebarMenuButton
  render={<Link href={item.url} />}
  isActive={isActive(item.url)}
  className="
    h-11
    rounded-md
    px-3
    text-[15px]
    font-medium
    text-gray-600
    hover:bg-gray-100
    hover:text-gray-900
    data-[active=true]:bg-gray-100
    data-[active=true]:text-gray-900
  "
>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
<DropdownMenuTrigger
  render={
    <button
      type="button"
      className="
        flex
        w-full
        h-14
        items-center
        gap-3
        rounded-md
        px-2
        text-left
        hover:bg-gray-100
      "
    />
  }
>
  <Avatar className="h-9 w-9">
    <AvatarImage
      src={userAvatar || "/placeholder.svg"}
      alt={userName}
    />

    <AvatarFallback className="bg-gray-900 text-white">
      {userInitials}
    </AvatarFallback>
  </Avatar>

  <div className="flex min-w-0 flex-1 flex-col items-start">
    <span className="max-w-[150px] truncate text-sm font-medium text-gray-700">
      {userName}
    </span>

    <span className="max-w-[150px] truncate text-xs text-gray-400">
      {userEmail}
    </span>
  </div>
</DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-72 rounded-lg border bg-white p-2 shadow-lg"
              >
                {/* USER */}
                <div className="flex items-center gap-3 border-b px-3 py-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                    />

                    <AvatarFallback>
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {userEmail}
                    </p>
                  </div>
                </div>

                {/* THEME */}
<DropdownMenuItem
  className="mt-1"
  render={
    <button
      type="button"
      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-3"
    />
  }
  onClick={() =>
    setTheme(theme === "dark" ? "light" : "dark")
  }
>
  {theme === "dark" ? (
    <>
      <SunIcon />
      <span>Light Mode</span>
    </>
  ) : (
    <>
      <MoonIcon />
      <span>Dark Mode</span>
    </>
  )}
</DropdownMenuItem>
 
                {/* LOGOUT */}
<DropdownMenuItem>
  <Logout className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-3">
    Sign Out
  </Logout>
</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};