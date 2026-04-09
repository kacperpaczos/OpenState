"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
    Activity, 
    FileText, 
    Users, 
    Calendar, 
    Search, 
    ChevronDown, 
    Building2, 
    Gavel, 
    PieChart, 
    RotateCcw,
    LayoutGrid,
    Menu,
    X,
    ArrowRight,
    TrendingUp
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, FormEvent, useEffect, useRef } from "react";
import useLongPress from "@/hooks/useLongPress";

interface NavItem {
    href: string;
    label: string;
    description: string;
    icon: any;
}

interface NavGroup {
    label: string;
    description: string;
    mainHref: string;
    icon: any;
    items: NavItem[];
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchValue, setSearchValue] = useState("");
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMegaMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navGroups: NavGroup[] = [
        {
            label: "Sejm",
            description: "Izba niższa parlamentu",
            mainHref: "/poslowie",
            icon: Building2,
            items: [
                { href: "/poslowie", label: "Posłowie", description: "Profile, aktywność i statystyki", icon: Users },
                { href: "/interpelacje", label: "Interpelacje", description: "Zapytania poselskie do rządu", icon: FileText },
                { href: "/harmonogram", label: "Harmonogram", description: "Plan posiedzeń i prace sejmowe", icon: Calendar },
            ]
        },
        {
            label: "Senat",
            description: "Izba wyższa parlamentu",
            mainHref: "/senatorowie",
            icon: LayoutGrid,
            items: [
                { href: "/senatorowie", label: "Senatorowie", description: "Skład i działalność Senatu", icon: Users },
            ]
        },
        {
            label: "Finanse",
            description: "Budżet i wydatki publiczne",
            mainHref: "/budzet",
            icon: PieChart,
            items: [
                { href: "/budzet", label: "Budżet Państwa", description: "Interaktywna analiza finansów", icon: TrendingUp },
            ]
        },
        {
            label: "Legislacja",
            description: "Projekty i procesy prawne",
            mainHref: "/ustawy",
            icon: Gavel,
            items: [
                { href: "/ustawy", label: "Ustawy", description: "Wykaz projektów i uchwalonych aktów", icon: FileText },
                { href: "/rcl", label: "Prace Rządu", description: "Rządowe Centrum Legislacji", icon: Activity },
            ]
        },
        {
            label: "Analizy",
            description: "Statystyki i monitoring danych",
            mainHref: "/glosowania",
            icon: Activity,
            items: [
                { href: "/glosowania", label: "Głosowania", description: "Wyniki i analiza głosowań", icon: Calendar },
                { href: "/porownaj", label: "Porównaj", description: "Sprawdź zgodność posłów", icon: RotateCcw },
            ]
        }
    ];

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/poslowie?search=${encodeURIComponent(searchValue)}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 h-14 bg-surface-color/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Activity className="text-blue-600 dark:text-blue-500" size={20} />
                        <span className="text-base font-black tracking-tighter text-gray-900 dark:text-white uppercase">OpenState</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/"
                            className={`px-3 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-200 ${
                                pathname === "/" 
                                ? "text-blue-600" 
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            Start
                        </Link>

                        {navGroups.map((group) => (
                            <NavItemDropdown 
                                key={group.label} 
                                group={group} 
                                pathname={pathname}
                                router={router}
                                activeMegaMenu={activeMegaMenu}
                                setActiveMegaMenu={setActiveMegaMenu}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative hidden md:block w-44 lg:w-56 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Szukaj..."
                            className="w-full pl-9 pr-4 py-1.5 rounded-full bg-gray-100/50 dark:bg-white/5 border border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-white/10 text-xs text-foreground focus:outline-none transition-all font-medium"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <ThemeToggle />
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mega Menu Overlay (Full width bar) */}
            {activeMegaMenu && (
                <div 
                    ref={menuRef}
                    className="fixed left-0 top-14 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-3xl border-b border-gray-200/50 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-4 duration-500 overflow-hidden"
                >
                    <div className="max-w-7xl mx-auto px-12 py-12 md:py-16">
                        {navGroups.filter(g => g.label === activeMegaMenu).map(group => (
                            <div key={group.label} className="grid grid-cols-1 md:grid-cols-4 gap-12">
                                <div className="col-span-1">
                                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-4">
                                        <group.icon size={28} />
                                        <h2 className="text-3xl font-black tracking-tighter">{group.label}</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                        {group.description}. Eksploruj dane i śledź procesy decyzyjne w czasie rzeczywistym.
                                    </p>
                                    <Link 
                                        href={group.mainHref}
                                        onClick={() => setActiveMegaMenu(null)}
                                        className="inline-flex items-center gap-2 mt-6 p-1 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white hover:gap-3 transition-all"
                                    >
                                        Przejdź do sekcji <ArrowRight size={14} />
                                    </Link>
                                </div>
                                <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setActiveMegaMenu(null)}
                                            className="group flex flex-col gap-2 p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <item.icon size={20} />
                                            </div>
                                            <div className="mt-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{item.label}</h3>
                                                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{item.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Menu (unchanged for simplicity, but updated labels) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-14 bg-surface-color/95 backdrop-blur-xl z-40 lg:hidden overflow-y-auto p-6">
                    <div className="space-y-8">
                        {navGroups.map((group) => (
                            <div key={group.label} className="space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{group.label}</div>
                                <div className="grid gap-4 pl-2">
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-4 text-base font-bold text-gray-900 dark:text-white"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                                <item.icon size={16} />
                                            </div>
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavItemDropdown({ group, pathname, router, activeMegaMenu, setActiveMegaMenu }: { 
    group: NavGroup, 
    pathname: string, 
    router: any,
    activeMegaMenu: string | null,
    setActiveMegaMenu: (label: string | null) => void 
}) {
    const isGroupActive = group.items.some(item => pathname === item.href);
    const isOpen = activeMegaMenu === group.label;

    const { isLongPressActive, ...longPressProps } = useLongPress({
        onLongPress: () => {
            setActiveMegaMenu(isOpen ? null : group.label);
        },
        onClick: () => {
            router.push(group.mainHref);
            setActiveMegaMenu(null);
        },
        ms: 400
    });

    return (
        <div className="relative">
            <button
                {...longPressProps}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-200 transform
                    ${isOpen ? "scale-95" : "scale-100"}
                    ${isGroupActive || isOpen
                        ? "text-blue-600 drop-shadow-sm"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                    }`}
            >
                <span>{group.label}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
        </div>
    );
}



