import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export const Scene6: React.FC = () => {
    const frame = useCurrentFrame();

    // Different code snippets cycle through
    const snippets = [
        { code: '<Sequence from={30}>', visual: 'SEQUENCE' },
        { code: '<Audio src="music.mp3" />', visual: '♪ AUDIO' },
        { code: '<Transition type="slide" />', visual: '→ TRANSITION' }
    ];

    const snippetDuration = 80; // ~1.3 seconds per snippet at 60fps
    const currentSnippetIndex = Math.floor(frame / snippetDuration) % snippets.length;
    const snippetProgress = (frame % snippetDuration) / snippetDuration;
    const currentSnippet = snippets[currentSnippetIndex];

    // Fast typing effect
    const typeProgress = Math.min(snippetProgress * 3, 1);
    const visibleChars = Math.floor(typeProgress * currentSnippet.code.length);
    const displayCode = currentSnippet.code.substring(0, visibleChars);

    // Visual elements animations
    const visualOpacity = interpolate(
        snippetProgress,
        [0.2, 0.3, 0.85, 0.95],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const visualScale = interpolate(
        snippetProgress,
        [0.2, 0.35],
        [0.8, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Progress bar animation
    const progressBarFill = interpolate(
        snippetProgress,
        [0.3, 0.8],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ background: '#0a0a0f' }}>
            {/* Left side - Rapidly changing code */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                    borderRight: '4px solid rgba(168, 85, 247, 0.5)',
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {/* Header showing component count */}
                <div
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#a855f7',
                        marginBottom: 40,
                        opacity: 0.8
                    }}
                >
                    Component {currentSnippetIndex + 1}/{snippets.length}
                </div>

                {/* Code display */}
                <div
                    style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 40,
                        lineHeight: 1.8,
                        color: '#d4d4d4',
                    }}
                >
                    <span style={{ color: '#858585', marginRight: 30 }}>1</span>

                    {/* Syntax highlighted code */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: displayCode
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/&lt;(\/?[A-Za-z]+)/g, '<span style="color: #4ec9b0">&lt;$1</span>')
                                .replace(/\s([a-z]+)=/g, ' <span style="color: #9cdcfe">$1</span>=')
                                .replace(/"([^"]*)"/g, '"<span style="color: #ce9178">$1</span>"')
                                .replace(/&gt;/g, '<span style="color: #4ec9b0">&gt;</span>')
                        }}
                    />

                    {/* Cursor */}
                    {displayCode.length < currentSnippet.code.length && (
                        <span
                            style={{
                                display: 'inline-block',
                                width: 3,
                                height: 42,
                                background: '#a855f7',
                                marginLeft: 4,
                                animation: 'blink 0.5s step-end infinite'
                            }}
                        />
                    )}
                </div>

                {/* Fast typing indicator */}
                <div
                    style={{
                        marginTop: 60,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        opacity: typeProgress < 1 ? 1 : 0.5
                    }}
                >
                    <div
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#06ffa5',
                            animation: 'pulse 0.5s ease-in-out infinite'
                        }}
                    />
                    <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 24,
                        color: '#06ffa5',
                        fontWeight: 600
                    }}>
                        Typing...
                    </span>
                </div>
            </div>

            {/* Right side - Visual demonstrations */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #050508 0%, #0a0a0f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Visual representation based on current snippet */}
                <div
                    style={{
                        opacity: visualOpacity,
                        transform: `scale(${visualScale})`,
                        transition: 'all 0.2s ease-out'
                    }}
                >
                    {currentSnippetIndex === 0 && (
                        // Sequence visual - slides appearing
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 400,
                                        height: 120,
                                        background: `linear-gradient(135deg, #${['00d9ff', 'ff006e', 'ffbe0b'][i - 1]} 0%, #a855f7 100%)`,
                                        borderRadius: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: 48,
                                        fontWeight: 900,
                                        color: '#fff',
                                        transform: `translateX(${interpolate(
                                            snippetProgress,
                                            [0.3, 0.4 + i * 0.1],
                                            [-500, 0],
                                            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                                        )}px)`,
                                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    SLIDE {i}
                                </div>
                            ))}
                        </div>
                    )}

                    {currentSnippetIndex === 1 && (
                        // Audio visual - waveform
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 400 }}>
                            {[...Array(16)].map((_, i) => {
                                const barHeight = Math.sin(snippetProgress * 10 + i * 0.5) * 150 + 200;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            width: 20,
                                            height: barHeight,
                                            background: 'linear-gradient(to top, #00d9ff, #a855f7)',
                                            borderRadius: '10px 10px 0 0',
                                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
                                            transition: 'height 0.1s ease-out'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {currentSnippetIndex === 2 && (
                        // Transition visual - progress bar
                        <div style={{ width: 450 }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: 60,
                                    background: '#1a1a24',
                                    borderRadius: 30,
                                    overflow: 'hidden',
                                    border: '3px solid #a855f7',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        width: `${progressBarFill * 100}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #00d9ff 0%, #ff006e 50%, #ffbe0b 100%)',
                                        transition: 'width 0.05s linear',
                                        boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.3)'
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: 32,
                                        fontWeight: 900,
                                        color: progressBarFill > 0.5 ? '#000' : '#fff',
                                        mixBlendMode: progressBarFill > 0.5 ? 'difference' : 'normal'
                                    }}
                                >
                                    {Math.floor(progressBarFill * 100)}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Label */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 80,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 56,
                        fontWeight: 900,
                        color: '#ffffff',
                        opacity: visualOpacity,
                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
                    }}
                >
                    {currentSnippet.visual}
                </div>
            </div>

            <style>
                {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
          }
        `}
            </style>
        </AbsoluteFill>
    );
};
