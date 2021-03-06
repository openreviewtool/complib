import React, { useRef, useState } from 'react';
import './style.css';
import { formatTimeDisplay } from './utils';

export interface TimelineProps {
  className?: string; // to override styling

  duration: number; // in sec as a float
  currentTime: number; // in sec as a float
  currentCached?: number;

  useFrameDisplay?: boolean;
  frameRange?: [number, number];

  timelineCaptured?: boolean;
  onTimelineCaptured?: (captured: boolean) => void; // user mouse down / touch start on timeline

  onTimelineSeek?: (seekTime: number, seekFrameIndex?: number) => void;
  onPointerMove?: (e: any) => void; // user enter the timeline

  themeColor?: string;
  markerList?: number[];
}

// the millesec of delay between emitting scrubbing updates.
const SCRUB_UPDATE_DELAY = 5;

const Timeline: React.FC<TimelineProps> = ({
  frameRange,
  useFrameDisplay = false,
  themeColor = 'red',

  ...props
}) => {
  const progressDisplayTimeoutRef = useRef<number | null>(null);
  const [seekPercentage, setSeekPercentage] = useState<number>(0);

  const [innerCaptured, setInnerCaptured] = useState<boolean>(false);
  const timelineCaptured = props.timelineCaptured || innerCaptured;
  const onTimelineCaptured = props.onTimelineCaptured || setInnerCaptured;

  const playPercentage = props.currentTime / props.duration; // actual percentage

  // display perentage as adjust at frame discret increment steps.
  let displayPlayPercentage = playPercentage;
  let oneFramePercent = 0;
  let frameDuration = -1;
  let frameIndex = -1;

  if (timelineCaptured) {
    displayPlayPercentage = seekPercentage;
  }

  if (useFrameDisplay && frameRange) {
    frameDuration = frameRange[1] - frameRange[0] + 1;
    oneFramePercent = 1 / frameDuration;

    // this is due movie showing first frame at 0%)
    displayPlayPercentage = Math.min(
      displayPlayPercentage,
      1 - oneFramePercent,
    );

    const frameElapsed = Math.floor(displayPlayPercentage * frameDuration);
    frameIndex = frameElapsed + frameRange[0];

    displayPlayPercentage = Math.min(frameElapsed * oneFramePercent);
  }

  React.useEffect(() => {
    return () => {
      if (progressDisplayTimeoutRef.current !== null) {
        window.clearTimeout(progressDisplayTimeoutRef.current);
      }
    };
  }, []);

  const handleScrubStart = (e: any) => {
    const isPointerDownEvent = e.type && e.type === 'pointerdown';
    // have the canvas capture the mouse events until it's released
    if (isPointerDownEvent) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (onTimelineCaptured) onTimelineCaptured(true);
    fireSeekEvent(e);
  };

  /**
   * User as moved the playhead either by
   * 1) selected the thumb and moving it
   * 2) click anywhere on the timeline.
   */
  const handleScrubMove = (e: any) => {
    if (!timelineCaptured) return;

    fireSeekEvent(e);
  };

  const handleScrubEnd = (e: any) => {
    const isPointerEvent = e.type && e.type.startsWith('pointer');

    // have the canvas capture the mouse events until it's released
    if (isPointerEvent) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (onTimelineCaptured) onTimelineCaptured(false);
  };

  const fireSeekEvent = (e: any) => {
    const isPointerEvent = e.type && e.type.startsWith('pointer');
    const isPointerMoveEvent = e.type && e.type === 'pointermove';

    if (isPointerMoveEvent) {
      if (props.onPointerMove) {
        props.onPointerMove(e);
      }

      if (e.buttons === 0) {
        // no button is pressed, return
        return;
      }
    }

    e.stopPropagation();

    const bounds = e.target.getBoundingClientRect();
    if (bounds.width === 0) {
      console.warn('bounds for timeline is 0');
      return;
    }

    const totalWidth = bounds.width;

    let offset =
      (isPointerEvent ? e.pageX : e.touches[0].clientX) - bounds.left;
    offset = Math.max(0, Math.min(offset, totalWidth));

    const _seekPercentage = offset / totalWidth;
    setSeekPercentage(_seekPercentage);
    let seekTime = _seekPercentage * props.duration;
    let seekFrameIndex = -1;

    if (props.onTimelineSeek) {
      if (progressDisplayTimeoutRef.current) {
        window.clearTimeout(progressDisplayTimeoutRef.current);
        progressDisplayTimeoutRef.current = null;
      }

      if (useFrameDisplay && frameRange) {
        const frameDuration = frameRange[1] - frameRange[0] + 1;
        seekFrameIndex = Math.floor(
          _seekPercentage * frameDuration + frameRange[0],
        );
      }

      // on Tablet if onTimelineSeek is called directly without this delay of 1ms, the play header
      // index leave a trail and ghost indices.  Almost as if there
      // are too many mouseMove events called and the redraw is not quick enough.
      progressDisplayTimeoutRef.current = window.setTimeout(
        props.onTimelineSeek,
        SCRUB_UPDATE_DELAY,
        seekTime,
        seekFrameIndex,
      );
    }
  };

  const playHead = (
    <>
      <div
        className="timeline__track__playhead"
        style={{
          left: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
          backgroundColor: `${themeColor}`,
        }}
      />
      <div
        className="timeline__track__playhead__text"
        style={{
          left: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
        }}
      >
        {frameIndex !== -1
          ? frameIndex
          : formatTimeDisplay(
              displayPlayPercentage * props.duration,
              props.duration,
            )}
      </div>
    </>
  );

  const playedGauge = (
    <div
      className="timeline__track__progress"
      style={{
        background: themeColor,
        width: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
      }}
    />
  );

  const cachedGauge = props.currentCached && (
    <div
      className="timeline__track__cache_gauge"
      style={{
        width: `${
          (props.currentCached / props.duration + oneFramePercent) * 100
        }%`,
      }}
    />
  );

  const markers = props.markerList && (
    <>
      {props.markerList.map((t: number, i: number) => {
        const markerPercentage = t / props.duration;
        return (
          <div
            key={`timelineMarker${i}`}
            className="timeline__track__marker_dot"
            style={{
              left: `${(markerPercentage + oneFramePercent) * 100}%`,
            }}
          ></div>
        );
      })}
    </>
  );

  return (
    <div className={'timeline'}>
      <div
        className="timeline__scrollzone"
        onPointerMove={handleScrubMove}
        onTouchMove={handleScrubMove}
        onPointerDown={handleScrubStart}
        onTouchStart={handleScrubStart}
        onPointerUp={handleScrubEnd}
        onTouchEnd={handleScrubEnd}
      >
        <div className="timeline__track">
          {cachedGauge}
          {playedGauge}
          {playHead}
          {markers}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
