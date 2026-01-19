import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';

// Reusing the Timeline component for consistency
const ComplexTimeline: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#1e1e1e', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ height: 40, background: '#333', borderRadius: 4, display: 'flex', gap: 10, padding: 5 }}>
                {[...Array(8)].map((_, i) => <div key={i} style={{ width: 30, height: 30, background: '#555', borderRadius: 4 }} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden', position: 'relative' }}>
                {[...Array(15)].map((_, trackIndex) => (
                    <div key={trackIndex} style={{ height: 40, background: '#252526', display: 'flex', alignItems: 'center', paddingLeft: 100, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 90, background: '#333', borderRight: '1px solid #444' }} />
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
            </div>
        </div>
    );
};

// "Clean Code" Diagram - ANIMATED
const SystemDiagram: React.FC = () => {
    const frame = useCurrentFrame();

    // 1. Central Pulse
    const pulse = 1 + Math.sin(frame * 0.15) * 0.05;

    // 2. Orbit Rotation of satellites
    const rotation = frame * 0.5;

    // 3. Data Flow (Dash Offset)
    const dashOffset = frame * -3;

    return (
        <div style={{ width: 450, height: 450, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Background Rings */}
            <div style={{
                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                border: '1px solid rgba(6, 255, 165, 0.1)',
                transform: `scale(${1 + Math.sin(frame * 0.05) * 0.1})`
            }} />
            <div style={{
                position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                border: '1px dashed rgba(0, 217, 255, 0.1)',
                transform: `rotate(${-rotation}deg)`
            }} />

            {/* Connection Lines Container (Rotates with satellites) */}
            <div style={{
                position: 'absolute', inset: -50, width: 550, height: 550, zIndex: 1,
                transform: `rotate(${rotation}deg)`,
                pointerEvents: 'none'
            }}>
                <svg width="550" height="550">
                    {/* 4 Lines connecting center to satellites */}
                    <line x1="275" y1="275" x2="275" y2="135" stroke="#06ffa5" strokeWidth="2" strokeDasharray="8, 8" strokeDashoffset={dashOffset} opacity="0.6" />
                    <line x1="275" y1="275" x2="275" y2="415" stroke="#06ffa5" strokeWidth="2" strokeDasharray="8, 8" strokeDashoffset={dashOffset} opacity="0.6" />
                    <line x1="275" y1="275" x2="135" y2="275" stroke="#06ffa5" strokeWidth="2" strokeDasharray="8, 8" strokeDashoffset={dashOffset} opacity="0.6" />
                    <line x1="275" y1="275" x2="415" y2="275" stroke="#06ffa5" strokeWidth="2" strokeDasharray="8, 8" strokeDashoffset={dashOffset} opacity="0.6" />
                </svg>
            </div>

            {/* Center Node */}
            <div style={{
                width: 120, height: 120,
                background: '#1e1e1e',
                borderRadius: 20,
                border: '4px solid #06ffa5',
                boxShadow: `0 0 ${40 + Math.sin(frame * 0.2) * 20}px rgba(6, 255, 165, 0.3)`, // Dynamic Glow
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
                position: 'relative',
                transform: `scale(${pulse})`
            }}>
                <div style={{ fontSize: 40, color: '#06ffa5', fontFamily: 'monospace', fontWeight: 'bold' }}>&lt;/&gt;</div>
            </div>

            {/* Rotating Satellites Container */}
            <div style={{
                position: 'absolute', inset: 0,
                transform: `rotate(${rotation}deg)`,
                pointerEvents: 'none',
                zIndex: 5
            }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        // FIX: Center the elements specifically so rotate origin is correct relative to container
                        left: '50%', top: '50%',
                        marginLeft: -30, marginTop: -30,
                        width: 60, height: 60,

                        background: '#1e1e1e',
                        borderRadius: 12,
                        border: '2px solid #00d9ff',
                        // Place at 90 deg intervals, distance 140px
                        // Counter-rotate the node itself so it stays upright while orbiting
                        transform: `rotate(${i * 90}deg) translate(140px) rotate(-${i * 90 + rotation}deg)`,
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{
                            width: 30, height: 30,
                            background: '#00d9ff',
                            borderRadius: 8,
                            opacity: 0.6 + Math.sin(frame * 0.1 + i) * 0.4 // Independent pulse
                        }} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export const Scene5: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Code deletion and replacement
    const deleteProgress = interpolate(
        frame,
        [0, 30],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const newCodeProgress = spring({
        frame: frame - 40,
        fps,
        config: {
            damping: 200,
        },
    });

    const newCode = '<Code magic="true" />';
    const visibleChars = Math.floor(newCodeProgress * newCode.length);
    const displayNewCode = newCode.substring(0, visibleChars);

    // Wipe transition on right side
    const wipeProgress = spring({
        frame: frame - 50,
        fps,
        config: {
            damping: 120,
            mass: 0.5
        },
    });

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
                    borderRight: '4px solid rgba(255, 0, 110, 0.5)',
                    padding: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {/* Old code being deleted */}
                <div
                    style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 32,
                        lineHeight: 1.8,
                        color: '#d4d4d4',
                        opacity: 1 - deleteProgress,
                        textDecoration: deleteProgress > 0.5 ? 'line-through' : 'none',
                        textDecorationColor: '#ff006e',
                        textDecorationThickness: '3px',
                        marginBottom: 40
                    }}
                >
                    <span style={{ color: '#858585', marginRight: 30 }}>1</span>
                    <span style={{ color: '#4ec9b0' }}>&lt;Image</span>
                    <span style={{ color: '#9cdcfe' }}> src</span>
                    <span>=</span>
                    <span style={{ color: '#ce9178' }}>"frustration.jpg"</span>
                    <br />
                    <span style={{ color: '#858585', marginRight: 30 }}>2</span>
                    <span style={{ marginLeft: 70, color: '#9cdcfe' }}>effect</span>
                    <span>=</span>
                    <span style={{ color: '#ce9178' }}>"fadeIn"</span>
                    <br />
                    <span style={{ color: '#858585', marginRight: 30 }}>3</span>
                    <span style={{ color: '#4ec9b0' }}>/&gt;</span>
                </div>

                {/* New code appearing */}
                <div
                    style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 36,
                        lineHeight: 1.8,
                        color: '#d4d4d4',
                        opacity: newCodeProgress,
                        transform: `translateY(${interpolate(newCodeProgress, [0, 1], [20, 0], {
                            extrapolateLeft: 'clamp',
                            extrapolateRight: 'clamp'
                        })}px)`,
                    }}
                >
                    <span style={{ color: '#858585', marginRight: 30 }}>1</span>
                    <span style={{ color: '#4ec9b0' }}>&lt;Code</span>
                    {displayNewCode.includes('magic') && (
                        <>
                            <span style={{ color: '#9cdcfe' }}> magic</span>
                            <span>=</span>
                            <span style={{ color: '#ce9178' }}>"true"</span>
                        </>
                    )}
                    {displayNewCode.includes('/>') && (
                        <span style={{ color: '#4ec9b0' }}> /&gt;</span>
                    )}

                    {/* Cursor */}
                    {displayNewCode.length < newCode.length && (
                        <span
                            style={{
                                display: 'inline-block',
                                width: 3,
                                height: 38,
                                background: '#06ffa5',
                                marginLeft: 4,
                                animation: 'blink 1s step-end infinite'
                            }}
                        />
                    )}
                </div>

                {/* Label */}
                <div
                    style={{
                        marginTop: 60,
                        padding: '20px 30px',
                        background: 'rgba(6, 255, 165, 0.1)',
                        borderLeft: '4px solid #06ffa5',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 28,
                        color: '#06ffa5',
                        fontWeight: 600,
                        opacity: newCodeProgress
                    }}
                >
                    ✨ Magic: Pure Code
                </div>
            </div>

            {/* Right side - Wipe transition */}
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
                {/* Old image (frustrated person REPLACED WITH COMPONENT) */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        clipPath: `inset(0 ${wipeProgress * 100}% 0 0)`,
                        filter: 'grayscale(0.5) brightness(0.6)'
                    }}
                >
                    <ComplexTimeline />
                </div>

                {/* New image (code block graphic REPLACED WITH COMPONENT) */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        clipPath: `inset(0 0 0 ${(1 - wipeProgress) * 100}%)`,
                        background: 'linear-gradient(135deg, #0f0f18 0%, #1a1a24 100%)'
                    }}
                >
                    <div
                        style={{
                            transform: `scale(${interpolate(wipeProgress, [0, 1], [1.2, 1], {
                                extrapolateLeft: 'clamp',
                                extrapolateRight: 'clamp'
                            })})`,
                            filter: 'drop-shadow(0 0 40px rgba(6, 255, 165, 0.4))'
                        }}
                    >
                        <SystemDiagram />
                    </div>
                </div>

                {/* Wipe edge glow */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${(1 - wipeProgress) * 100}%`,
                        top: 0,
                        width: 4,
                        height: '100%',
                        background: 'linear-gradient(to right, transparent, #06ffa5, transparent)',
                        boxShadow: '0 0 40px #06ffa5',
                        opacity: wipeProgress > 0.05 && wipeProgress < 0.95 ? 1 : 0
                    }}
                />
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
