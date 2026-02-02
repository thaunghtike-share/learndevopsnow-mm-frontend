"use client";
import { useState, useRef, useEffect } from "react";
import { Code, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CodeBlockEditorProps {
  onCodeSubmit: (code: string, language: string) => void;
  onCancel: () => void;
}

export function CodeBlockEditor({ onCodeSubmit, onCancel }: CodeBlockEditorProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'text', label: 'Plain Text' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = () => {
    if (code.trim()) {
      onCodeSubmit(code, language);
      setCode("");
      setLanguage("javascript");
      setShowPreview(false);
    }
  };

  // Format the code for preview
  const getFormattedCode = () => {
    if (!code.trim()) return "";
    return `\`\`\`${language}\n${code}\n\`\`\``;
  };

  // Calculate number of lines for the code editor
  const lineCount = code.split('\n').length;
  const editorHeight = Math.max(48, Math.min(lineCount * 24, 300)); // Min 48px, max 300px

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Code Block
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          {code && (
            <button
              onClick={copyToClipboard}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-1"
              title="Copy code"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Code input section */}
      <div className="relative bg-gray-900">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-400 text-xs">
          <span>{language.toUpperCase()}</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs hover:text-gray-300"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        
        {!showPreview ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full font-mono text-sm p-4 bg-gray-900 text-gray-100 border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="Paste or type your code here..."
              spellCheck="false"
              style={{ height: `${editorHeight}px` }}
            />
          </div>
        ) : (
          <div 
            ref={previewRef}
            className="p-4 overflow-auto"
            style={{ height: `${editorHeight}px` }}
          >
            <div className="text-xs text-gray-400 mb-2">Preview:</div>
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap bg-gray-800 p-3 rounded">
              <code>{getFormattedCode()}</code>
            </pre>
            <div className="text-xs text-gray-500 mt-2">
              This is how your code will appear in the comment
            </div>
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 border-t border-gray-700">
        <div className="flex justify-between">
          <span>Lines: {lineCount}</span>
          <span>Characters: {code.length}</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {code.trim() ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Code ready to insert ({lineCount} lines, {code.length} chars)
              </span>
            ) : (
              "Enter your code above"
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!code.trim()}
              className="text-xs bg-green-600 hover:bg-green-700"
            >
              {code.trim() ? "✓ Insert Code" : "Insert Code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}