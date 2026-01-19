import React from 'react';
import { AbsoluteFill } from 'remotion';

interface CodeEditorProps {
    code: string;
    highlightedLines?: number[];
    showCursor?: boolean;
    cursorPosition?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    highlightedLines = [],
    showCursor = false,
    cursorPosition = 0
}) => {
    const lines = code.split('\n');

    // Syntax highlighting helper
    const highlightSyntax = (line: string) => {
        // Simple JSX/React syntax highlighting
        let highlighted = line;

        // Keywords (blue)
        highlighted = highlighted.replace(
            /\b(import|export|const|let|var|function|return|from|as)\b/g,
            '<span style="color: #569cd6">$1</span>'
        );

        // Strings (green)
        highlighted = highlighted.replace(
            /(["'])(?:(?=(\\?))\2.)*?\1/g,
            '<span style="color: #ce9178">$&</span>'
        );

        // JSX tags (cyan)
        highlighted = highlighted.replace(
            /&lt;(\/?[A-Za-z][A-Za-z0-9]*)/g,
            '<span style="color: #4ec9b0">&lt;$1</span>'
        );

        // Props/attributes (lightblue)
        highlighted = highlighted.replace(
            /\s([a-zA-Z][a-zA-Z0-9]*(?:InFrames|Src|Text|Effect|Magic)?)\=/g,
            ' <span style="color: #9cdcfe">$1</span>='
        );

        // Numbers (lightgreen)
        highlighted = highlighted.replace(
            /\b(\d+)\b/g,
            '<span style="color: #b5cea8">$1</span>'
        );

        // Comments (gray)
        highlighted = highlighted.replace(
            /\/\/(.*)/g,
            '<span style="color: #6a9955">//$1</span>'
        );

        return highlighted;
    };

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                padding: 40,
                fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
                fontSize: 32,
                lineHeight: 1.6,
                color: '#d4d4d4',
                overflow: 'hidden'
            }}
        >
            {/* Editor header */}
            <div
                style={{
                    display: 'flex',
                    gap: 10,
                    marginBottom: 30,
                    paddingBottom: 20,
                    borderBottom: '2px solid #2a2a3a'
                }}
            >
                <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#ff5f57'
                }} />
                <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#ffbd2e'
                }} />
                <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#28ca42'
                }} />
            </div>

            {/* Code content */}
            <div style={{ position: 'relative' }}>
                {lines.map((line, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 4,
                            background: highlightedLines.includes(index + 1)
                                ? 'rgba(0, 217, 255, 0.1)'
                                : 'transparent',
                            borderLeft: highlightedLines.includes(index + 1)
                                ? '4px solid #00d9ff'
                                : '4px solid transparent',
                            paddingLeft: 16,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span
                            style={{
                                color: '#858585',
                                marginRight: 30,
                                minWidth: 40,
                                textAlign: 'right',
                                userSelect: 'none'
                            }}
                        >
                            {index + 1}
                        </span>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: highlightSyntax(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
                            }}
                        />
                        {showCursor && index === cursorPosition && (
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 3,
                                    height: 40,
                                    background: '#00d9ff',
                                    marginLeft: 2,
                                    animation: 'blink 1s step-end infinite'
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <style>
                {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
            </style>
        </AbsoluteFill>
    );
};
