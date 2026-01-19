import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill, Easing } from 'remotion';

export const Scene7: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Split screen merge animation - FASTER START
    const mergeProgress = spring({
        frame: frame, // Start at frame 0 immediately
        fps,
        config: {
            damping: 40,
            mass: 0.5,
            stiffness: 150
        },
    });

    // Final video scale and animation - FASTER
    const videoScale = spring({
        frame: frame - 10, // Reduced delay
        fps,
        config: {
            damping: 20,
            stiffness: 120
        },
    });

    // Separate Counter Animation - Monotonic (No bouncing)
    // Starts a bit after the video appears
    const countProgress = interpolate(
        frame,
        [15, 65], // 50 frames (~0.8s) to count up
        [0, 1],
        {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.exp)
        }
    );

    // Particle animations
    const particleOpacity = interpolate(
        frame,
        [30, 50, 200], // Start earlier
        [0, 1, 0.3],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const gradientRotation = (frame * 2) % 360;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(${gradientRotation}deg, #0a0a0f 0%, #1a1a24 50%, #0a0a0f 100%)`,
            }}
        >
            {/* Merging split screens */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                    transform: `translateX(${interpolate(mergeProgress, [0, 1], [0, -100], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })}%)`,
                    opacity: interpolate(mergeProgress, [0, 0.5, 1], [1, 0.5, 0]),
                    borderRight: '4px solid #00d9ff'
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #050508 0%, #0a0a0f 100%)',
                    transform: `translateX(${interpolate(mergeProgress, [0, 1], [0, 100], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    })}%)`,
                    opacity: interpolate(mergeProgress, [0, 0.5, 1], [1, 0.5, 0])
                }}
            />

            {/* Main showcase - Polished final video */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: videoScale,
                }}
            >
                {/* Mock video player */}
                <div
                    style={{
                        width: 900,
                        height: 1600,
                        background: 'linear-gradient(135deg, #1a1a24 0%, #2a2a3a 100%)',
                        borderRadius: 40,
                        overflow: 'hidden',
                        boxShadow: '0 40px 120px rgba(0, 0, 0, 0.8), 0 0 100px rgba(0, 217, 255, 0.3)',
                        border: '6px solid rgba(0, 217, 255, 0.4)',
                        transform: `scale(${videoScale})`,
                        position: 'relative'
                    }}
                >
                    {/* Video content */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, #050508 0%, #0a0a0f 100%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 60,
                            padding: 80
                        }}
                    >
                        {/* Animated logo/icon */}
                        <div
                            style={{
                                fontSize: 160,
                                transform: `rotate(${frame * 3}deg) scale(${1 + Math.sin(frame * 0.1) * 0.1})`,
                                filter: 'drop-shadow(0 0 60px rgba(0, 217, 255, 0.8))'
                            }}
                        >
                            ▶
                        </div>

                        {/* Title text */}
                        <h1
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 96,
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, #00d9ff 0%, #ff006e 50%, #ffbe0b 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                letterSpacing: '-0.03em'
                            }}
                        >
                            Your Next<br />Viral Video
                        </h1>

                        {/* Bars */}
                        <div style={{ display: 'flex', gap: 20, marginTop: 40 }}>
                            {[...Array(5)].map((_, i) => {
                                const barHeight = Math.abs(Math.sin((frame + i * 10) * 0.1)) * 100 + 60;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            width: 30,
                                            height: barHeight,
                                            background: `linear-gradient(to top, #${['00d9ff', 'ff006e', 'ffbe0b', 'a855f7', '06ffa5'][i]}, transparent)`,
                                            borderRadius: '15px 15px 0 0',
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* Stats - NOW USING countProgress FOR STABLE COUNTING */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 80,
                                marginTop: 60,
                                fontFamily: 'Inter, sans-serif'
                            }}
                        >
                            {[
                                { label: 'VIEWS', value: Math.floor(countProgress * 1250000) },
                                { label: 'LIKES', value: Math.floor(countProgress * 89000) }
                            ].map((stat) => (
                                <div key={stat.label} style={{ textAlign: 'center' }}>
                                    <div
                                        style={{
                                            fontSize: 64,
                                            fontWeight: 900,
                                            color: '#00d9ff',
                                            marginBottom: 10
                                        }}
                                    >
                                        {stat.value.toLocaleString()}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 28,
                                            fontWeight: 600,
                                            color: '#b4b4c8',
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Particles */}
            {[...Array(30)].map((_, i) => {
                const x = 540 + Math.cos(i) * 400;
                const y = 960 + Math.sin(i) * 400;
                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#00d9ff',
                            opacity: particleOpacity,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
