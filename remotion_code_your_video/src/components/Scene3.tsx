import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';

export const Scene3: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- TRANSITION IN (From Scene 2 Explosion) ---
    // 1. Initial Burn (Whiteout)
    const transitionBurn = interpolate(frame, [0, 5], [1, 0], { extrapolateRight: 'clamp' });

    // 2. Impact Shake (Carryover from explosion) - Reduced slightly to let text dominate
    const impactShake = (1 - interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })) * Math.sin(frame * 1.5) * 30;

    // 3. Chromatic Expansion
    const snapScale = interpolate(frame, [0, 10], [1.2, 1], { extrapolateRight: 'clamp' });

    // --- SCENE ANIMATIONS ---

    // Code typing animation for left side
    const codeProgress = spring({
        frame: frame - 5,
        fps,
        config: { damping: 200 },
    });

    const code = '<Title text="Video Editing is Dead" />';
    const visibleChars = Math.floor(codeProgress * code.length);
    const displayCode = code.substring(0, visibleChars);

    // Glitch effect intensity
    const glitchIntensity = interpolate(
        frame,
        [40, 60, 100],
        [1, 0.8, 0.2],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const glitchOffset = Math.sin(frame * 0.8) * 20 * glitchIntensity;

    // Background flash effect (Red flash)
    const bgFlash = interpolate(
        frame,
        [40, 45, 60],
        [0, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // --- TRAILER ZOOM EFFECT ---
    // 1. Slam Entry (Fast)
    const entryProgress = spring({
        frame: frame - 15, // Delay slightly to let the "Burn" clear
        fps,
        config: { mass: 2, damping: 50, stiffness: 200 } // Heavy, cinematic slam
    });

    const entryScale = interpolate(entryProgress, [0, 1], [3, 1]); // Starts HUGE vs starts small (Slamming IN vs slamming down)
    // Actually, "moving towards user" usually implies growing larger (Zoom In).
    // Let's do: Start normal, Grow Huge.

    // Continuous Aggressive Zoom (The "Trailer" Move)
    // Over the course of the scene (180 frames), scale from 1.0 to 2.5
    const trailerZoom = interpolate(frame, [0, 150], [1, 2.5], { easing: (t) => t * t }); // Quadratic acceleration

    // Tracking (Letter Spacing) Expansion
    const tracking = interpolate(frame, [0, 150], [0, 20]); // 0px to 20px letter spacing

    // Combined Scale
    const finalScale = snapScale * trailerZoom; // Snap is the shake, TrailerZoom is the main move.

    return (
        <AbsoluteFill style={{ background: '#0a0a0f', overflow: 'hidden' }}>

            {/* CONTAINER WITH IMPACT SHAKE & SCALE */}
            <AbsoluteFill style={{
                transform: `translateX(${impactShake}px)`
            }}>

                {/* Left side - Code editor */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #1a1a24 0%, #0f0f18 100%)',
                        borderRight: '4px solid rgba(255, 0, 80, 0.8)',
                        padding: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        zIndex: 2 // Keep code above glitch BG 
                    }}
                >
                    <div style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 38,
                        lineHeight: 1.8,
                        color: '#d4d4d4',
                    }}>
                        {/* Display Code Logic */}
                        <span style={{ color: '#858585', marginRight: 30 }}>1</span>
                        <span style={{ color: '#4ec9b0' }}>&lt;Title</span>
                        {displayCode.includes('text') && (
                            <>
                                <span style={{ color: '#9cdcfe' }}> text</span>
                                <span>=</span>
                            </>
                        )}
                        {displayCode.includes('"') && (
                            <span style={{ color: '#ce9178' }}>
                                "{displayCode.includes('Video') ? 'Video Editing is Dead' : ''}"
                            </span>
                        )}
                        {displayCode.includes('/>') && (
                            <span style={{ color: '#4ec9b0' }}> /&gt;</span>
                        )}

                        {displayCode.length < code.length && (
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 3,
                                    height: 40,
                                    background: '#ff0050',
                                    marginLeft: 4,
                                    animation: 'blink 0.5s step-end infinite'
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Right side - Title with CINEMATIC TRAILER ZOOM */}
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '50%',
                        height: '100%',
                        background: `linear-gradient(135deg, rgba(255, 0, 0, ${bgFlash * 0.3}) 0%, #0a0a0f 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        perspective: 1000 // Add depth
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            transform: `scale(${finalScale})`, // Applying the aggressive zoom
                            transformOrigin: '50% 50%',
                        }}
                    >
                        {/* Main text */}
                        <h1
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 90,
                                fontWeight: 900,
                                color: '#ffffff',
                                textAlign: 'center',
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                padding: '0 20px',
                                position: 'relative',
                                zIndex: 3,
                                textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                                letterSpacing: tracking // Animate Letter spacing
                            }}
                        >
                            Video<br />Editing<br />is <span style={{ color: '#ff0050' }}>Dead</span>
                        </h1>

                        {/* Glitch layer 1 - cyan */}
                        <h1
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 90,
                                fontWeight: 900,
                                color: '#00d9ff',
                                textAlign: 'center',
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                position: 'absolute',
                                top: 0,
                                left: glitchOffset,
                                opacity: glitchIntensity * 0.8,
                                zIndex: 1,
                                mixBlendMode: 'screen',
                                letterSpacing: tracking
                            }}
                        >
                            Video<br />Editing<br />is Dead
                        </h1>

                        {/* Glitch layer 2 - magenta */}
                        <h1
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 90,
                                fontWeight: 900,
                                color: '#ff0050',
                                textAlign: 'center',
                                lineHeight: 1,
                                textTransform: 'uppercase',
                                position: 'absolute',
                                top: 0,
                                left: -glitchOffset,
                                opacity: glitchIntensity * 0.8,
                                zIndex: 2,
                                mixBlendMode: 'screen',
                                letterSpacing: tracking
                            }}
                        >
                            Video<br />Editing<br />is Dead
                        </h1>

                        {/* Noise overlay */}
                        {glitchIntensity > 0.3 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=")',
                                    opacity: 0.3,
                                    zIndex: 4,
                                    mixBlendMode: 'overlay'
                                }}
                            />
                        )}
                    </div>
                </div>
            </AbsoluteFill>

            {/* TRANSITION OVERLAY */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'white',
                opacity: transitionBurn,
                pointerEvents: 'none',
                zIndex: 99
            }} />

            <div style={{
                position: 'absolute', left: -5, top: 0, width: '100%', height: '100%',
                background: 'rgba(0, 255, 255, 0.2)',
                mixBlendMode: 'screen',
                opacity: transitionBurn,
                transform: `translateX(${Math.sin(frame) * 10}px)`,
                pointerEvents: 'none',
                zIndex: 98
            }} />
            <div style={{
                position: 'absolute', left: 5, top: 0, width: '100%', height: '100%',
                background: 'rgba(255, 0, 0, 0.2)',
                mixBlendMode: 'screen',
                opacity: transitionBurn,
                transform: `translateX(${Math.sin(frame + 10) * -10}px)`,
                pointerEvents: 'none',
                zIndex: 98
            }} />

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
