import React from 'react';
import { Search, ArrowUpRight, Play, BookOpen, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getProcessStats, getVotingStats, getParliamentStats } from '@/lib/stats';

export default async function HomePage() {
  // Fetch real data
  const processStats = await getProcessStats();
  const votingStats = await getVotingStats();
  const parliamentStats = await getParliamentStats();

  return (
    <div className="min-h-screen text-foreground font-sans p-4 md:p-8 flex flex-col items-center">

      {/* Main Hero + Quick Links */}
      <div className="w-full max-w-2xl mb-16 text-center space-y-8 mt-8">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Śledź polski proces legislacyjny
        </h1>
        <p className="text-text-secondary text-lg">Przejrzyste dane o ustawach, głosowaniach i parlamentarzystach.</p>
        <div className="flex justify-center gap-3 text-sm text-text-secondary">
          <Link href="/ustawy" className="bg-apple-gray-100 dark:bg-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-apple-gray-200 dark:hover:bg-white/15 transition text-foreground font-medium">📝 Ostatnie ustawy</Link>
          <Link href="/glosowania" className="bg-apple-gray-100 dark:bg-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-apple-gray-200 dark:hover:bg-white/15 transition text-foreground font-medium">🗳️ Wyniki głosowań</Link>
          <Link href="/poslowie" className="bg-apple-gray-100 dark:bg-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-apple-gray-200 dark:hover:bg-white/15 transition text-foreground font-medium">👤 Znajdź posła</Link>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[600px]">

        {/* Large Feature / Hero Block */}
        <Link href="/harmonogram" className="col-span-1 md:col-span-2 md:row-span-2 glass-card !p-8 relative overflow-hidden group hover:border-accent-blue/30 transition-colors cursor-pointer">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Harmonogram Legislacyjny</h2>
              <p className="text-gray-500 dark:text-gray-400">Śledź projekty ustaw na każdym etapie procesu legislacyjnego.</p>

              {/* Real Stats */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                  {processStats.inProgress} w toku
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {processStats.completed} zakończonych
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-medium">Zobacz harmonogram</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          {/* Abstract visual */}
          <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
        </Link>

        {/* Top Right - Status */}
        <Link href="/harmonogram" className="md:col-span-2 glass-card !p-6 flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer">
          <div>
            <h3 className="font-semibold text-lg">Harmonogram</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Proces legislacyjny w czasie rzeczywistym</p>
          </div>
          <div className="bg-white dark:bg-black p-3 rounded-full">
            <Calendar className="w-5 h-5" />
          </div>
        </Link>

        {/* Mid Left - Process */}
        <Link href="/ustawy" className="glass-card !p-6 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <BookOpen className="w-6 h-6 text-purple-500" />
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md">{processStats.total} aktywnych</span>
          </div>
          <h3 className="font-semibold text-lg mb-1">Projekty Ustaw</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Przeglądaj aktualne projekty</p>
        </Link>

        {/* Mid Right - Stats */}
        <Link href="/poslowie" className="glass-card !p-6 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <UsersIcon className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Parlamentarzyści</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{parliamentStats.totalMPs} posłów • {parliamentStats.totalSenators} senatorów</p>
        </Link>

        {/* Bottom Wide - Quick Actions */}
        <Link href="/glosowania" className="md:col-span-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-[32px] p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden hover:scale-[1.005] transition-transform cursor-pointer">
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Play className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Głosowania Sejmu</h3>
              <p className="text-gray-300 text-sm">
                {votingStats.latestSitting
                  ? `Ostatnie: Posiedzenie #${votingStats.latestSitting.sitting} • ${votingStats.totalSittings} posiedzeń`
                  : 'Zobacz wyniki głosowań i frekwencję posłów'}
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 md:mt-0 bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors">
            Przeglądaj
          </div>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </Link>

      </div>

      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>OpenOurGov 2026 • Otwarte Dane Parlamentarne</p>
      </div>

    </div>
  );
}

// Users Icon component
function UsersIcon(props: any) {
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
