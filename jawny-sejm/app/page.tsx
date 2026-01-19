import { Search } from "lucide-react";
import Hemicycle from "@/components/visual/Hemicycle";
import { getParliamentMembers } from "@/lib/data";

export default async function Home() {
  const mps = await getParliamentMembers();

  return (
    <div className="flex flex-col items-center justify-center h-full pb-20 fade-in">
      {/* Visualization */}
      <div className="glass-card w-full max-w-4xl p-8 flex items-center justify-center bg-black/20 backdrop-blur-xl mb-10">
        <Hemicycle mps={mps} />
      </div>

      {/* Search Section */}
      <div className="w-full max-w-2xl text-center z-10">
        <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">
          Prześwietl <span className="text-gradient">Polski Parlament</span>
        </h1>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Szukaj ustawy (np. 'CPK') lub posła..."
            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white/5 border border-white/10 
                       text-lg text-white placeholder-gray-500 shadow-2xl backdrop-blur-md
                       focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none focus:bg-white/10
                       transition-all duration-300"
          />
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Spróbuj wpisać: <span className="text-gray-400">"Ustawa o Ochronie Zwierząt"</span> lub <span className="text-gray-400">"Sławomir Mentzen"</span>
        </p>
      </div>
    </div>
  );
}
