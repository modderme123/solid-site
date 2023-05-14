import CompilerWorker from 'solid-repl/lib/compiler?worker';
import FormatterWorker from 'solid-repl/lib/formatter?worker';
import LinterWorker from 'solid-repl/lib/linter?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import onigasm from 'onigasm/lib/onigasm.wasm?url';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

window.MonacoEnvironment = {
  getWorker: function (_moduleId: unknown, label: string) {
    switch (label) {
      case 'css':
        return new cssWorker();
      case 'typescript':
      case 'javascript':
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
  onigasm,
};

export const compiler = new CompilerWorker();
export const formatter = new FormatterWorker();
export const linter = new LinterWorker();
