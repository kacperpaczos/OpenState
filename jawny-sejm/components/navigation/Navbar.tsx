"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, FileText, Users, Calendar } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Start", icon: LayoutDashboard },
        { href: "/ustawy", label: "Śledź Ustawę", icon: FileText },
        { href: "/poslowie", label: "Śledź Parlamentarzystę", icon: Users },
        { href: "/harmonogram", label: "Plan Prac", icon: Calendar },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass-card rounded-none border-x-0 border-t-0 h-16 px-4 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-colors duration-300">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Activity className="text-blue-600 dark:text-blue-500" size={24} />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">JasnaSprawa.pl</h1>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">JS.pl</h1>
            </Link>

            <div className="flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-blue-100 text-blue-700 dark:bg-white/10 dark:text-white"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                                }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:inline">{item.label}</span>
                        </Link>
                    );
                })}
                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
                <ThemeToggle />
            </div>
        </nav>
    );
}
