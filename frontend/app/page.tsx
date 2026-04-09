import React from 'react';
import { 
    ArrowUpRight, 
    BookOpen, 
    BarChart3, 
    Users, 
    Calendar, 
    Activity, 
    Vote, 
    Shield, 
    Leaf, 
    TrendingUp, 
    CircleDollarSign,
    Scale
} from 'lucide-react';
import Link from 'next/link';
import { getProcessStats, getVotingStats, getParliamentStats } from '@/lib/stats';
import { BUDGET_DATA as BUDGET } from '@/lib/budget';

export default async function HomePage() {
  const [processStats, votingStats, parliamentStats] = await Promise.all([
    getProcessStats(),
    getVotingStats(),
    getParliamentStats(),
  ]);

  const currentBudget = BUDGET[0];

  return (
    <div className="min-h-screen text-foreground font-sans flex flex-col items-center pb-24">
      {/* ── 1. Hero: Puls Państwa ─────────────────────────────────────────── */}
      <section className="w-full max-w-6xl px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-blue-500/20">
              <Activity size={12} className="animate-pulse" /> Live: Puls Parlamentu
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
                Przejrzyste państwo <br/>
                <span className="text-blue-600 dark:text-blue-500">w Twoich rękach.</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
                Monitoruj wydatki budżetowe, śledź procesy legislacyjne i rozliczaj swoich przedstawicieli w Sejmie i Senacie.
            </p>
          </div>
          
          <div className="hidden lg:block w-px h-32 bg-gray-200 dark:bg-white/10 mx-8" />
          
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="glass-card !p-5 min-w-[160px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Posłowie i Senatorowie</p>
                <p className="text-2xl font-black">{parliamentStats.total}</p>
                <p className="text-[10px] text-green-600 font-bold mt-1">X Kadencja Sejmu</p>
            </div>
            <div className="glass-card !p-5 min-w-[160px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ustawy w toku</p>
                <p className="text-2xl font-black">{processStats.inProgress}</p>
                <div className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(processStats.inProgress / processStats.total) * 100}%` }} 
                    />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Top Dashboard: Budżet & Głosowania ─────────────────────────── */}
      <section className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Widget Budżety (8 col) */}
        <Link href="/budzet" 
            className="md:col-span-12 lg:col-span-8 glass-card !p-0 overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="p-8 flex flex-col md:flex-row justify-between h-full">
                <div className="max-w-md">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                        <CircleDollarSign size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Budżet Państwa {currentBudget.year}</span>
                    </div>
                    <h2 className="text-3xl font-black mb-2">Gdzie trafiają Twoje podatki?</h2>
                    <p className="text-sm text-gray-500 font-medium mb-6">
                        Analiza wydatków na poziomie {currentBudget.expenditure} mld PLN. Zobacz, jak finansowane są kluczowe sektory gospodarki.
                    </p>
                    <div className="flex gap-4">
                        {currentBudget.categories.slice(0, 3).map(cat => (
                            <div key={cat.id} className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{cat.label}</span>
                                <span className="text-sm font-black">{cat.amount} mld</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8 md:mt-0 flex flex-col justify-end items-end">
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-bold text-sm group-hover:scale-105 transition-transform">
                        Otwórz analizę →
                    </button>
                </div>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/5 flex">
                {currentBudget.categories.map(cat => (
                    <div 
                        key={cat.id} 
                        style={{ width: `${(cat.amount / currentBudget.expenditure) * 100}%`, backgroundColor: cat.color }} 
                        className="h-full"
                    />
                ))}
            </div>
        </Link>

        {/* Widget Aktywność (4 col) */}
        <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
            <Link href="/glosowania" className="glass-card !p-6 flex-1 hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                        <Vote size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <h3 className="font-bold">Ostatnie głosowania</h3>
                <p className="text-xs text-gray-500 mt-1">
                    {votingStats.latestSitting ? `Posiedzenie nr ${votingStats.latestSitting.sitting}` : 'Śledź decyzje Sejmu'}
                </p>
            </Link> 
            <Link href="/porownaj" className="glass-card !p-6 flex-1 hover:border-indigo-500/30 transition-all group bg-gradient-to-br from-indigo-500/5 to-transparent">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
                        <Scale size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="font-bold">Porównaj Posłów</h3>
                <p className="text-xs text-gray-500 mt-1">Sprawdź zgodność w głosowaniach</p>
            </Link>
        </div>
      </section>

      {/* ── 3. Składki / Kategorie Specjalne ──────────────────────────────── */}
      <section className="w-full max-w-6xl px-6 mt-16">
        <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black tracking-tight">Kluczowe Obszary Legislacji</h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card !p-6 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Shield className="text-green-600 mb-4" size={24} />
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Bezpieczeństwo</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Ustawy o modernizacji armii, obronności i funduszach celowych na wojsko.</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-black uppercase text-blue-500">
                    Zobacz projekty <ArrowUpRight size={12} />
                </div>
            </div>

            <div className="glass-card !p-6 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <TrendingUp className="text-blue-600 mb-4" size={24} />
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Ekonomia</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Reformy podatkowe, prawo przedsiębiorców i zmiany w kodeksie pracy.</p>
                 <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-black uppercase text-blue-500">
                    Zobacz projekty <ArrowUpRight size={12} />
                </div>
            </div>

            <div className="glass-card !p-6 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Leaf className="text-teal-600 mb-4" size={24} />
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Energia & Klimat</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Transformacja energetyczna, OZE, energetyka jądrowa i ochrona środowiska.</p>
                 <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-black uppercase text-blue-500">
                    Zobacz projekty <ArrowUpRight size={12} />
                </div>
            </div>

            <div className="glass-card !p-6 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Activity className="text-red-500 mb-4" size={24} />
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Ochrona Zdrowia</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Finansowanie NFZ, ustawy o zawodach medycznych i restrukturyzacja szpitali.</p>
                 <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-black uppercase text-blue-500">
                    Zobacz projekty <ArrowUpRight size={12} />
                </div>
            </div>
        </div>
      </section>

      {/* ── 4. Linki do Posłów/Senatorów ─────────────────────────────────── */}
      <section className="w-full max-w-6xl px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/poslowie" className="glass-card !p-8 flex items-center gap-6 group hover:translate-y-[-4px] transition-all bg-stone-100/50 dark:bg-white/5 border-none">
            <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white shadow-xl">
                <Users size={32} />
            </div>
            <div>
                <h3 className="text-xl font-black">Baza Posłów</h3>
                <p className="text-sm text-gray-500 font-medium">460 przedstawicieli Twojego regionu</p>
            </div>
            <ArrowUpRight size={20} className="ml-auto text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </Link>
        <Link href="/senatorowie" className="glass-card !p-8 flex items-center gap-6 group hover:translate-y-[-4px] transition-all bg-stone-100/50 dark:bg-white/5 border-none">
            <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white shadow-xl">
                <BookOpen size={32} />
            </div>
            <div>
                <h3 className="text-xl font-black">Izba Wyższa</h3>
                <p className="text-sm text-gray-500 font-medium">100 Senatorów RP</p>
            </div>
            <ArrowUpRight size={20} className="ml-auto text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </Link>
      </section>

      <footer className="mt-24 px-6 text-center">
         <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            OpenState · Transparentność Ponad Wszystko · Projekt Obywatelski
         </p>
      </footer>
    </div>
  );
}

