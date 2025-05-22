import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

export const fountainHighlightStyle = HighlightStyle.define([
  // Title Page (meta.title-page.fountain)
  { tag: tags.keyword, color: "#FFD700" },
  // Scene Headings (keyword.scene-heading.fountain)
  { tag: tags.typeName, color: "#6CB6FF", fontWeight: "bold" },
  // Character Names (entity.name.character.fountain)
  { tag: tags.variableName, color: "#50fa7b", fontWeight: "bold" },
  // Parentheticals (comment.parenthetical.fountain) - parentheses and content
  {
    tag: [tags.comment, tags.punctuation],
    color: "#AAAAAA",
    fontStyle: "italic",
  },
  // Dialogue (string.dialogue.fountain)
  { tag: tags.string, color: "#FFA77A" },
  // Transitions (keyword.transition.fountain)
  { tag: tags.keyword, color: "#FFD700", textTransform: "uppercase" },
  // Centered Text (markup.centered.fountain)
  { tag: tags.meta, color: "#f1fa8c" },
  // Underline (markup.underline.fountain)
  { tag: tags.link, textDecoration: "underline" },
  // Bold (markup.bold.fountain)
  { tag: tags.strong, fontWeight: "bold" },
  // Italic (markup.italic.fountain)
  { tag: tags.emphasis, color: "#00E5FF", fontStyle: "italic" },
  // Notes (comment.note.fountain)
  { tag: tags.docComment, color: "#888888", fontStyle: "italic" },
  // Page Break (meta.page-break.fountain)
  { tag: tags.processingInstruction, color: "#666666" },
  { tag: tags.punctuation, color: "#FFD700" },
  // Ensure string is last for highest precedence
  { tag: tags.content, color: "#ffffff" },
]);
