import { MP } from "@/lib/mps";
import { Mail, MapPin, Users, ExternalLink, Calendar, BookOpen, Briefcase, Award } from "lucide-react";

export default function MPAboutPanel({ mp }: { mp: MP }) {
    const infoItems = [
        { icon: <Calendar size={14} />, label: "Data urodzenia", value: mp.birthDate },
        { icon: <BookOpen size={14} />, label: "Wykształcenie", value: mp.education },
        { icon: <Briefcase size={14} />, label: "Zawód", value: mp.profession },
        { icon: <Award size={14} />, label: "Liczba głosów", value: mp.numberOfVotes ? `${mp.numberOfVotes.toLocaleString()} (wybory)` : null },
    ];

    return (
        <div className="space-y-4">
            {/* Bio Info */}
            <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users size={16} className="text-accent-blue" /> Informacje o Parlamentarzyście
                </h3>
                <div className="space-y-4 text-sm">
                    {infoItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <span className="text-text-secondary">{item.icon}</span>
                            <span className="text-text-secondary min-w-[120px] font-semibold">{item.label}:</span>
                            <span className="font-bold text-foreground">
                                {item.value || <span className="text-gray-600 italic font-normal">Brak danych</span>}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact */}
            <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Mail size={16} className="text-accent-blue" /> Kontakt
                </h3>
                <div className="space-y-3 text-sm">
                    {mp.email ? (
                        <a
                            href={`mailto:${mp.email}`}
                            className="flex items-center gap-3 text-foreground hover:text-blue-400 transition-colors"
                        >
                            <Mail size={14} className="text-gray-500" />
                            {mp.email}
                        </a>
                    ) : (
                        <p className="text-gray-500">Brak adresu e-mail</p>
                    )}
                </div>
            </div>

            {/* Club & District */}
            <div className="glass-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users size={16} className="text-accent-blue" /> Przynależność
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <Users size={14} className="text-text-secondary" />
                        <span className="text-text-secondary min-w-[120px] font-semibold">Klub / Koło:</span>
                        <span className="font-bold text-foreground">{mp.club || "Niezrzeszony"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-text-secondary" />
                        <span className="text-text-secondary min-w-[120px] font-semibold">Okręg / Region:</span>
                        <span className="font-bold text-foreground">{mp.district || mp.voivodeship}</span>
                    </div>
                </div>
            </div>

            {/* External link to Official Profile */}
            <div className="glass-card p-4">
                <a
                    href={mp.chamber === 'Senat' 
                        ? (mp as any).detailUrl || "https://www.senat.gov.pl/sklad/senatorowie/"
                        : `https://sejm.gov.pl/Sejm10.nsf/posel.xsp?id=${mp.id}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <ExternalLink size={14} />
                    Profil na {mp.chamber === 'Senat' ? 'senat.gov.pl' : 'sejm.gov.pl'}
                </a>
            </div>
        </div>
    );
}
