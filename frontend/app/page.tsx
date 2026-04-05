import React from 'react';
import { ArrowUpRight, BookOpen, BarChart3, Users, Calendar, GitCompare, Vote } from 'lucide-react';
import Link from 'next/link';
import { getProcessStats, getVotingStats, getParliamentStats } from '@/lib/stats';

export default async function HomePage() {
  const [processStats, votingStats, parliamentStats] = await Promise.all([
    getProcessStats(),
    getVotingStats(),
    getParliamentStats(),
  ]);

  return (
    <div className="min-h-screen text-foreground font-sans flex flex-col items-center px-4 md:px-8 pb-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl text-center pt-16 pb-12 space-y-5">
        <div className="inline-block bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20 mb-2">
          JasnaSprawa.pl
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          Przeźroczysty<br />
          <span className="text-gradient">parlament polski</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-lg mx-auto">
          Ustawy, głosowania i parlamentarzyści — w jednym miejscu.
        </p>

        {/* Quick-entry pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Link href="/poslowie" className="quick-pill">👤 Posłowie</Link>
          <Link href="/senatorowie" className="quick-pill">🏛 Senatorowie</Link>
          <Link href="/glosowania" className="quick-pill">🗳️ Głosowania</Link>
          <Link href="/ustawy" className="quick-pill">📝 Ustawy</Link>
          <Link href="/porownaj" className="quick-pill">⚖️ Porównaj posłów</Link>
          <Link href="/interpelacje" className="quick-pill">💬 Interpelacje</Link>
        </div>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────────── */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-6 auto-rows-[160px] gap-4">

        {/* 1 — Posłowie (2×2) */}
        <Link href="/poslowie"
          className="md:col-span-2 md:row-span-2 glass-card !p-7 relative overflow-hidden group hover:border-accent-blue/40 transition-colors flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 text-green-400">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Posłowie</h2>
            <p className="text-gray-500 text-sm">Profile, głosowania i statystyki aktywności</p>
            <div className="mt-4 flex gap-3 text-sm">
              <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-medium">{parliamentStats.totalMPs} posłów</span>
              <span className="bg-surface-color text-gray-500 px-3 py-1 rounded-full">{parliamentStats.totalSenators} senatorów</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-foreground transition-colors">
            Przeglądaj <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors" />
        </Link>

        {/* 2 — Głosowania (2×1) */}
        <Link href="/glosowania"
          className="md:col-span-2 glass-card !p-6 flex items-center gap-4 hover:border-purple-500/30 transition-colors group">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 shrink-0">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">Głosowania</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {votingStats.latestSitting
                ? `${votingStats.totalSittings} posiedze\u0144 \u00b7 ostatnie: pos. ${votingStats.latestSitting.sitting}`
                : 'Wyniki g\u0142osowa\u0144 Sejmu'}
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto text-gray-500 group-hover:text-foreground transition-colors" />
        </Link>

        {/* 3 — Ustawy (2×1) */}
        <Link href="/ustawy"
          className="md:col-span-2 glass-card !p-6 flex items-center gap-4 hover:border-blue-500/30 transition-colors group">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">Projekty Ustaw</h3>
            <p className="text-gray-500 text-xs mt-0.5">{processStats.inProgress} w toku · {processStats.completed} zakończonych</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto text-gray-500 group-hover:text-foreground transition-colors" />
        </Link>

        {/* 4 — Interpelacje (1×1) */}
        <Link href="/interpelacje"
          className="md:col-span-2 glass-card !p-6 flex flex-col justify-between hover:border-yellow-500/30 transition-colors group">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Interpelacje</h3>
            <p className="text-gray-500 text-xs">Zapytania posłów do rządu</p>
          </div>
        </Link>

        {/* 5 — Porównaj (2×1) wide */}
        <Link href="/porownaj"
          className="md:col-span-4 bg-gradient-to-r from-indigo-950/80 to-blue-950/80 border border-indigo-500/20 rounded-[24px] !p-6 flex items-center gap-5 hover:border-indigo-500/40 transition-colors group relative overflow-hidden">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-300 shrink-0">
            <GitCompare className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-white">Porównaj Posłów</h3>
            <p className="text-indigo-300 text-xs mt-0.5">
              Sprawdź jak często dwóch posłów głosowało tak samo — oblicz % zgodności
            </p>
          </div>
          <span className="shrink-0 bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-indigo-400 transition-colors">
            Nowe →
          </span>
          <div className="absolute right-[-40px] top-[-40px] w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
        </Link>

        {/* 6 — Harmonogram (2×1) */}
        <Link href="/harmonogram"
          className="md:col-span-2 glass-card !p-6 flex items-center gap-4 hover:border-orange-500/30 transition-colors group">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">Harmonogram</h3>
            <p className="text-gray-500 text-xs mt-0.5">Etapy procesu legislacyjnego</p>
          </div>
          <ArrowUpRight className="w-4 h-4 ml-auto text-gray-500 group-hover:text-foreground transition-colors" />
        </Link>

      </div>

      <p className="mt-12 text-center text-gray-600 text-xs">
        JasnaSprawa.pl · Otwarte Dane Parlamentarne · X kadencja Sejmu
      </p>

    </div>
  );
}
