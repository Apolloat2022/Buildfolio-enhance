// components/CodeEditor.tsx
'use client'

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  height?: string;
}

export default function CodeEditor({ 
  initialCode = "// Start coding here...", 
  language = "typescript",
  height = "300px" 
}: CodeEditorProps) {
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden bg-gray-900">
      <div className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-mono">
        Editor ({language})
      </div>
      <textarea
        className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
        style={{ height }}
        defaultValue={initialCode}
        spellCheck="false"
      />
      <div className="px-4 py-2 bg-gray-800 text-gray-400 text-xs text-right">
        Live code editor preview
      </div>
    </div>
  );
}