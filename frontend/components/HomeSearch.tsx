"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
    type: string;
    title: string;
    subtitle?: string;
    url: string;
    external?: boolean;
}

export default function HomeSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setResults(data.results);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="w-full max-w-2xl text-center z-10 relative">
            <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">
                Prześwietl <span className="text-gradient">Polski Parlament</span>
            </h1>

            <div className="relative group text-left">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {loading ? (
                        <Loader2 className="animate-spin text-blue-500" />
                    ) : (
                        <SearchIcon className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj ustawy, posła, interpelacji..."
                    className="w-full h-14 pl-12 pr-6 rounded-2xl bg-surface-color/90 border border-surface-border 
                           text-lg text-foreground placeholder-gray-500 shadow-2xl backdrop-blur-md
                           focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue focus:outline-none focus:bg-surface-color
                           transition-all duration-300"
                />

                {results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-color border border-surface-border rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                        {results.map((r, idx) => (
                            <Link
                                key={idx}
                                href={r.url}
                                target={r.external ? "_blank" : undefined}
                                className="block p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-white">{r.title}</div>
                                        <div className="text-sm text-gray-400">{r.subtitle}</div>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                                        {r.type}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <p className="mt-4 text-sm text-gray-500">
                Wpisz np.: <span className="text-gray-400">"Sławomir Mentzen"</span>, <span className="text-gray-400">"CPK"</span> lub <span className="text-gray-400">"Aborcja"</span>
            </p>
        </div>
    );
}
