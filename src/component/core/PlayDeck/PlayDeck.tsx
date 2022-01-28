import React from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LoopIcon from '@mui/icons-material/Loop';

import { Badge, IconButton } from '@mui/material';

import './style.css';

export type LOOPTYPE = 'off' | 'loopCurrent' | 'loopAll';
export const LOOP_TYPE_LIST: LOOPTYPE[] = ['off', 'loopCurrent', 'loopAll'];

export interface PlayDeckProps {
  className?: string; // to override styling

  playing?: boolean;
  onPlay?: () => void;

  onSkipPrev?: () => void; // user enter the timeline
  disablePrev?: boolean;

  onSkipNext?: () => void;
  disableNext?: boolean;

  loopType?: LOOPTYPE;
  onToggleLoop?: () => void;

  themeColor?: string;
  iconSize?: "large" | "medium" | "small" | undefined;
}

const PlayDeck: React.FC<PlayDeckProps> = ({
  disablePrev = false,
  disableNext = false,

  themeColor = 'white',
  iconSize = undefined,

  ...props
}) => {
  return (
    <div className={'playDeck'}>
      {props.onSkipPrev && (
        <IconButton
          size={iconSize}
          onClick={props.onSkipPrev}
          disabled={disablePrev}
          style={{ color: themeColor }}
        >
          <SkipPreviousIcon />
        </IconButton>
      )}
      <IconButton
        size={iconSize}
        onClick={props.onPlay}
        style={{ color: themeColor }}
      >
        {props.playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      {props.onSkipNext && (
        <IconButton
          size={iconSize}
          onClick={props.onSkipNext}
          disabled={disableNext}
          style={{ color: themeColor }}
        >
          <SkipNextIcon />
        </IconButton>
      )}

      {props.onToggleLoop && (
        <IconButton
          size="small"
          onClick={props.onToggleLoop}
          title={props.loopType}
        >
          <Badge
            badgeContent={props.loopType === 'loopCurrent' ? 1 : null}
            style={{ color: props.loopType === 'off' ? undefined : themeColor }}
          >
            <LoopIcon
              style={{
                fill: props.loopType === 'off' ? undefined : themeColor,
              }}
            />
          </Badge>
        </IconButton>
      )}
    </div>
  );
};

export default PlayDeck;
