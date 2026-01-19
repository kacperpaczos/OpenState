"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Check initial preference
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
            localStorage.theme = 'light';
            document.documentElement.classList.remove('dark');
            // Hack to change Next.js app bg
            document.documentElement.style.setProperty('--bg-color', '#ffffff');
            document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
            document.documentElement.style.setProperty('--surface-color', 'rgba(0, 0, 0, 0.05)');
        } else {
            setTheme('dark');
            localStorage.theme = 'dark';
            document.documentElement.classList.add('dark');
            document.documentElement.style.setProperty('--bg-color', '#050505');
            document.documentElement.style.setProperty('--text-primary', '#f0f0f0');
            document.documentElement.style.setProperty('--surface-color', 'rgba(255, 255, 255, 0.05)');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
