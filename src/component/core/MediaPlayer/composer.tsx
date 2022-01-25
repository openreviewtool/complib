import React, { useState } from 'react';
import { PlayDeckProps } from '../PlayDeck/PlayDeck';
import { TimelineProps } from '../Timeline/Timeline';
import RPlayer from './RPlayer';
import { MediaInfo, PlayerState } from './types';

export const withPlaydeck = (
  mediaList: MediaInfo[],
  mediaIndex: number,
  setMediaIndex: (index: number) => void,

  TimelineComp: React.FC<TimelineProps>,
  PlaydeckComp: React.FC<PlayDeckProps>,
) => {
  const [playing, setPlaying] = useState(false);
  const [seekTime, setSeekTime] = useState<number>(); // seek time
  const [pState, setPState] = useState<PlayerState>({ played: 0, loaded: 0 });
  const showTimeline =
    (typeof pState.loaded === 'number' && pState.loaded !== 0) ||
    (typeof pState.played === 'number' && pState.played !== 0);

  return (
    <div>
      <RPlayer
        url={mediaList[mediaIndex].url}
        playing={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onProgressHiFi={(s) => {
          setPState(s);
        }}
        seekTime={seekTime}
        onEnded={() => setPlaying(false)}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {showTimeline && (
          <TimelineComp
            currentTime={pState.played}
            duration={mediaList[mediaIndex].duration}
            onTimelineSeek={setSeekTime}
            onTimelineCaptured={(captured) => {
              // this is to enabled repeatly seeking same spot.
              if (!captured) setSeekTime(undefined);
            }}
          />
        )}
        <PlaydeckComp
          playing={playing}
          onPlay={() => setPlaying(!playing)}
          onSkipNext={() => {
            setMediaIndex((mediaIndex + 1) % mediaList.length);
          }}
          onSkipPrev={() => {
            setMediaIndex(
              (mediaIndex - 1 + mediaList.length) % mediaList.length,
            );
          }}
        />
      </div>
    </div>
  );
};
