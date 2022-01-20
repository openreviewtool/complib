import React, { useState } from 'react';
import PlayDeck, { LOOP_TYPE_LIST } from '../../component/core/PlayDeck';
import Timeline from '../../component/core/Timeline';

export default {
  title: 'Timeline',
};

export const Default = (): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(0.25);

  const handleTimelineSeek = (seekTime: number) => {
    setCurrentTime(seekTime);
  };

  return (
    <div
      id="example Container"
      style={{
        paddingTop: '100px',
        height: '100%',
        background: '#888',
        marginLeft: '20px',
        width: 'calc(100% - 40px)',
      }}
    >
      <Timeline currentTime={currentTime} duration={1} onTimelineSeek={handleTimelineSeek} />
    </div>
  );
};

export const UseFrames = (): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(0.5);

  const handleTimelineSeek = (seekTime: number) => {
    setCurrentTime(seekTime);
  };

  return (
    <div
      id="example Container"
      style={{
        paddingTop: '100px',
        height: '100%',
        background: '#888',
        marginLeft: '20px',
        width: 'calc(100% - 40px)',
      }}
    >
      <Timeline
        currentTime={currentTime}
        duration={2}
        useFrameDisplay={true}
        frameRange={[101, 110]}
        onTimelineSeek={handleTimelineSeek}
      />
    </div>
  );
};

export const WithPlayControls = (): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(0.5);
  const [playing, setPlaying] = useState(true);

  const [loopTypeIndex, setLoopTypeIndex] = useState<number>(0);

  const handleTimelineSeek = (seekTime: number) => {
    setCurrentTime(seekTime);
  };

  const playDeck = (
    <PlayDeck
      playing={playing}
      onPlay={() => {
        setPlaying((p) => !p);
      }}
      onSkipNext={() => {
        console.log('Play Next');
      }}
      onSkipPrev={() => {
        console.log('Play Previous');
      }}
      loopType={LOOP_TYPE_LIST[loopTypeIndex]}
      onToggleLoop={() => {
        setLoopTypeIndex((loopTypeIndex + 1) % LOOP_TYPE_LIST.length);
      }}
    />
  );

  return (
    <div
      id="mainWindow"
      style={{
        paddingTop: '100px',
        height: '100%',
        background: '#888',
        marginLeft: '20px',
        width: 'calc(100% - 40px)',
      }}
    >
      <div id="playControlPanel" style={{ position: 'relative', width: '100%' }}>
        <Timeline
          currentTime={currentTime}
          duration={2}
          useFrameDisplay={true}
          frameRange={[101, 148]}
          onTimelineSeek={handleTimelineSeek}
        />
        {playDeck}
      </div>
    </div>
  );
};

Default.parameters = { layout: 'fullscreen' };
