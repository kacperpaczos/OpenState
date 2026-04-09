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
    TrendingUp,
    ExternalLink,
    Landmark,
    Edit3,
    MessageSquare,
    Globe
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, FormEvent, useEffect, useRef } from "react";
import useLongPress from "@/hooks/useLongPress";

interface NavItem {
    href: string;
    label: string;
    description: string;
    icon: any;
    isExternal?: boolean;
}

interface NavColumn {
    title: string;
    items: NavItem[];
}

interface NavGroup {
    label: string;
    description: string;
    mainHref: string;
    icon: any;
    columns?: NavColumn[]; // New structured layout for Sejm
    items?: NavItem[]; // Legacy flat layout for other groups
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
            description: "Pełny wgląd w prace izby niższej parlamentu",
            mainHref: "/poslowie",
            icon: Building2,
            columns: [
                {
                    title: "Reprezentanci",
                    items: [
                        { href: "/poslowie", label: "Posłowie", description: "Profile, aktywność i statystyki", icon: Users },
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/oswiadczenia.xsp", label: "Majątki", description: "Oświadczenia majątkowe", icon: TrendingUp, isExternal: true },
                        { href: "/poslowie?sort=active", label: "Rankingi", description: "Najbardziej aktywni posłowie", icon: Activity },
                    ]
                },
                {
                    title: "Procesy",
                    items: [
                        { href: "/harmonogram", label: "Harmonogram", description: "Plan posiedzeń i obrad", icon: Calendar },
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/agent.xsp?symbol=KOMISJE_STALE", label: "Komisje", description: "Prace w komisjach sejmowych", icon: Search, isExternal: true },
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/agent.xsp?symbol=ZESPOLY", label: "Zespoły", description: "Grupy parlamentarne", icon: Users, isExternal: true },
                    ]
                },
                {
                    title: "Dokumentacja",
                    items: [
                        { href: "/ustawy", label: "Ustawy", description: "Projekty i uchwalone akty", icon: Gavel },
                        { href: "/interpelacje", label: "Interpelacje", description: "Zapytania do rządu", icon: FileText },
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/druki.xsp", label: "Druki Sejmowe", description: "Oficjalne dokumenty", icon: FileText, isExternal: true },
                    ]
                },
                {
                    title: "Transparency",
                    items: [
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/transmisje.xsp", label: "Transmisje", description: "Obrady w czasie rzeczywistym", icon: Activity, isExternal: true },
                        { href: "https://www.sejm.gov.pl/Sejm9.nsf/stenogramy.xsp", label: "Stenogramy", description: "Zapisy słowo w słowo", icon: FileText, isExternal: true },
                        { href: "/udip", label: "Wniosek UDIP", description: "Zapytaj o informację publiczną", icon: ArrowRight },
                    ]
                }
            ]
        },
        {
            label: "Senat",
            description: "Izba wyższa parlamentu - refleksja i obywatelskość",
            mainHref: "/senatorowie",
            icon: LayoutGrid,
            columns: [
                {
                    title: "Skład i Ludzie",
                    items: [
                        { href: "/senatorowie", label: "Senatorowie RP", description: "Wykaz i aktywność senatorów", icon: Users },
                        { href: "https://www.senat.gov.pl/sklad/senatorowie/oswiadczenia,92,11.html", label: "Majątki", description: "Oświadczenia majątkowe XI kad.", icon: TrendingUp, isExternal: true },
                        { href: "https://www.senat.gov.pl/o-senacie/organy/", label: "Organy Senatu", description: "Marszałek i Prezydium", icon: Landmark, isExternal: true },
                    ]
                },
                {
                    title: "Legislacja",
                    items: [
                        { href: "https://www.senat.gov.pl/prace/proces-legislacyjny-w-senacie/ustawy-uchwalone-przez-sejm/", label: "Poprawki Senatu", description: "Zmiany wprowadzane do ustaw", icon: Edit3, isExternal: true },
                        { href: "https://www.senat.gov.pl/prace/opinie-i-ekspertyzy/", label: "Opinie i Ekspertyzy", description: "Analizy prawne projektów", icon: Search, isExternal: true },
                        { href: "https://www.senat.gov.pl/prace/druki/", label: "Druki Senackie", description: "Oficjalna dokumentacja prac", icon: FileText, isExternal: true },
                    ]
                },
                {
                    title: "Inicjatywy",
                    items: [
                        { href: "https://www.senat.gov.pl/prace/petycje/", label: "Petycje Obywatelskie", description: "Wnioski o zmiany w prawie", icon: MessageSquare, isExternal: true },
                        { href: "https://www.senat.gov.pl/prace/komisje-senackie/", label: "Komisje", description: "Specjalistyczne prace izby", icon: Users, isExternal: true },
                        { href: "https://www.senat.gov.pl/prace/posiedzenia/", label: "Posiedzenia", description: "Harmonogram i porządek obrad", icon: Calendar, isExternal: true },
                    ]
                },
                {
                    title: "Misja i Wiedza",
                    items: [
                        { href: "https://www.senat.gov.pl/o-senacie/senat-w-liczbach-i-grafikach/", label: "Senat w liczbach", description: "Statystyki i infografiki", icon: Activity, isExternal: true },
                        { href: "https://www.senat.gov.pl/o-senacie/osrodki-senackie/osrodek-studiow-i-opinii/", label: "Ośrodek Studiów", description: "Zaplecze analityczne Senatu", icon: FileText, isExternal: true },
                        { href: "https://www.senat.gov.pl/polonia/", label: "Polonia", description: "Opieka nad Polakami za granicą", icon: Globe, isExternal: true },
                    ]
                }
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
                            <div key={group.label} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-3">
                                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-4">
                                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                                            <group.icon size={32} />
                                        </div>
                                        <h2 className="text-3xl font-black tracking-tighter">{group.label}</h2>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                                        {group.description}. Eksploruj dane i śledź procesy decyzyjne w czasie rzeczywistym.
                                    </p>
                                    <Link 
                                        href={group.mainHref}
                                        onClick={() => setActiveMegaMenu(null)}
                                        className="inline-flex items-center gap-2 p-1 text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hover:gap-3 transition-all border-b border-gray-900 dark:border-white"
                                    >
                                        Przejdź do sekcji <ArrowRight size={14} />
                                    </Link>
                                </div>

                                <div className="lg:col-span-9">
                                    {group.columns ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                                            {group.columns.map((column) => (
                                                <div key={column.title} className="space-y-6">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5 pb-2">
                                                        {column.title}
                                                    </h3>
                                                    <div className="flex flex-col gap-4">
                                                        {column.items.map((item) => (
                                                            <MenuLink key={item.href} item={item} onClick={() => setActiveMegaMenu(null)} />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {group.items?.map((item) => (
                                                <MenuLink key={item.href} item={item} onClick={() => setActiveMegaMenu(null)} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-14 bg-surface-color/95 backdrop-blur-xl z-40 lg:hidden overflow-y-auto p-6">
                    <div className="space-y-10">
                        {navGroups.map((group) => (
                            <div key={group.label} className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                    <group.icon size={14} />
                                    {group.label}
                                </div>
                                <div className="grid gap-4 pl-2">
                                    {group.columns ? (
                                        group.columns.map(col => col.items.map(item => (
                                            <MobileMenuLink key={item.href} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                                        )))
                                    ) : (
                                        group.items?.map((item) => (
                                            <MobileMenuLink key={item.href} item={item} onClick={() => setIsMobileMenuOpen(false)} />
                                        ))
                                    )}
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
    const isGroupActive = group.items ? group.items.some(item => pathname === item.href) : group.columns?.some(col => col.items.some(item => pathname === item.href));
    const isOpen = activeMegaMenu === group.label;
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    const handleMouseEnter = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
            setActiveMegaMenu(group.label);
        }, 150);
    };

    const handleMouseLeave = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };

    return (
        <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                {...longPressProps}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-200 transform
                    ${isOpen ? "scale-95 text-blue-600" : "scale-100"}
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

function MenuLink({ item, onClick }: { item: NavItem, onClick: () => void }) {
    const isExternal = item.isExternal;
    const LinkComponent = isExternal ? 'a' : Link;
    const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <LinkComponent
            key={item.href}
            href={item.href}
            onClick={onClick}
            {...(externalProps as any)}
            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                <item.icon size={16} />
            </div>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                        {item.label}
                    </span>
                    {isExternal && <ExternalLink size={10} className="text-gray-400 shrink-0" />}
                </div>
                <span className="text-[10px] text-gray-500 font-medium leading-tight truncate">
                    {item.description}
                </span>
            </div>
        </LinkComponent>
    );
}

function MobileMenuLink({ item, onClick }: { item: NavItem, onClick: () => void }) {
    const isExternal = item.isExternal;
    const LinkComponent = isExternal ? 'a' : Link;
    const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        <LinkComponent
            key={item.href}
            href={item.href}
            onClick={onClick}
            {...(externalProps as any)}
            className="flex items-center gap-4 text-base font-bold text-gray-900 dark:text-white group"
        >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0"
            >
                <item.icon size={16} />
            </div>
            <div className="flex items-center gap-2">
                {item.label}
                {isExternal && <ExternalLink size={10} className="text-gray-400" />}
            </div>
        </LinkComponent>
    );
}



