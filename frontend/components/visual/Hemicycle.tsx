"use client";

import React, { useMemo } from 'react';
import type { MP } from '@/lib/data';

interface HemicycleProps {
    mps: MP[];
}

export default function Hemicycle({ mps }: HemicycleProps) {
    // Color map
    const partyColors: Record<string, string> = {
        "PiS": "#1E40AF",
        "KO": "#F97316",
        "TD": "#EAB308",
        "Lewica": "#DC2626",
        "Konfederacja": "#1F2937",
        "Niezrzeszeni": "#9CA3AF"
    };

    // Pre-calculate positions to avoid re-calc on every render
    const seats = useMemo(() => {
        // Use simple string comparison instead of localeCompare to avoid server/client locale mismatch
        const sortedMps = [...mps].sort((a, b) => {
            if (a.party < b.party) return -1;
            if (a.party > b.party) return 1;
            return 0;
        });

        // We only take the first 460 MPs (exclude senators)
        const sejmMembers = sortedMps.filter(m => m.type === 'Poseł').slice(0, 460);

        const rows = 12;
        const radiusStep = 24;
        const startRadius = 60;

        let seatIndex = 0;
        const calculatedSeats = [];

        for (let r = 0; r < rows; r++) {
            const radius = startRadius + (r * radiusStep);
            const arcLength = Math.PI * radius;
            const dotsInRow = Math.floor(arcLength / 12);

            for (let d = 0; d < dotsInRow; d++) {
                if (seatIndex >= sejmMembers.length) break;

                // angle from PI (left) to 0 (right)
                const theta = Math.PI - (Math.PI * (d / (dotsInRow - 1)));

                // Center coords (assuming 600x300 container)
                const cx = 300;
                const cy = 300;

                // Adjust geometry
                const x = cx + radius * Math.cos(theta);
                const y = cy - radius * Math.sin(theta) - 20;

                const mp = sejmMembers[seatIndex];
                const color = partyColors[mp.party] || "#555";

                calculatedSeats.push({ x, y, color, mp });
                seatIndex++;
            }
        }
        return calculatedSeats;
    }, [mps]);

    return (
        <div className="relative w-[600px] h-[320px] mx-auto scale-75 lg:scale-100 origin-top">
            {seats.map((seat, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full cursor-pointer hover:scale-[2] hover:shadow-[0_0_10px_currentColor] transition-all duration-200 z-10"
                    style={{
                        left: `${seat.x.toFixed(2)}px`,
                        top: `${seat.y.toFixed(2)}px`,
                        backgroundColor: seat.color,
                        boxShadow: `0 1px 2px rgba(0,0,0,0.3)`
                    }}
                    title={`${seat.mp.name} (${seat.mp.party})`}
                />
            ))}

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-4">
                <h3 className="text-4xl font-bold text-gradient">460</h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Posłów</span>
            </div>
        </div>
    );
}
