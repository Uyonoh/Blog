import markdown
from markdown.preprocessors import Preprocessor
from markdown.extensions import Extension
import re

# Custom preprocessor class
class NewlineToEmptyParagraphPreprocessor(Preprocessor):
    def run(self, lines):
        # Join lines to process the text
        text = "\n".join(lines)
        # Replace each newline character with an empty paragraph
        # We use regex to replace single newlines with <p></p>
        transformed_text = re.sub(r'\\n', '<p></p>\n', text)
        # Return transformed text as a list of lines
        return transformed_text.splitlines()

# Extension class
class NewlineToEmptyParagraphExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(NewlineToEmptyParagraphPreprocessor(md), 'newline_to_empty_paragraph', 25)

# Custom preprocessor class
class EscapedNewLinePreprocessor(Preprocessor):
    def run(self, lines):
        # Join lines to process the text
        text = "\n".join(lines)
        # Replace each newline character with an empty paragraph
        # We use regex to replace single newlines with <p></p>
        transformed_text = re.sub(r'\n\n', '<br />\n', text)
        # Return transformed text as a list of lines
        return transformed_text.split('\n')

# Extension class
class EscapedNewLineExtension(Extension):
    def extendMarkdown(self, md):
        md.preprocessors.register(EscapedNewLinePreprocessor(md), '2nl2br', 25)
