import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-9 h-9 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={18} className="text-gray-700" />
            ) : (
                <Sun size={18} className="text-yellow-400" />
            )}
        </button>
    );
}