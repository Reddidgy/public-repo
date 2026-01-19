import React from 'react';
import { Series } from 'remotion';
import { Scene1 } from './components/Scene1';
import { Scene2 } from './components/Scene2';
import { Scene3 } from './components/Scene3';
import { Scene4 } from './components/Scene4';
import { Scene5 } from './components/Scene5';
import { Scene6 } from './components/Scene6';
import { Scene7 } from './components/Scene7';
import { Scene8 } from './components/Scene8';

export const MyComposition: React.FC = () => {
  return (
    <Series>
      {/* Scene 1: Code editor intro (0-1s, 60 frames) */}
      <Series.Sequence durationInFrames={60}>
        <Scene1 />
      </Series.Sequence>

      {/* Scene 2: Split-screen reveal (1-3s, 120 frames) */}
      <Series.Sequence durationInFrames={90}>
        <Scene2 />
      </Series.Sequence>

      {/* Scene 3: "Video Editing is Dead" with glitch (4-7s, 180 frames) */}
      <Series.Sequence durationInFrames={180}>
        <Scene3 />
      </Series.Sequence>

      {/* Scene 4: Image fade demonstration (8-11s, 180 frames) */}
      <Series.Sequence durationInFrames={180}>
        <Scene4 />
      </Series.Sequence>

      {/* Scene 5: Code replacement wipe (12-15s, 180 frames) */}
      <Series.Sequence durationInFrames={180}>
        <Scene5 />
      </Series.Sequence>

      {/* Scene 6: Rapid montage (16-20s, 240 frames) */}
      <Series.Sequence durationInFrames={240}>
        <Scene6 />
      </Series.Sequence>

      {/* Scene 7: Climax merge (21-25s, 240 frames) */}
      <Series.Sequence durationInFrames={240}>
        <Scene7 />
      </Series.Sequence>

      {/* Scene 8: CTA finale (26-30s, 240 frames) */}
      <Series.Sequence durationInFrames={240}>
        <Scene8 />
      </Series.Sequence>
    </Series>
  );
};
