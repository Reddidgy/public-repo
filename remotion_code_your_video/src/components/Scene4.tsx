import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';

// Helper component for the "Old Way" timeline UI
const ComplexTimeline: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#1e1e1e', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Toolbar */}
            <div style={{ height: 40, background: '#333', borderRadius: 4, display: 'flex', gap: 10, padding: 5 }}>
                {[...Array(8)].map((_, i) => <div key={i} style={{ width: 30, height: 30, background: '#555', borderRadius: 4 }} />)}
            </div>

            {/* Timeline Tracks */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden', position: 'relative' }}>
                {[...Array(15)].map((_, trackIndex) => (
                    <div key={trackIndex} style={{ height: 40, background: '#252526', display: 'flex', alignItems: 'center', paddingLeft: 100, position: 'relative' }}>
                        {/* Track Header */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 90, background: '#333', borderRight: '1px solid #444' }} />

                        {/* Random Clips */}
                        {[...Array(4)].map((_, clipIndex) => (
                            <div key={clipIndex} style={{
                                position: 'absolute',
                                left: 100 + Math.random() * 600,
                                width: 50 + Math.random() * 100,
                                height: 30,
                                background: ['#2a5c82', '#6a822a', '#822a2a', '#822a6a'][Math.floor(Math.random() * 4)],
                                borderRadius: 4,
                                border: '1px solid rgba(255,255,255,0.2)'
                            }} />
                        ))}
                    </div>
                ))}

                {/* Playhead */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: 2, background: 'red', zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: -10, left: -6, width: 14, height: 14, background: 'red', transform: 'rotate(45deg)' }} />
                </div>
            </div>
        </div>
    );
}

export const Scene4: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Code typing
    const codeProgress = spring({
        frame: frame - 10,
        fps,
        config: {
            damping: 200,
        },
    });

    const code = '<Image src="frustration.jpg" effect="fadeIn" />';
    const visibleChars = Math.floor(codeProgress * code.length);
    const displayCode = code.substring(0, visibleChars);

    // Image zoom/shake
    const imageScale = interpolate(
        frame,
        [0, 100],
        [1, 1.4],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const shake = Math.sin(frame * 0.5) * interpolate(frame, [0, 100], [0, 5]);

    return (
        <AbsoluteFill style={{ background: '#0a0a0f' }}>
            {/* Left side - Code editor */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                    borderRight: '4px solid rgba(0, 217, 255, 0.5)',
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 32,
                    lineHeight: 1.8,
                    color: '#d4d4d4',
                }}>
                    <span style={{ color: '#858585', marginRight: 30 }}>1</span>
                    <span style={{ color: '#4ec9b0' }}>&lt;Image</span>
                    {displayCode.includes('src') && (
                        <>
                            <span style={{ color: '#9cdcfe' }}> src</span>
                            <span>=</span>
                        </>
                    )}
                    {displayCode.includes('"') && (
                        <span style={{ color: '#ce9178' }}>
                            "{displayCode.includes('frustration') ? 'frustration.jpg' : ''}"
                        </span>
                    )}
                    {displayCode.includes('effect') && (
                        <>
                            <br />
                            <span style={{ color: '#858585', marginRight: 30 }}>2</span>
                            <span style={{ marginLeft: 70, color: '#9cdcfe' }}>effect</span>
                            <span>=</span>
                            <span style={{ color: '#ce9178' }}>"fadeIn"</span>
                        </>
                    )}
                    {displayCode.includes('/>') && (
                        <>
                            <br />
                            <span style={{ color: '#858585', marginRight: 30 }}>3</span>
                            <span style={{ color: '#4ec9b0' }}>/&gt;</span>
                        </>
                    )}

                    {displayCode.length < code.length && (
                        <span
                            style={{
                                display: 'inline-block',
                                width: 3,
                                height: 35,
                                background: '#00d9ff',
                                marginLeft: 4,
                                animation: 'blink 1s step-end infinite'
                            }}
                        />
                    )}
                </div>

                <div
                    style={{
                        marginTop: 60,
                        padding: '20px 30px',
                        background: 'rgba(255, 100, 100, 0.1)', // Red tint
                        borderLeft: '4px solid #ff5555',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 28,
                        color: '#ff5555',
                        fontWeight: 600
                    }}
                >
                    Status: Struggling...
                </div>
            </div>

            {/* Right side - The "Complex Timeline" UI */}
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
                    padding: 40,
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '80%',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        transform: `scale(${imageScale}) translateX(${shake}px)`,
                    }}
                >
                    {/* Replaced Image with Component */}
                    <ComplexTimeline />

                    {/* Red overlay tint */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 0, 0, 0.2)',
                            mixBlendMode: 'multiply',
                            opacity: interpolate(frame, [0, 60], [0, 1])
                        }}
                    />

                    {/* Big Cross Mark X */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: 300,
                            fontWeight: 900,
                            color: 'rgba(255, 0, 0, 0.8)',
                            opacity: interpolate(frame, [30, 40], [0, 1]),
                            textShadow: '0 0 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        ✕
                    </div>

                    {/* Caption */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            left: 40,
                            right: 40,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#ffffff',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                            background: 'rgba(0,0,0,0.6)',
                            padding: 10,
                            borderRadius: 8
                        }}
                    >
                        The Old Way
                    </div>
                </div>
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
