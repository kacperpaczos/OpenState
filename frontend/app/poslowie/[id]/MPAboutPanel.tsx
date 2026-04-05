import { MP } from "@/lib/mps";
import { Mail, MapPin, Users, ExternalLink } from "lucide-react";

export default function MPAboutPanel({ mp }: { mp: MP }) {
    return (
        <div className="space-y-4">
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
                        <Users size={14} className="text-gray-500" />
                        <span className="text-gray-400">Klub / Koło:</span>
                        <span className="font-medium text-foreground">{mp.club || "Niezrzeszony"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-gray-400">Okręg:</span>
                        <span className="font-medium text-foreground">{mp.district}</span>
                    </div>
                </div>
            </div>

            {/* External link to Sejm */}
            <div className="glass-card p-4">
                <a
                    href={`https://sejm.gov.pl/Sejm10.nsf/posel.xsp?id=${mp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <ExternalLink size={14} />
                    Profil na sejm.gov.pl
                </a>
            </div>
        </div>
    );
}
