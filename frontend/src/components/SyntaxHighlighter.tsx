"use client";

import { useEffect } from "react";

function setHighlightTheme(mode: string | null) {
  const themeLink = document.getElementById("hljs-theme");
  if (!(themeLink instanceof HTMLLinkElement)) return;

  themeLink.href =
    mode === "dark"
      ? "/hljs-themes/github-dark.css"
      : "/hljs-themes/github.css";
}

type Props = {
  htmlContent: string;
};

export default function SyntaxHighlighter({ htmlContent }: Props) {
  useEffect(() => {
    setHighlightTheme(localStorage.getItem("theme"));
  }, []);

  return (
    <div
      className="
        markdown
        prose prose-lg max-w-none
        prose-gray dark:prose-invert
        transition-colors duration-300
        leading-relaxed
      "
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
