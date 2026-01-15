import hljs from "highlight.js/lib/core";

// Languages you care about
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";

// Register them
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("c", c);

export default hljs;
