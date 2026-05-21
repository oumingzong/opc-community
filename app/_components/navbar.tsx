"use client";

import Link from "next/link";
import { useState } from "react";
import { Brain, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { label: "广州OPC载体", href: "/community-map" },
    { label: "社区动态", href: "/news" },
    { label: "资源中心", href: "/resources" },
    { label: "AI工具", href: "/ai-tools" },
    { label: "相关政策", href: "/policy" },
    { label: "关于我们", href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-sky-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base text-gray-900">
              广州人工智能
              <span className="bg-linear-to-r from-blue-500 to-sky-600 bg-clip-text text-transparent">
                OPC社区
              </span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/plaza"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              交流广场
            </Link>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="text-sm px-4 py-2 rounded-full text-white font-semibold bg-linear-to-r from-blue-500 to-sky-600 hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
            >
              立即加入
            </Link>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50"
            aria-label="打开菜单"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-blue-50 px-4 py-4 space-y-3">
          <Link
            href="/plaza"
            onClick={() => setOpen(false)}
            className="block text-sm text-gray-700 hover:text-blue-600 font-medium py-1"
          >
            交流广场
          </Link>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-gray-700 hover:text-blue-600 font-medium py-1"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setOpen(false)}
            className="block w-full text-center text-sm px-4 py-2 rounded-full text-white font-semibold bg-linear-to-r from-blue-500 to-sky-600"
          >
            立即加入
          </Link>
        </div>
      )}
    </nav>
  );
}
