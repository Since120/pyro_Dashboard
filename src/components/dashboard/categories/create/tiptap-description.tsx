"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapDescriptionProps {
  content: string;
  onContentChange?: (markdown: string) => void;
}

export default function TiptapDescription({ content, onContentChange }: TiptapDescriptionProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      // Optional: Markdown konvertieren? 
      // Hier aber geben wir einfach den reinen Text oder 
      // ein vereinfachtes Format zurück.
      // Bei reiner Discord-Kompatibilität solltest du 
      // ggf. "editor.getJSON()" -> Markdown konvertieren.
      const text = editor.getText();
      onContentChange?.(text);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content);
  }, [content, editor]);

  return <EditorContent editor={editor} className="tiptap-editor" />;
}
