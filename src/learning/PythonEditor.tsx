import { useEffect, useRef } from 'react';
import { Annotation, Compartment, EditorState, Transaction } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { tags } from '@lezer/highlight';

const externalChange = Annotation.define<boolean>();
const pythonHighlight = HighlightStyle.define([
  { tag: tags.keyword, class: 'python-keyword' },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], class: 'python-function' },
  { tag: [tags.string, tags.special(tags.string)], class: 'python-string' },
  { tag: [tags.number, tags.bool, tags.null], class: 'python-literal' },
  { tag: tags.comment, class: 'python-comment' },
]);
const readOnlyMode = (value: boolean) => [
  EditorState.readOnly.of(value), EditorView.editable.of(!value),
  EditorView.contentAttributes.of({ 'aria-readonly': String(value), tabindex: '0' }),
];

export function PythonEditor({ id, label, value, readOnly, onChange }: {
  id: string; label: string; value: string; readOnly: boolean; onChange: (value: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const mode = useRef(new Compartment());
  const latest = useRef({ value, readOnly, onChange });
  latest.current = { value, readOnly, onChange };

  useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      doc: latest.current.value,
      parent: host.current,
      extensions: [
        python(), syntaxHighlighting(pythonHighlight), EditorView.lineWrapping, lineNumbers(),
        EditorState.tabSize.of(4), indentUnit.of('    '), indentOnInput(), bracketMatching(), history(),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        mode.current.of(readOnlyMode(latest.current.readOnly)),
        EditorView.contentAttributes.of({
          id, 'aria-label': label, 'aria-describedby': `${id}-keys`,
          spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off',
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !update.transactions.some((tr) => tr.annotation(externalChange))) {
            latest.current.onChange(update.state.doc.toString());
          }
        }),
      ],
    });
    view.current = editor;
    return () => { editor.destroy(); view.current = null; };
  }, [id, label]);

  useEffect(() => {
    const editor = view.current;
    if (!editor || editor.state.doc.toString() === value) return;
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: value },
      selection: { anchor: Math.min(editor.state.selection.main.head, value.length) },
      annotations: [externalChange.of(true), Transaction.addToHistory.of(false)],
    });
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: mode.current.reconfigure(readOnlyMode(readOnly)) });
  }, [readOnly]);

  return <>
    <div ref={host} className="python-editor" />
    <p id={`${id}-keys`} className="muted python-editor-keys">Tab indents. Shift+Tab outdents. Press Escape, then Tab to leave the editor.</p>
  </>;
}
