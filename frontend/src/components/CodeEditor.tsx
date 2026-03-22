import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  height?: string;
  disabled?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  height = '400px',
  disabled = false,
}: CodeEditorProps) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <Editor
        height={height}
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
          readOnly: disabled,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          tabSize: 4,
          insertSpaces: true,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}
