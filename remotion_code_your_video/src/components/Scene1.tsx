import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { CodeEditor } from './CodeEditor';

export const Scene1: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Typing animation - appears gradually
    const typingProgress = spring({
        frame,
        fps,
        config: {
            damping: 200,
        },
    });

    const code = '<ViralVideo title="My Next Banger">';
    const visibleChars = Math.floor(typingProgress * code.length);
    const displayCode = code.substring(0, visibleChars);

    // Cursor blinks
    const cursorOpacity = interpolate(
        frame % 30,
        [0, 15, 30],
        [1, 0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <div
            style={{
                width: 1080,
                height: 1920,
                background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Subtle background pattern */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)`,
                    opacity: 0.5
                }}
            />

            {/* Code editor zoomed in */}
            <div
                style={{
                    width: '90%',
                    height: '60%',
                    transform: `scale(${interpolate(frame, [0, 20], [1.2, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })})`,
                    opacity: interpolate(frame, [0, 10], [0, 1], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                        borderRadius: 20,
                        padding: 60,
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        border: '2px solid rgba(0, 217, 255, 0.2)',
                        fontFamily: '"JetBrains Mono", "Consolas", "Monaco", monospace',
                        fontSize: 48,
                        lineHeight: 1.6,
                        color: '#d4d4d4',
                    }}
                >
                    {/* Editor header */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            marginBottom: 40,
                            paddingBottom: 30,
                            borderBottom: '2px solid #2a2a3a'
                        }}
                    >
                        <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#ff5f57'
                        }} />
                        <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#ffbd2e'
                        }} />
                        <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#28ca42'
                        }} />
                    </div>

                    {/* Code line */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#858585', marginRight: 40 }}>1</span>
                        <span>
                            <span style={{ color: '#4ec9b0' }}>&lt;ViralVideo</span>
                            <span style={{ color: '#9cdcfe' }}> title</span>
                            <span>=</span>
                            <span style={{ color: '#ce9178' }}>"{displayCode.includes('My Next Banger') ? 'My Next Banger' : displayCode.includes('"') ? displayCode.split('"')[1] || '' : ''}"</span>
                            {displayCode.includes('>') && <span style={{ color: '#4ec9b0' }}>&gt;</span>}
                            {/* Cursor */}
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 4,
                                    height: 50,
                                    background: '#00d9ff',
                                    marginLeft: 4,
                                    opacity: cursorOpacity,
                                    verticalAlign: 'middle'
                                }}
                            />
                        </span>
                    </div>
                </div>
            </div>

            {/* Vignette effect */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};
