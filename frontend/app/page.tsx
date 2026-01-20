import { Search } from "lucide-react";
import Hemicycle from "@/components/visual/Hemicycle";
import { getParliamentMembers } from "@/lib/data";

export default async function Home() {
  const mps = await getParliamentMembers();

  return (
    <div className="flex flex-col items-center justify-center h-full pb-20 fade-in">
      {/* Visualization */}
      <div className="glass-card w-full max-w-4xl p-8 flex items-center justify-center mb-10">
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
            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-surface-color/50 border border-surface-border 
                       text-lg text-foreground placeholder-gray-500 shadow-2xl backdrop-blur-md
                       focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue focus:outline-none focus:bg-surface-color
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
