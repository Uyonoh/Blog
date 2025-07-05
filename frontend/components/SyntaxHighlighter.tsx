// components/SyntaxHighlighter.js
import React, { useEffect } from 'react';
import Prism from 'prismjs';

// Import Prism.js CSS theme (choose one you like)
// You might want to import this globally in _app.js or layout.js for consistency
// import 'prismjs/themes/prism-tomorrow.css'; // Example: a dark theme
// import 'prismjs/themes/prism.css'; // Example: a light theme

// Import individual language syntaxes you need
// Make sure to import only what you use to keep bundle size small
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-bash';
// import 'prismjs/components/prism-markup'; // For HTML, XML, etc.
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-json';

export const loadPrismTheme = async () => {
  const isDark = localStorage.getItem('theme') === 'dark' ? true : false;
  console.log("Dark: ", isDark);
  if (isDark) {
    await import('prismjs/themes/prism-tomorrow.css');
  } else {
    await import('prismjs/themes/prism.css');
  }
}

function setPrismTheme(mode: string | null) {
  const themeLink = document.getElementById('prism-theme');
  console.log(themeLink);
  if (!themeLink) return;

  if (themeLink instanceof HTMLLinkElement){
    if (mode === 'dark') {
      themeLink.href = '/themes/prism-tomorrow.css';
    } else {
      themeLink.href = '/themes/prism.css';
    }
  }
}

const SyntaxHighlighter = ({ htmlContent, mode }: { htmlContent:string, mode:string|null }) => {
  // const mode = localStorage.getItem('theme');
  useEffect(() => {
    // Highlight all code blocks after the component mounts and content is rendered
    // loadPrismTheme().then(() => {
    //   Prism.highlightAll();
    // });
    setPrismTheme(mode);
    Prism.highlightAll();
  }, [htmlContent, mode]); // Re-run effect if htmlContent changes

  return (
    <div
      className="prose prose-lg max-w-none prose-gray  dark:prose-invert leading-relaxed"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default SyntaxHighlighter;
