import Link from "next/link";
import Hemicycle from "@/components/visual/Hemicycle";
import { getParliamentMembers } from "@/lib/data";
import HomeSearch from "@/components/HomeSearch";


export default async function Home() {
  const mps = await getParliamentMembers();

  return (
    <div className="flex flex-col items-center justify-center h-full pb-20 fade-in">
      {/* Visualization */}
      <div className="glass-card w-full max-w-4xl p-8 flex items-center justify-center mb-10">
        <Hemicycle mps={mps} />
      </div>

      {/* Search Section */}
      <HomeSearch />
    </div>
  );
}
