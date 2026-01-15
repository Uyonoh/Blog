"use client";

import { useEffect } from 'react';
import { Sun, Moon } from "lucide-react";
// import { setPrismTheme } from './SyntaxHighlighter';
import Prism from 'prismjs';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  // useEffect (() => {
  //   setPrismTheme(theme);
  //   console.log("Toggle: ", theme);
    
  //   Prism.highlightAll();;
  // }, [theme]);

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === "light" ? <Moon className="w-5 h-5 text-gray-800" fill='gray-800' /> : <Sun className="w-5 h-5 text-yellow-400" fill='yellow' />}
    </button>
  );
}
