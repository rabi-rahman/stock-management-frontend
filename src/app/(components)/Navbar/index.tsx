"use client";

import { useAppSelector, useAppDispatch } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/app/state';
import { Bell, Menu, Moon, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Product, useGetProductsQuery } from '@/app/state/api';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isBadgeVisible, setIsBadgeVisible] = useState(true);

  const { data: products } = useGetProductsQuery();
  const pathname = usePathname(); // Get the current path

  const isLoginPage = pathname === "/";

  useEffect(() => {
    if (products) {
      const lowStock = products.filter((product) => product.quantity <= 5);
      setLowStockProducts(lowStock);
      setIsBadgeVisible(lowStock.length > 0);
    }
  }, [products]);

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen((prevState) => {
      if (!prevState) {
        setIsBadgeVisible(false);
      }
      return !prevState;
    });
  };

  if (isLoginPage) {
    return null; // If on login page, don't render the sidebar
  }



  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* Left side */}
      <div className="flex justify-between items-center md:gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex justify-between items-center gap-5">
        <div className="flex justify-between items-center gap-2 md:gap-5">
          <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>
          <div className="relative">
            {/* Bell Icon */}
            <button onClick={toggleBellDropdown}>
              <Bell className="cursor-pointer text-gray-500" size={24} />
              {isBadgeVisible && lowStockProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none bg-red-400 rounded-full">
                  {lowStockProducts.length}
                </span>
              )}
            </button>

            {/* Alert Modal Dropdown */}
            {isBellDropdownOpen && (
              <div className="absolute right--10 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 z-50">
                <h3 className="font-bold text-lg mb-2">Low Stock Alert</h3>
                <ul>
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <li
                        key={product.productId}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                      >
                        <span>{product.code}</span>
                        <span className="text-red-500 font-semibold">
                          Qty: {product.quantity}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No alerts</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <hr className="w-0 h-7 border border-solid border-1 border-gray-300 mx-3" />
          <Link href="/users">
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-9 h-9">  
              <Image
                src="/images/admin.png"
                alt="Admin"
                width={28} 
                height={28}
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-semibold">Admin</span>
          </div>
          </Link>
        </div>
        <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
