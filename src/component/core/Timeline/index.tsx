import React, { useRef, useState } from 'react';
import classNames from 'classnames';

import './style.css';

interface TimelineProps {
  className?: string; // to override styling

  duration: number; // in sec as a float
  currentTime: number; // in sec as a float

  useFrameDisplay?: boolean;
  frameRange?: [number, number];

  onTimelineSeek?: (seekTime: number, seekFrameIndex?: number) => void;
  onTimelineCapture?: (captured: boolean) => void; // user mouse down / touch start on timeline
  onPointerMove?: (e: any) => void; // user enter the timeline

  themeColor?: string;
}

// the millesec of delay between emitting scrubbing updates.
const SCRUB_UPDATE_DELAY = 5;

const Timeline: React.FC<TimelineProps> = ({
  frameRange,
  useFrameDisplay = false,
  themeColor = 'indigo',

  ...props
}) => {
  const progressDisplayTimeoutRef = useRef<number | null>(null);
  const timelineRef = React.createRef<HTMLInputElement>();

  const [innerCaptured, setInnerCaptured] = useState<boolean>(false);
  const [seekPercentage, setSeekPercentage] = useState<number>(0);

  const playPercentage = props.currentTime / props.duration; // actual percentage

  // display perentage as adjust at frame discret increment steps.
  let displayPlayPercentage = playPercentage;
  let oneFramePercent = 0;
  let frameDuration = -1;
  let frameIndex = -1;

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

  if (innerCaptured) {
    displayPlayPercentage = seekPercentage;
  }

  React.useEffect(() => {
    return () => {
      if (progressDisplayTimeoutRef.current !== null) {
        window.clearTimeout(progressDisplayTimeoutRef.current);
      }
    };
  }, []);

  const handleScrubStart = (event: any) => {
    handleScrubMove(event);
    if (props.onTimelineCapture) {
      props.onTimelineCapture(true);
      setInnerCaptured(true);
    }
  };

  const handleScrubEnd = (event: any) => {
    handleScrubMoveFinish(event);
    if (props.onTimelineCapture) {
      props.onTimelineCapture(false);
      setInnerCaptured(false);
    }
  };

  /**
   * User as moved the playhead either by
   * 1) selected the thumb and moving it
   * 2) click anywhere on the timeline.
   */
  const handleScrubMove = (e: any) => {
    const isPointerEvent = e.type && e.type.startsWith('pointer');
    const isPointerMoveEvent = e.type && e.type === 'pointermove';
    const isPointerDownEvent = e.type && e.type === 'pointerdown';

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

    // have the canvas capture the mouse events until it's released
    if (isPointerDownEvent) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // const frameLength = absoluteRanges[absoluteRanges.length - 1][1];
    const bounds = timelineRef.current!.getBoundingClientRect();
    const totalWidth = bounds.width;

    let offset =
      (isPointerEvent ? e.pageX : e.touches[0].clientX) - bounds.left;
    offset = Math.max(0, Math.min(offset, totalWidth));

    const _seekPercentage = offset / totalWidth;
    setSeekPercentage(_seekPercentage);
    const seekTime = _seekPercentage * props.duration;
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

  const handleScrubMoveFinish = (e: any) => {
    const isPointerEvent = e.type && e.type.startsWith('pointer');

    // have the canvas capture the mouse events until it's released
    if (isPointerEvent) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const playHead = (
    <>
      {/* <div
        className="timeline__track__playhead"
        style={{
          left: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
        }}
      /> */}
      <div
        className="timeline__track__playhead__text"
        style={{
          left: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
        }}
      >
        {frameIndex !== -1 ? frameIndex : ''}
      </div>
    </>
  );

  return (
    <div className={classNames('timeline', props.className)}>
      <div
        ref={timelineRef}
        className="timeline__scrollzone"
        onPointerMove={handleScrubMove}
        onTouchMove={handleScrubMove}
        onPointerDown={handleScrubStart}
        onTouchStart={handleScrubStart}
        onPointerUp={handleScrubEnd}
        onTouchEnd={handleScrubEnd}
      >
        <div className="timeline__track">
          <div
            className="timeline__track__progress"
            style={{
              background: themeColor,
              width: `${(displayPlayPercentage + oneFramePercent) * 100}%`,
            }}
          />

          {playHead}
        </div>
      </div>
    </div>
  );
};

export default Timeline;