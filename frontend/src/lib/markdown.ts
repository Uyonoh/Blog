import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import toc from "markdown-it-table-of-contents";
import hljs from "@/lib/hljs";

export const md = new MarkdownIt({
  html: false,        // security first
  linkify: true,
  typographer: true,
  breaks: false,     // important: newline policy
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (_) {}
    }
    return ""; // fallback = escaped by markdown-it
  },
});

// Stable heading IDs (SEO + links)
md.use(anchor, {
  slugify: (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^\w]+/g, "-"),
  permalink: anchor.permalink.headerLink(),
});

// Optional TOC
md.use(toc, {
  includeLevel: [2, 3],
});
