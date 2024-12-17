"use client";

import { useAppSelector, useAppDispatch } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/app/state';
import { Archive, ArrowRightLeft, Clipboard, Layout, LucideIcon, Menu, SlidersHorizontal, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  onLinkClick: () => void; 
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onLinkClick,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/');

  return (
    <Link href={href} onClick={onLinkClick}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? 'justify-center py-4' : 'justify-start px-8 py-4'
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? 'bg-blue-200 text-white' : ''
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${isCollapsed ? 'hidden' : 'block'} font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const pathname = usePathname(); // Get the current path

  // Check if the current page is "/login"
  const isLoginPage = pathname === "/";

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      dispatch(setIsSidebarCollapsed(true));
    }
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? 'w-0 md:w-16' : 'w-72 md:w-64'
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  if (isLoginPage) {
    return null; // If on login page, don't render the sidebar
  }

  return (
    <div className={sidebarClassNames}>
      <div
        className={`flex justify-between md:justify-normal items-center transition-all duration-300 overflow-hidden pt-8 ${
          isSidebarCollapsed ? 'px-1' : 'px-8'
        }`}
      >
        <div>
          <Image
            src="/images/support_logo.png"
            alt="logo"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        </div>
        <div
          className={`flex flex-col ${isSidebarCollapsed ? 'hidden' : 'block'}`}
        >
          <h1 className="font-extrabold text-2xl">Support</h1>
          <span className="font-semibold text-xs">Parts Trade EST</span>
        </div>
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 ml-3"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* links */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
        <SidebarLink
          href="/transactions"
          icon={ArrowRightLeft}
          label="Transactions"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
          onLinkClick={closeSidebarOnMobile}
        />
      </div>

      {/* footer */}
      <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; 2024 RBH Production
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
