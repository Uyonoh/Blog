import hljs from "highlight.js/lib/core";

// Languages you care about
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";

// import java from 'highlight.js/lib/languages/java';
// import rust from 'highlight.js/lib/languages/rust';
// import yaml from 'highlight.js/lib/languages/yaml';

// Register them
hljs.registerLanguage("c", c);
hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", shell);

// hljs.registerLanguage('java', java);
// hljs.registerLanguage('rust', rust);
// hljs.registerLanguage('yaml', yaml);

export default hljs;
