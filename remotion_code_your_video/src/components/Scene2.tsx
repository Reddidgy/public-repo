import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';

export const Scene2: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Split animation
    const splitProgress = spring({
        frame: frame - 5,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.5 },
    });

    // Explosion scale - Initial Impact
    const explosionSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 10, stiffness: 100, mass: 0.5 },
    });

    // Continuous expansion (so it never stops moving)
    const continuousZoom = interpolate(frame, [0, 90], [1, 1.4]);
    const finalScale = explosionSpring * continuousZoom;

    // Impact shake effect
    const shakeIntensity = spring({
        frame: frame - 10,
        fps,
        config: { damping: 5, stiffness: 200 }
    });

    const shakeX = (1 - shakeIntensity) * Math.sin(frame * 0.8) * 30;

    // Continuous Rotation (Never stops)
    const explosionRotate = interpolate(
        frame,
        [0, 200],
        [0, 360],
        { extrapolateLeft: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)',
                transform: `translateX(${frame > 10 && frame < 30 ? shakeX : 0}px)`
            }}
        >
            {/* Left side - Code editor */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                    transform: `translateX(${interpolate(splitProgress, [0, 1], [50, 0], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })}%)`,
                    borderRight: '4px solid rgba(0, 217, 255, 0.5)',
                    padding: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2
                }}
            >
                <div
                    style={{
                        fontSize: 200,
                        fontWeight: 'bold',
                        fontFamily: 'Inter, sans-serif',
                        color: '#ffffff',
                        textAlign: 'center',
                        opacity: interpolate(frame, [0, 10], [0, 1])
                    }}
                >
                    ⏎
                </div>
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 600,
                        color: '#00d9ff',
                        marginTop: 40,
                        fontFamily: 'Inter, sans-serif',
                        opacity: interpolate(frame, [5, 15], [0, 1])
                    }}
                >
                    PRESS ENTER
                </div>
            </div>

            {/* Right side - Explosion */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0a0a0f 0%, #050508 100%)',
                    transform: `translateX(${interpolate(splitProgress, [0, 1], [-50, 0], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })}%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    zIndex: 1
                }}
            >
                {/* Generated procedural shape explosion */}
                <div
                    style={{
                        transform: `scale(${finalScale}) rotate(${explosionRotate}deg)`,
                        opacity: interpolate(frame, [5, 15], [0, 1]),
                        width: 600,
                        height: 600,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Center Core */}
                    <div style={{
                        position: 'absolute',
                        width: 100, height: 100,
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 0 50px #fff'
                    }} />

                    {/* Rotating Squares */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            width: 300, height: 300,
                            border: '4px solid #00d9ff',
                            transform: `rotate(${i * 30}deg)`,
                            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
                            opacity: 0.7
                        }} />
                    ))}

                    {/* Glowing Spikes */}
                    {[...Array(8)].map((_, i) => (
                        <div key={`spike-${i}`} style={{
                            position: 'absolute',
                            width: 500, height: 10,
                            background: 'linear-gradient(90deg, transparent, #ff006e, transparent)',
                            transform: `rotate(${i * 45}deg)`,
                            opacity: 0.8
                        }} />
                    ))}
                </div>

                {/* Additional particles must also keep moving */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    // Extended speed range so they don't stop
                    const speed = interpolate(frame, [10, 150], [0, 3]);
                    const distance = interpolate(
                        frame,
                        [10, 100],
                        [0, 900], // Fly further out
                    );

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                width: 20 + Math.random() * 20,
                                height: 20 + Math.random() * 20,
                                borderRadius: '50%',
                                background: i % 2 === 0 ? '#00d9ff' : '#ff006e',
                                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(${Math.max(0, 1 - speed * 0.1)})`,
                                opacity: 1,
                                boxShadow: `0 0 40px ${i % 2 === 0 ? '#00d9ff' : '#ff006e'}`
                            }}
                        />
                    );
                })}
            </div>

            {/* Center glow effect */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 300,
                    height: 300,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.5) 0%, transparent 70%)',
                    opacity: interpolate(
                        frame,
                        [10, 20],
                        [0, 1],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ),
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                    zIndex: 3
                }}
            />
        </AbsoluteFill>
    );
};
