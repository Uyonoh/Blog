"use client";

import { createContext, useContext, useState, useEffect } from 'react';

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

        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'prism-theme'

        // if (theme === 'dark') {
        // link.href = '/prism-themes/prism-tomorrow.css'
        // } else {
        // link.href = '/prism-themes/prism.css'
        // }

        document.head.appendChild(link)

        return () => {
        const existing = document.getElementById('prism-theme')
        if (existing) existing.remove()
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            document.documentElement.classList.remove(prevTheme);
            return prevTheme == "light" ? "dark" : "light"
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }} >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);