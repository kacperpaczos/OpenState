"use client";

import { Database, RefreshCcw, AlertTriangle } from "lucide-react";

/**
 * Fullscreen Splash Screen displayed when the database is unreachable.
 */
export function DatabaseForbidden() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <div className="relative mb-8">
        <Database size={80} className="text-gray-700 animate-pulse" />
        <AlertTriangle 
          size={32} 
          className="absolute -bottom-2 -right-2 text-red-500 animate-bounce" 
        />
      </div>
      
      <h1 className="text-3xl font-bold mb-4 tracking-tight">
        System Niedostępny
      </h1>
      
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Nie możemy nawiązać stabilnego połączenia z bazą danych OpenState. 
        Prawdopodobnie trwa aktualizacja danych lub przerwa techniczna.
      </p>
      
      <button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
      >
        <RefreshCcw size={18} />
        Spróbuj ponownie
      </button>
      
      <div className="mt-12 text-xs text-gray-600 font-mono">
        ERR_DB_CONNECTION_TIMEOUT | OpenState Protocol 1.0
      </div>
    </div>
  );
}
