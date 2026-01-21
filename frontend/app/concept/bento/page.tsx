import React from 'react';
import { Search, ArrowUpRight, Play, BookOpen, BarChart3, Calendar } from 'lucide-react';

export default function BentoConceptPage() {
    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0f0f11] text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8 flex flex-col items-center">

            {/* AI Header */}
            <header className="w-full max-w-6xl flex justify-between items-center mb-12 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full"></div>
                    <span className="font-bold text-xl tracking-tight">OpenOurGov</span>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">O Projekcie</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">API</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Kontakt</a>
                </nav>
            </header>

            {/* Main Search - AI First */}
            <div className="w-full max-w-2xl mb-16 text-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
                    W czym mogę Ci dzisiaj pomóc?
                </h1>
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-800 dark:to-gray-800 rounded-3xl blur transition-opacity opacity-50 group-hover:opacity-100"></div>
                    <div className="relative bg-white dark:bg-[#1c1c1e] rounded-3xl p-2 flex items-center shadow-sm border border-gray-200 dark:border-gray-800 transition-all focus-within:ring-2 ring-blue-500/20">
                        <Search className="w-6 h-6 text-gray-400 ml-4" />
                        <input
                            type="text"
                            placeholder="Np. 'Jak głosował poseł Kowalski w sprawie 500+?'"
                            className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg placeholder-gray-400"
                        />
                        <button className="bg-black dark:bg-white text-white dark:text-black rounded-2xl px-6 py-3 font-medium text-sm hover:opacity-90 transition-opacity">
                            Szukaj
                        </button>
                    </div>
                </div>
                <div className="flex justify-center gap-3 text-sm text-gray-500">
                    <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition">📝 Ostatnie ustawy</span>
                    <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition">🗳️ Wyniki głosowań</span>
                    <span className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 transition">👤 Znajdź posła</span>
                </div>
            </div>

            {/* BENTO GRID */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]">

                {/* Large Feature / Hero Block */}
                <div className="col-span-1 md:col-span-2 md:row-span-2 bg-white dark:bg-[#1c1c1e] rounded-[32px] p-8 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Live: Posiedzenie Sejmu</h2>
                            <p className="text-gray-500 dark:text-gray-400">Trwa 14. posiedzenie. Oglądaj transmisję i śledź wyniki na żywo.</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-sm font-medium">Oglądaj teraz</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                    {/* Abstract visual */}
                    <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                </div>

                {/* Top Right - Status */}
                <div className="md:col-span-2 bg-[#f4f4f5] dark:bg-[#2c2c2e] rounded-[32px] p-6 flex items-center justify-between border border-transparent dark:border-gray-700">
                    <div>
                        <h3 className="font-semibold text-lg">Harmonogram</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Najbliższe głosowanie: 16:30</p>
                    </div>
                    <div className="bg-white dark:bg-black p-3 rounded-full">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>

                {/* Mid Left - Process */}
                <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-6 border border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <BookOpen className="w-6 h-6 text-purple-500" />
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md">New</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Druk nr 341</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">O zmianie ustawy o OZE</p>
                </div>

                {/* Mid Right - Stats */}
                <div className="bg-white dark:bg-[#1c1c1e] rounded-[32px] p-6 border border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Frekwencja</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Średnia: 89% (wzrost)</p>
                </div>

                {/* Bottom Wide - Quick Actions */}
                <div className="md:col-span-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                            <Play className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Skrót dnia w 2 minuty</h3>
                            <p className="text-gray-300 text-sm">Podsumowanie najważniejszych wydarzeń wygenerowane przez AI.</p>
                        </div>
                    </div>
                    <button className="relative z-10 mt-4 md:mt-0 bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
                        Odtwórz
                    </button>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                </div>

            </div>

            <div className="mt-12 text-center text-gray-400 text-sm">
                <p>Concept Design 2026 • AI-First Interface</p>
            </div>

        </div>
    );
}

// Missing Icon import fix
function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
