<script lang="ts" setup>
import { ref } from "vue";
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Strike from '@tiptap/extension-strike';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Underline from '@tiptap/extension-underline';

const props = defineProps(["component"]) as any;
const opened = ref({
  textSection: false,
  storeSection: false,
});

const editor = useEditor({
  extensions: [
    StarterKit,
    Bold.configure({
      HTMLAttributes: {
        class: 'custom-bold',
      },
    }),
    Italic.configure({
      HTMLAttributes: {
        class: 'custom-italic',
      },
    }),
    Strike.configure({
      HTMLAttributes: {
        class: 'custom-strike',
      },
    }),
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: 'custom-ordered-list',
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: 'custom-bullet-list',
      },
    }),
    Code.configure({
      HTMLAttributes: {
        class: 'custom-code',
      },
    }),
    CodeBlock.configure({
      HTMLAttributes: {
        class: 'custom-code-block',
      },
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: 'custom-blockquote',
      },
    }),
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'custom-horizontal-rule',
      },
    }),
    Underline.configure({
      HTMLAttributes: {
        class: 'custom-underline',
      },
    }),
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    props.component.editor = html;
  },
});
</script>

<template>
  <va-collapse v-model="opened.textSection" header="Rich text widget settings">
    <div class="settings-container">
      <div v-if="editor">
        <va-button class="editor-btn" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          bold
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
          italic
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
          strike
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleUnderline().run()" :disabled="!editor.can().chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
          underline
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
          code
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().unsetAllMarks().run()">
          clear marks
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().clearNodes().run()">
          clear nodes
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
          paragraph
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          h1
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          h4
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          h5
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          h6
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          bullet list
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
          ordered list
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
          code block
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
          blockquote
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().setHorizontalRule().run()">
          horizontal rule
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().setHardBreak().run()">
          hard break
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          undo
        </va-button>
        <va-button class="editor-btn" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          redo
        </va-button>
      </div> 
      <div class="editor">
        <editor-content :editor="editor" />
      </div>
    </div>
  </va-collapse>
  <va-collapse v-model="opened.storeSection" header="Store settings">
    <div class="settings-container">
      <div>
        <h3 class="mb-2">Select store</h3>
      </div>
    </div>
  </va-collapse>
</template>

<style lang="scss">
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
}

.editor {
  border: 1px solid rgb(168, 157, 157);
  height: 200px;
  padding: 10px;
  overflow: auto;
}

.custom-ordered-list {
  list-style: auto;
}

.custom-bullet-list {
  list-style: unset;
}

.tiptap h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tiptap h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.tiptap h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.tiptap h4{
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.tiptap h5 {
  font-size: 1.11rem;
  margin-bottom: 1rem;
}

.tiptap h6 {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.custom-bold {
  font-weight: bold;
}

.custom-italic {
  font-weight: unset;
}

.custom-strike {
  font-weight: unset;
}

.custom-code {
  font-size: 0.9rem;
  padding: 0.25em;
  border-radius: 0.25em;
  background-color: rgba(97, 97, 97, 0.2);
  color: #616161;
}

.custom-code-block {
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  
  code {
    color: inherit;
    padding: 0;
    background: none;
    font-size: 0.8rem;
  }
}

.custom-blockquote {
  padding-left: 1rem;
  border-left: 3px solid rgba(#0D0D0D, 0.1);
}

.custom-horizontal-rule {
  border-top: 1px solid #68CEF8;
}

.custom-underline {
  font-weight: unset;
}

.editor-btn {
  margin: 0 4px 4px 0;
  border: 2px solid transparent;
}

.is-active {
  border: 2px solid rgb(22, 253, 22) !important;
}

</style>
