import React from 'react';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import LoopIcon from '@mui/icons-material/Loop';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { Badge, IconButton } from '@mui/material';

import './style.css';

export type LOOPTYPE = 'off' | 'loopCurrent' | 'loopAll';
export const LOOP_TYPE_LIST: LOOPTYPE[] = ['off', 'loopCurrent', 'loopAll'];

export interface PlayDeckProps {
  className?: string; // to override styling

  playing?: boolean;
  onPlay?: () => void;
  disablePlay?: boolean;

  muted?: boolean;
  onMuted?: () => void;
  disableMute?: boolean;

  fullScreen?: boolean;
  onFullScreen?: () => void;

  onSkipPrev?: () => void; // user enter the timeline
  disablePrev?: boolean;

  onSkipNext?: () => void;
  disableNext?: boolean;

  loopType?: LOOPTYPE;
  onToggleLoop?: () => void;

  themeColor?: string;
  iconSize?: 'large' | 'medium' | 'small' | undefined;

  onPrevAnnotation?: () => void;
  disablePrevAnnotation?: boolean;
  onNextAnnotation?: () => void;
  disableNextAnnotation?: boolean;
}

const PlayDeck: React.FC<PlayDeckProps> = ({
  disablePlay = false,
  disableMute = false,

  disablePrev = false,
  disableNext = false,

  disableNextAnnotation = false,
  disablePrevAnnotation = false,

  themeColor = 'white',
  iconSize = undefined,

  ...props
}) => {
  return (
    <div className={'playToolbar'}>
      {props.onSkipPrev && (
        <IconButton
          size={iconSize}
          onClick={props.onSkipPrev}
          disabled={disablePrev}
          style={{ color: themeColor, opacity: disablePrev ? 0.2 : 1 }}
          title={'Skip prev'}
        >
          <SkipPreviousIcon fontSize={iconSize} />
        </IconButton>
      )}
      <IconButton
        size={iconSize}
        onClick={props.onPlay}
        disabled={disablePlay}
        style={{ color: themeColor, opacity: disablePlay ? 0.2 : 1 }}
        title={'Play'}
      >
        {props.playing ? (
          <PauseIcon fontSize={iconSize} />
        ) : (
          <PlayArrowIcon fontSize={iconSize} />
        )}
      </IconButton>
      {props.onSkipNext && (
        <IconButton
          size={iconSize}
          onClick={props.onSkipNext}
          disabled={disableNext}
          style={{ color: themeColor, opacity: disableNext ? 0.2 : 1 }}
          title={'Skip next'}
        >
          <SkipNextIcon fontSize={iconSize} />
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

      {props.onNextAnnotation !== undefined && (
        <>
          <IconButton
            size={iconSize}
            onClick={props.onPrevAnnotation}
            style={{
              color: themeColor,
              opacity: disablePrevAnnotation ? 0.2 : 1,
            }}
            disabled={disablePrevAnnotation}
            title={'Prev annotation'}
          >
            <ChevronLeftIcon fontSize={iconSize} />
          </IconButton>
          <IconButton
            size={iconSize}
            onClick={props.onNextAnnotation}
            style={{
              color: themeColor,
              opacity: disableNextAnnotation ? 0.2 : 1,
            }}
            disabled={disableNextAnnotation}
            title={'Next annotation'}
          >
            <ChevronRightIcon fontSize={iconSize} />
          </IconButton>
        </>
      )}

      <div style={{ flexGrow: 1 }} />

      {props.onMuted && (
        <IconButton
          disabled={disableMute}
          size={iconSize}
          onClick={props.onMuted}
          title="Toggle Mute"
          style={{
            color: props.muted ? 'red' : themeColor,
            opacity: disableMute ? 0.2 : 1,
          }}
        >
          {props.muted ? (
            <VolumeOffIcon fontSize={iconSize} />
          ) : (
            <VolumeUpIcon fontSize={iconSize} />
          )}
        </IconButton>
      )}

      {props.onFullScreen && (
        <IconButton
          size={iconSize}
          onClick={props.onFullScreen}
          title="Toggle Fullscreen"
        >
          {props.fullScreen ? (
            <FullscreenExitIcon
              fontSize={iconSize}
              style={{ color: themeColor }}
            />
          ) : (
            <FullscreenIcon fontSize={iconSize} style={{ color: themeColor }} />
          )}
        </IconButton>
      )}

      <div style={{ width: '10px' }} />
    </div>
  );
};

export default PlayDeck;
