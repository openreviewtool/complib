import React, { useEffect } from 'react';
import { Slider } from '@mui/material';
import { UserControllerInputs } from '../types';

import './style.css';
import { usePreventDefaultBrowserTouch } from '../../../utils/browser';

export interface BrushToolsProps {
  uiState: UserControllerInputs;
  setUIState: (u: UserControllerInputs) => void;

  iconSize?: 'large' | 'medium' | 'small' | undefined;
  themeColor?: string;
  hide?: boolean;
}

const BrushTools = (props: BrushToolsProps) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  usePreventDefaultBrowserTouch(divRef);

  return (
    <div className="brush_tools" ref={divRef}>
      <div
        className={`brush_tools__display brush_tools__display-${
          props.hide ? 'hide' : 'show'
        }`}
      >
        <div className="brush_tools_bar">
          {props.uiState.shape === 'Textbox' ? (
            <Slider
              value={props.uiState.fontSize}
              orientation="vertical"
              min={5}
              max={100}
              onChange={(_evt, value) => {
                props.setUIState({
                  ...props.uiState,
                  fontSize: value as number,
                });
              }}
            />
          ) : (
            <Slider
              orientation="vertical"
              value={props.uiState.strokeWidth}
              onChange={(_evt, value) => {
                props.setUIState({
                  ...props.uiState,
                  strokeWidth: value as number,
                });
              }}
              min={1}
              max={50}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BrushTools;
