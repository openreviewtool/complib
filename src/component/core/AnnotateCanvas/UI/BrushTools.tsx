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
}

const BrushTools = (props: BrushToolsProps) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  usePreventDefaultBrowserTouch(divRef);

  return (
    <div className="brush_tools" ref={divRef}>
      <div className="brush_tools_bar">
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
        {/* <div style={{ height: '80px' }} /> */}
        {/* <Slider orientation="vertical" defaultValue={30} min={1} max={100} /> */}
      </div>
    </div>
  );
};

export default BrushTools;
