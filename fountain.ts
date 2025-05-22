import { tags } from "@lezer/highlight";
import { StreamLanguage } from "@codemirror/language";

interface FountainState {
  format: string | null;
  inBlockComment: boolean;
}

export const fountain = () =>
  StreamLanguage.define<FountainState>({
    name: "fountain",
    startState: (): FountainState => ({ format: null, inBlockComment: false }),
    token(stream: any, state: FountainState): string | null {
      // Block comment (boneyard) stateful handling
      if (state.inBlockComment) {
        if (stream.skipTo("*/")) {
          stream.match("*/");
          state.inBlockComment = false;
        } else {
          stream.skipToEnd();
        }
        return "comment";
      }

      // Start of block comment
      if (stream.match(/^\/\*/)) {
        state.inBlockComment = true;
        if (stream.skipTo("*/")) {
          stream.match("*/");
          state.inBlockComment = false;
        } else {
          stream.skipToEnd();
        }
        return "comment";
      }

      // Parenthetical (starts with ( and ends with ))
      if (stream.match(/^\([^)]+\)$/)) {
        stream.skipToEnd();
        return "comment";
      }
      // Notes ([[ and ]])
      if (stream.match(/^\[\[/)) {
        while (!stream.eol()) {
          if (stream.match(/\]\]/)) {
            return "comment";
          }
          stream.next();
        }
        return "comment";
      }

      // Always check for inline formatting markers first
      if (!state.format) {
        if (stream.match("***")) {
          state.format = "strong emphasis";
          return null;
        }
        if (stream.match("**")) {
          state.format = "strong";
          return null;
        }
        if (stream.match("*")) {
          state.format = "emphasis";
          return null;
        }
        if (stream.match("_")) {
          state.format = "link";
          return null;
        }
      }

      // End formatting if inside a format block
      if (state.format) {
        if (state.format === "strong emphasis" && stream.match("***")) {
          state.format = null;
          return null;
        }
        if (state.format === "strong" && stream.match("**")) {
          state.format = null;
          return null;
        }
        if (state.format === "emphasis" && stream.match("*")) {
          state.format = null;
          return null;
        }
        if (state.format === "link" && stream.match("_")) {
          state.format = null;
          return null;
        }
        if (stream.match(/[^*_]+/)) {
          return state.format;
        }
        stream.next();
        return state.format;
      }

      // Only check for line-based rules if not in a format block and no formatting marker was found
      if (stream.sol()) {
        // Title Page (Metadata)
        if (
          stream.match(
            /^(Title:|Author:|Credit:|Date:|Source:|Draft date:|Contact:|Copyright:)/
          )
        ) {
          stream.skipToEnd();
          return "keyword";
        }
        // Section (one or more # followed by space)
        if (stream.match(/^#+\s/)) {
          stream.skipToEnd();
          return "heading";
        }
        // Synopsis (=)
        if (stream.match(/^=/)) {
          stream.skipToEnd();
          return "comment";
        }
        // Scene Heading (INT., EXT., etc.)
        if (stream.match(/^(INT\.|EXT\.|INT\.\/EXT\.|EST\.)/)) {
          stream.skipToEnd();
          return "typeName";
        }
        // Transition (ALL CAPS + ends with :)
        if (stream.match(/^[A-Z][A-Z ]+$/) && stream.current().length > 1) {
          stream.skipToEnd();
          return "keyword";
        }
        // Character Name (ALL CAPS, no punctuation)
        if (stream.match(/^[A-Z][A-Z ]+$/) && stream.current().length > 1) {
          stream.skipToEnd();
          return "variableName";
        }
      }

      // Handle plain text
      if (stream.match(/[^*_]+/)) {
        return "string";
      }
      stream.next();
      return "string";
    },
    languageData: {
      commentTokens: { line: ";" },
    },
  });
