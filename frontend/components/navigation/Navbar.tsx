"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, FileText, Users, Calendar, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setGlobalSearch, selectGlobalSearch } from "@/lib/features/search/searchSlice";

export default function Navbar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const globalSearch = useAppSelector(selectGlobalSearch);

    const navItems = [
        { href: "/", label: "Start", icon: LayoutDashboard },
        { href: "/ustawy", label: "Ustawy", icon: FileText },
        { href: "/poslowie", label: "Posłowie", icon: Users },
        { href: "/senatorowie", label: "Senatorowie", icon: Users },
        { href: "/glosowania", label: "Głosowania", icon: Calendar },
        { href: "/interpelacje", label: "Interpelacje", icon: FileText },
        { href: "/porownaj", label: "Porównaj", icon: Users },
        { href: "/rcl", label: "RCL", icon: Activity },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass-card !rounded-none border-x-0 border-t-0 h-16 px-4 sm:px-6 flex items-center justify-between bg-surface-color backdrop-blur-xl transition-colors duration-300">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Activity className="text-blue-600 dark:text-blue-500" size={24} />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">OpenState</h1>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:hidden">OS</h1>
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

                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2 hidden sm:block" />

                {/* Global Search */}
                <div className="relative hidden md:block w-48 lg:w-64 mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Szukaj..."
                        className="w-full pl-9 pr-4 py-1.5 rounded-input bg-gray-100 dark:bg-white/10 border-none text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                        value={globalSearch}
                        onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
                    />
                </div>

                <ThemeToggle />
            </div>
        </nav>
    );
}
