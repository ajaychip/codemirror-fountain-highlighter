import { tags } from "@lezer/highlight";
import { StreamLanguage } from "@codemirror/language";

interface FountainState {
  format: string | null;
  inBlockComment: boolean;
  inLyrics: boolean;
  inCentered: boolean;
  inDualDialogue: boolean;
  lastElement: string | null;
}

export const fountain = () =>
  StreamLanguage.define<FountainState>({
    name: "fountain",
    startState: (): FountainState => ({
      format: null,
      inBlockComment: false,
      inLyrics: false,
      inCentered: false,
      inDualDialogue: false,
      lastElement: null,
    }),
    token(stream: any, state: FountainState): string | null {
      // Block comment (boneyard) stateful handling
      if (state.inBlockComment) {
        if (stream.skipTo("*/")) {
          stream.match("*/");
          state.inBlockComment = false;
        } else {
          stream.skipToEnd();
        }
        return "blockComment";
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
        return "blockComment";
      }

      // Notes ([[ and ]])
      if (stream.match(/^\[\[/)) {
        while (!stream.eol()) {
          if (stream.match(/\]\]/)) {
            return "docComment";
          }
          stream.next();
        }
        return "docComment";
      }

      // Centered text
      if (stream.match(/^>/)) {
        state.inCentered = true;
        return "meta";
      }
      if (state.inCentered && stream.match(/<$/)) {
        state.inCentered = false;
        return "meta";
      }
      if (state.inCentered) {
        stream.skipToEnd();
        return "meta";
      }

      // Lyrics
      if (stream.match(/^~/)) {
        state.inLyrics = true;
        stream.skipToEnd();
        return "string";
      }
      if (state.inLyrics) {
        stream.skipToEnd();
        return "string";
      }

      // Inline formatting (bold, italic, underline)
      if (!state.format) {
        if (stream.match("***")) {
          state.format = "strongEmphasis";
          return "strongEmphasis";
        }
        if (stream.match("**")) {
          state.format = "strong";
          return "strong";
        }
        if (stream.match("*")) {
          state.format = "emphasis";
          return "emphasis";
        }
        if (stream.match("_")) {
          state.format = "link";
          return "link";
        }
      }
      if (state.format) {
        if (state.format === "strongEmphasis" && stream.match("***")) {
          state.format = null;
          return "strongEmphasis";
        }
        if (state.format === "strong" && stream.match("**")) {
          state.format = null;
          return "strong";
        }
        if (state.format === "emphasis" && stream.match("*")) {
          state.format = null;
          return "emphasis";
        }
        if (state.format === "link" && stream.match("_")) {
          state.format = null;
          return "link";
        }
        if (stream.match(/[^*_]+/)) {
          return state.format;
        }
        stream.next();
        return state.format;
      }

      // Only check for line-based rules if not in a format block and no formatting marker was found
      if (stream.sol()) {
        // Title Page Key (including Notes:)
        const titlePageKey =
          /^(Title:|Author:|Credit:|Date:|Source:|Draft date:|Contact:|Copyright:|Notes:)/;
        if (stream.match(titlePageKey)) {
          state.lastElement = "titlePageKey";
          return "keyword";
        }
        // Indented value (3+ spaces or tab)
        if (stream.match(/^( {3,}|\t)/)) {
          stream.skipToEnd();
          return "string";
        }

        // Section (one or more # followed by space)
        if (stream.match(/^#+\s/)) {
          stream.skipToEnd();
          state.lastElement = "section";
          return "heading";
        }

        // Synopsis (=)
        if (stream.match(/^=/)) {
          stream.skipToEnd();
          state.lastElement = "synopsis";
          return "docComment";
        }

        // Page Break (===)
        if (stream.match(/^={3,}$/)) {
          state.lastElement = "pageBreak";
          return "processingInstruction";
        }

        // Scene Heading (INT., EXT., etc.)
        if (
          stream.match(/^(INT\.|EXT\.|INT\.\/EXT\.|INT\/EXT\.|I\/E\.|EST\.)/) ||
          stream.match(/^\.(?!\.)/)
        ) {
          stream.skipToEnd();
          state.lastElement = "sceneheading";
          return "typeName";
        }

        // Transition (ALL CAPS + ends with :)
        if (
          stream.match(/^[A-Z][A-Z ]+:$/) ||
          stream.match(/^>[A-Z][A-Z ]+:$/)
        ) {
          stream.skipToEnd();
          state.lastElement = "transition";
          return "keyword";
        }

        // Character Name (ALL CAPS, no punctuation, with or without parenthetical extension)
        if (
          stream.match(/^@?[A-Z][A-Z ]+$/) ||
          stream.match(/^@?[A-Z][A-Z ]+\([^)]+\)$/)
        ) {
          state.lastElement = "character";
          return "variableName";
        }

        // Dual Dialogue
        if (stream.match(/^[A-Z][A-Z ]+\s*\^$/)) {
          state.inDualDialogue = true;
          state.lastElement = "character";
          return "variableName";
        }

        // Forced Action
        if (stream.match(/^!/)) {
          stream.skipToEnd();
          state.lastElement = "action";
          return "content";
        }
      }

      // Dialogue after character or parenthetical
      if (
        state.lastElement === "character" ||
        state.lastElement === "parenthetical"
      ) {
        stream.skipToEnd();
        return "string";
      }

      // Action
      if (stream.match(/[^*_]+/)) {
        state.lastElement = "action";
        return "content";
      }

      // Value after title page key (on the same line)
      if (state.lastElement === "titlePageKey") {
        if (stream.eatSpace()) return null;
        stream.skipToEnd();
        state.lastElement = null;
        return "string";
      }

      stream.next();
      return "content";
    },
    languageData: {
      commentTokens: { line: ";" },
    },
  });
