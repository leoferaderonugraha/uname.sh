import { useState, useEffect, useRef, useCallback } from 'react';
import * as commands from '@/lib/commands';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'output-html' | 'error';
  content: string;
  timestamp: Date;
}

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 0,
      type: 'output',
      content: 'Welcome to Terminal Emulator v1.0.0',
      timestamp: new Date(),
    },
    {
      id: 1,
      type: 'output',
      content: 'Type "help" for available commands.',
      timestamp: new Date(),
    },
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);
  
  useEffect(() => {
    // Focus input on mount and clicks
    const handleClick = () => {
      inputRef.current?.focus();
    };
    
    document.addEventListener('click', handleClick);
    inputRef.current?.focus();
    
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const executeCommand = useCallback((command: string) => {
    const cmd = command.trim().toLowerCase();
    let output = '';
    let type: 'output' | 'output-html' | 'error' = 'output';

    switch (cmd) {
      case '':
        return; // Don't add empty commands
      case 'help':
        output = commands.help();
        break;
      case 'clear':
        setLines([]);
        return;
      case 'whoami':
        output = commands.whoami();
        break;
      case 'date':
        output = commands.date();
        break;
      case 'history':
        output = commands.history(commandHistory);
        break;
      case 'contacts':
        output = commands.contacts();
        type = 'output-html';
        break;
      default:
        if (cmd.startsWith('uname')) {
          const options = cmd.split(' ');
          const [unameOutput, unameType] = commands.uname(options[1]);
          output = unameOutput;
          type = unameType as 'output' | 'error';
        } else {
          output = `Command not found: ${command}. Type "help" for available commands.`;
          type = 'error';
        }
    }

    const newId = Date.now();
    setLines(prev => [
      ...prev,
      {
        id: newId,
        type: 'input',
        content: `$ ${command}`,
        timestamp: new Date(),
      },
      {
        id: newId + 1,
        type,
        content: output,
        timestamp: new Date(),
      },
    ]);
  }, [commandHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      executeCommand(currentInput);
    }
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple auto-completion for common commands
      const commands = [
        'help',
        'clear',
        'whoami',
        'date',
        'echo',
        'history',
        'uname',
        'contacts'
      ];
      const matches = commands.filter(cmd => cmd.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index}>{line}</div>
    ));
  };

  const unsafeFormatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} dangerouslySetInnerHTML={{__html: line}}></div>
    ));
  };

  return (
    <div className="h-screen w-screen bg-terminal-bg text-terminal-text font-mono text-sm overflow-hidden flex flex-col">
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${
              line.type === 'input' 
                ? 'text-terminal-prompt' 
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-terminal-text'
            } whitespace-pre-wrap`}
            style={{ animation: 'fadeIn 0.3s ease-in' }}
          >
            {line.type === 'output-html' ? unsafeFormatContent(line.content) : formatContent(line.content)}
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-terminal-prompt mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-terminal-text flex-1 font-mono"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          {/* <span className="terminal-cursor ml-1"></span> */}
        </form>
      </div>
    </div>
  );
};

export default Terminal;
