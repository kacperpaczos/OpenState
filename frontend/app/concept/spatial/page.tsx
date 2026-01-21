import React from 'react';
import { Search, Mic, ArrowRight, LayoutGrid, Users, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function SpatialConceptPage() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans text-gray-900 dark:text-gray-100 bg-[#f5f5f7] dark:bg-[#050505]">
            {/* Ambient Background Lights */}
            <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[120px] animate-pulse dark:bg-blue-600/10 pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000 dark:bg-purple-600/10 pointer-events-none" />

            {/* Main Container */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[90vh]">

                {/* Floating Header "Island" */}
                <div className="mb-12 glass-card !rounded-full py-2 px-6 flex items-center space-x-2 animate-bounce-slow">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium tracking-wide opacity-80">System Live • Sejm X Kadencji</span>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-16 space-y-6 max-w-3xl">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 drop-shadow-sm">
                        Jawny Sejm
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                        Przejrzystość w nowym wymiarze.
                        <br />
                        Śledź prace parlamentu w czasie rzeczywistym.
                    </p>
                </div>

                {/* Floating Search Bar (Spatial Element) */}
                <div className="w-full max-w-2xl relative group transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative glass-card !p-2 flex items-center !rounded-2xl">
                        <Search className="w-6 h-6 text-gray-400 ml-4" />
                        <input
                            type="text"
                            placeholder="Zapytaj o ustawę, posła lub temat..."
                            className="w-full bg-transparent border-none outline-none px-4 py-4 text-lg placeholder-gray-400 font-light"
                        />
                        <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Spatial Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20">
                    {/* Card 1 */}
                    <Link href="/poslowie" className="group">
                        <div className="glass-card h-64 flex flex-col justify-between hover:bg-blue-500/5 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-500/30 transition-all duration-300">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-xl">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Posłowie</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Przeglądaj profile, aktywność i statystyki 460 posłów.</p>
                            </div>
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/ustawy" className="group">
                        <div className="glass-card h-64 flex flex-col justify-between hover:bg-purple-500/5 dark:hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all duration-300">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 w-fit rounded-xl">
                                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Proces Legislacyjny</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Śledź drogi ustaw od projektu do podpisu Prezydenta.</p>
                            </div>
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight className="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                    </Link>

                    {/* Card 3 */}
                    <Link href="/glosowania" className="group">
                        <div className="glass-card h-64 flex flex-col justify-between hover:bg-green-500/5 dark:hover:bg-green-500/10 border border-transparent hover:border-green-500/30 transition-all duration-300">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 w-fit rounded-xl">
                                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Głosowania</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Analizuj wyniki głosowań i dyscyplinę partyjną.</p>
                            </div>
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                                <ArrowRight className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    </Link>
                </div>

            </main>
        </div>
    );
}
