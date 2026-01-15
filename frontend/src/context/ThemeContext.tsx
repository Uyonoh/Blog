"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { setHighlightTheme } from '@/components/SyntaxHighlighter';

type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme;
        if (storedTheme) setTheme(storedTheme);

        // const link = document.createElement('link')
        // link.rel = 'stylesheet'
        // link.id = 'hljs-theme'

        // if (theme === 'dark') {
        // link.href = "/hljs-themes/monokai.css"
        // } else {
        // link.href = "/hljs-themes/xcode.css"
        // }

        // document.head.appendChild(link)

        // return () => {
        // const existing = document.getElementById('hljs-theme')
        // if (existing) existing.remove()
        // }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            document.documentElement.classList.remove(prevTheme);
            const newTheme = prevTheme == "light" ? "dark" : "light"
            setHighlightTheme(newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }} >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);