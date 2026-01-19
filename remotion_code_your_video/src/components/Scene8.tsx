import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill, Img, staticFile, Easing } from 'remotion';
import { RemotionLogoCSS } from './Scene8_Logo'; // We'll just inline the logo if needed or reuse the concept

// Inline Logo for simplicity and self-containment
const RemotionLogo: React.FC = () => (
    <div style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0b84f3 0%, #00d9ff 100%)', // Brand Blue
        borderRadius: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(11, 132, 243, 0.6)',
        position: 'relative',
        overflow: 'hidden'
    }}>
        {/* Shine effect */}
        <div style={{
            position: 'absolute', top: -50, left: -50, width: 200, height: 200,
            background: 'rgba(255,255,255,0.2)', transform: 'rotate(45deg)', filter: 'blur(20px)'
        }} />

        {/* Triangle Play Button */}
        <div style={{
            width: 0, height: 0,
            borderLeft: '140px solid white',
            borderTop: '90px solid transparent',
            borderBottom: '90px solid transparent',
            marginLeft: 30, // Visual centering
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))',
            zIndex: 2
        }} />
    </div>
);

export const Scene8: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- PHASE 1: TRANSITION (MATCH SCENE 7 & IMPLODE) ---
    // Start with the phone visible, matching Scene 7's end state
    // 0 -> 10: Hover/Anticipation
    // 10 -> 20: Implode (Scale down to near zero)
    const transitionProgress = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const implodeScale = interpolate(frame, [15, 23], [1, 0.05], { extrapolateRight: 'clamp', easing: Easing.in(Easing.exp) });
    const implodeOpacity = interpolate(frame, [15, 23], [1, 0], { extrapolateRight: 'clamp' });

    // --- PHASE 2: EXPLOSION/FLASH ---
    // Frame 23: The Big Bang
    const flashOpacity = interpolate(frame, [23, 25, 40], [0, 1, 0], { extrapolateRight: 'clamp' });

    // --- PHASE 3: REVEAL (EXPAND OUT) ---
    const revealProgress = spring({
        frame: frame - 23,
        fps,
        config: { damping: 15, stiffness: 80, mass: 0.8 }
    });

    // --- CONTENT ANIMATIONS ---
    const textEnter = spring({
        frame: frame - 28,
        fps,
        config: { damping: 12, stiffness: 100 }
    });

    const logoEnter = spring({
        frame: frame - 35,
        fps,
        config: { damping: 15, stiffness: 90 }
    });

    // Intense CTA Pulse
    const btnScale = 1 + Math.sin(frame * 0.15) * 0.05; // Heartbeat
    const btnGlow = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.5, 1]);

    return (
        <AbsoluteFill style={{ background: '#000' }}>

            {/* 1. NEW BACKGROUND (High Energy) */}
            <AbsoluteFill style={{
                background: 'linear-gradient(135deg, #09090b 0%, #1a0b1a 50%, #000000 100%)',
                opacity: transitionProgress // Fade in behind the phone
            }}>
                {/* Animated Gradient Orbs */}
                <div style={{
                    position: 'absolute', top: '10%', left: '10%', width: 800, height: 800,
                    background: 'radial-gradient(circle, rgba(255, 0, 110, 0.15), transparent 70%)',
                    transform: `translate(${Math.sin(frame * 0.02) * 50}px, ${Math.cos(frame * 0.03) * 50}px)`
                }} />
                <div style={{
                    position: 'absolute', bottom: '10%', right: '10%', width: 900, height: 900,
                    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15), transparent 70%)',
                    transform: `translate(${Math.sin(frame * 0.03) * -50}px, ${Math.cos(frame * 0.02) * -50}px)`
                }} />

                {/* Grid Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                    opacity: 0.5
                }} />
            </AbsoluteFill>


            {/* 2. TRANSITION ELEMENT (The Phone from Scene 7) */}
            {frame < 25 && (
                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: `translate(-50%, -50%) scale(${implodeScale})`,
                    width: 900, height: 1600,
                    background: 'linear-gradient(135deg, #1a1a24 0%, #2a2a3a 100%)',
                    borderRadius: 40,
                    border: '6px solid rgba(0, 217, 255, 0.4)',
                    boxShadow: '0 0 100px rgba(0, 217, 255, 0.5)',
                    opacity: implodeOpacity,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10
                }}>
                    {/* Simplified content of Scene 7 for continuity */}
                    <div style={{ fontSize: 100 }}>▶</div>
                </div>
            )}


            {/* 3. SHOCKWAVE RING (Explosion) */}
            <div style={{
                position: 'absolute', left: '50%', top: '50%',
                width: 2000, height: 2000,
                borderRadius: '50%',
                border: '100px solid white',
                transform: `translate(-50%, -50%) scale(${interpolate(frame, [23, 40], [0, 2])})`,
                opacity: interpolate(frame, [23, 35], [1, 0]),
                zIndex: 20
            }} />


            {/* 4. MAIN CONTENT (Revealed after explosion) */}
            <AbsoluteFill style={{
                justifyContent: 'center', alignItems: 'center',
                display: 'flex', flexDirection: 'column',
                gap: 60,
                zIndex: 5
            }}>

                {/* HEADER: MASSIVE & GLITCHY */}
                <div style={{ textAlign: 'center', transform: `scale(${textEnter})`, opacity: textEnter }}>
                    <h1 style={{
                        fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 130, margin: 0,
                        lineHeight: 0.9, color: 'white', letterSpacing: -5,
                        textShadow: '5px 5px 0px #00d9ff, -5px -5px 0px #ff006e'
                    }}>
                        START
                    </h1>
                    <h1 style={{
                        fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 130, margin: 0,
                        lineHeight: 0.9, color: 'transparent',
                        WebkitTextStroke: '4px white', letterSpacing: -5,
                        transform: 'translateY(-20px)'
                    }}>
                        CODING
                    </h1>
                </div>

                {/* LOGO BOX */}
                <div style={{
                    width: 300, height: 300,
                    transform: `scale(${logoEnter}) rotate(${interpolate(logoEnter, [0, 1], [-45, 0])}deg)`,
                    opacity: logoEnter
                }}>
                    <RemotionLogo />
                </div>

                {/* HERO CTA BUTTON */}
                <div style={{
                    marginTop: 40,
                    transform: `scale(${textEnter})`, opacity: textEnter
                }}>
                    <div style={{
                        padding: '40px 120px',
                        background: 'white',
                        color: 'black',
                        fontSize: 60, fontWeight: 900, fontFamily: 'Inter, sans-serif',
                        borderRadius: 100,
                        transform: `scale(${btnScale})`,
                        boxShadow: `0 0 ${btnGlow * 60}px rgba(6, 255, 165, ${btnGlow}), 0 0 100px rgba(0, 217, 255, 0.4)`,
                        cursor: 'pointer', // Suggests clickability
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        TRY NOW

                        {/* Button Glint */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                            transform: `translateX(${interpolate(frame % 90, [0, 30], [-100, 100])}%)`
                        }} />
                    </div>
                </div>

                {/* SUBTEXT */}
                <div style={{
                    fontFamily: 'JetBrains Mono', fontSize: 32, color: '#888',
                    marginTop: 20, fontWeight: 600,
                    opacity: interpolate(frame, [40, 50], [0, 1])
                }}>
                    npm init video
                </div>

            </AbsoluteFill>

            {/* 5. WHITE FLASH OVERLAY */}
            <AbsoluteFill style={{ background: 'white', opacity: flashOpacity, pointerEvents: 'none', zIndex: 99 }} />

        </AbsoluteFill>
    );
};
