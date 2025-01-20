import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import theme from './theme.json';
import Tabs from './components/Tabs';
import useStore from './store';

function App() {
  const { current, updateCode, updateOutput } = useStore();
  console.log('current', current);

  function runCode(code: string) {
    try {
      // Clear console output
      const consoleOutput: string[] = [];
      const originalConsoleLog = console.log;

      // Override console.log
      (console as any).log = (...args: any[]) => {
        consoleOutput.push(
          args
            .map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
            )
            .join(' '),
        );
      };

      // Execute the code
      const result = new Function(code)();

      // Restore console.log
      console.log = originalConsoleLog;

      // Set output
      const output =
        consoleOutput.join('\n') + (result !== undefined ? '\n' + result : '');
      updateOutput(current.id, output);
    } catch (error) {
      console.log('error', error);
      updateOutput(current.id, String(error));
    }
  }

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleEditorChange = useCallback(
    debounce((value: string | undefined) => {
      if (!value) return;
      updateCode(current.id, value);
      runCode(value);
    }, 500),
    [current.id],
  );

  return (
    <div className="min-h-screen bg-[#282a36] text-white">
      {/* Header */}
      <div className="h-12 border-b border-[#343642] select-none">
        <Tabs />
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-2 gap-0 h-[calc(100vh-3rem)] bg-[#282a36]">
        {/* Code Editor */}
        <div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={current.code}
            onChange={handleEditorChange}
            theme="default"
            options={{
              fontSize: 14,
              contextmenu: false,
              minimap: { enabled: false },
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
              },
              lineNumbers: 'on',
              renderLineHighlight: 'none',
              padding: { top: 16, bottom: 16 },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
            loading={null}
            beforeMount={monaco => {
              monaco.editor.defineTheme('default', {
                base: 'vs-dark',
                inherit: true,
                rules: theme.rules,
                colors: theme.colors,
              });
              monaco.editor.setTheme('default');
            }}
          />
        </div>

        {/* Output Panel */}
        <div className="bg-[#282a36] p-4">
          <div className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {current.output || 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
