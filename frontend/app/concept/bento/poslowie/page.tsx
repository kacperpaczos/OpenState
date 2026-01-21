import React from 'react';
import { Search, Filter, Share2, MoreHorizontal, User } from 'lucide-react';

export default function BentoMPsPage() {
    // Mock data for prototype - in real app would use getMPs()
    const mockMPs = [
        { id: 1, name: "Donald Tusk", party: "KO", district: "Warszawa I", img: "https://api.sejm.gov.pl/sejm/term10/MP/408/photo-mini" },
        { id: 2, name: "Jarosław Kaczyński", party: "PiS", district: "Kielce", img: "https://api.sejm.gov.pl/sejm/term10/MP/147/photo-mini" },
        { id: 3, name: "Szymon Hołownia", party: "P2050", district: "Białystok", img: "https://api.sejm.gov.pl/sejm/term10/MP/114/photo-mini" },
        { id: 4, name: "Sławomir Mentzen", party: "Konfederacja", district: "Warszawa I", img: "https://api.sejm.gov.pl/sejm/term10/MP/233/photo-mini" },
    ];

    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0f0f11] text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8">

            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                    </span>
                    Posłowie
                </h1>
                <div className="flex gap-2">
                    <button className="p-2 bg-white dark:bg-[#1c1c1e] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-white dark:bg-[#1c1c1e] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-white dark:bg-[#1c1c1e] p-2 rounded-2xl flex items-center shadow-sm border border-gray-200 dark:border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                    <input type="text" placeholder="Szukaj posła..." className="w-full bg-transparent border-none outline-none px-3 py-2" />
                </div>
                <button className="bg-white dark:bg-[#1c1c1e] px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm border border-gray-200 dark:border-gray-800">
                    <Filter className="w-4 h-4" />
                    Wszystkie Kluby
                </button>
                <button className="bg-white dark:bg-[#1c1c1e] px-4 py-3 rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm border border-gray-200 dark:border-gray-800">
                    Okręg
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockMPs.map(mp => (
                    <div key={mp.id} className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-4 border border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform cursor-pointer group shadow-sm hover:shadow-md">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4 overflow-hidden relative">
                            <img src={mp.img} alt={mp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                {mp.party}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg leading-tight mb-1">{mp.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{mp.district}</p>
                    </div>
                ))}

                {/* 'Show More' Card */}
                <div className="bg-[#e5e7eb] dark:bg-[#1c1c1e] rounded-[24px] p-4 border border-transparent dark:border-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center justify-center cursor-pointer min-h-[250px]">
                    <span className="font-medium text-gray-500">Załaduj więcej...</span>
                </div>
            </div>

        </div>
    );
}
