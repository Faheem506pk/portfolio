"use client"

import { useEffect } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Markdown } from "@tiptap/markdown"
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react"

function ToolbarButton({ label, onClick, active = false, disabled = false, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`rich-tool ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  )
}

// Visual editor built on Tiptap (open source, MIT). The story is stored as Markdown, so the public blog,
// the Markdown view and the copy-to-Medium button keep working. Pasting from Medium keeps headings, lists and links.
export function RichEditor({ value = "", onChange, placeholder = "Tell your story…" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
      Placeholder.configure({ placeholder }),
      Markdown,
    ],
    content: value,
    contentType: "markdown",
    // Next.js renders on the server first; this avoids a hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "rich-surface", "aria-label": "Story text", spellcheck: "true" },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getMarkdown()),
  })

  const liveState = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            quote: editor.isActive("blockquote"),
            bullets: editor.isActive("bulletList"),
            numbers: editor.isActive("orderedList"),
            code: editor.isActive("codeBlock"),
            link: editor.isActive("link"),
            canUndo: editor.can().undo(),
            canRedo: editor.can().redo(),
          }
        : null,
  })

  useEffect(() => () => editor?.destroy(), [editor])

  if (!editor) {
    return <div className="rich-editor rich-loading" aria-busy="true" />
  }

  // The selector can be null until the first transaction; treat that as "nothing active".
  const state = liveState ?? {
    bold: false, italic: false, underline: false, strike: false, h2: false, h3: false, quote: false,
    bullets: false, numbers: false, code: false, link: false, canUndo: false, canRedo: false,
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href || ""
    const url = window.prompt("Link address", previous)
    if (url === null) return
    if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run()
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("Image address (https://…)")
    if (!url) return
    const alt = window.prompt("Alt text (describe the image)") || ""
    editor.chain().focus().setImage({ src: url, alt }).run()
  }

  const chain = () => editor.chain().focus()

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label="Formatting">
        <ToolbarButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>
        <span className="rich-sep" aria-hidden="true" />
        <ToolbarButton label="Heading" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Subheading" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Bulleted list" active={state.bullets} onClick={() => chain().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={state.numbers} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Code block" active={state.code} onClick={() => chain().toggleCodeBlock().run()}>
          <Code2 size={16} />
        </ToolbarButton>
        <span className="rich-sep" aria-hidden="true" />
        <ToolbarButton label="Link" active={state.link} onClick={setLink}>
          <Link2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Image" onClick={addImage}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Divider" onClick={() => chain().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
        <span className="rich-sep" aria-hidden="true" />
        <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
