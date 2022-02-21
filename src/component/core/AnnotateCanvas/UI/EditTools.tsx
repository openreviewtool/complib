import React, { useEffect, useRef, useState } from 'react';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import Circle from '@mui/icons-material/Circle';
import RectangleOutlined from '@mui/icons-material/RectangleOutlined';
import HighlightAltOutlined from '@mui/icons-material/HighlightAltOutlined';
import PanToolOutlined from '@mui/icons-material/PanTool';
import Create from '@mui/icons-material/Create';
import TextFields from '@mui/icons-material/Title';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import PasteIcon from '@mui/icons-material/ContentPaste';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import { UserControllerInputs } from '../types';
import { SketchPicker, ColorResult } from 'react-color';

import { IconButton } from '@mui/material';

import './style.css';
import { usePreventDefaultBrowserTouch } from '../../../utils/browser';

export interface EditToolsProps {
  uiState: UserControllerInputs;
  setUIState: (u: UserControllerInputs) => void;

  iconSize?: 'large' | 'medium' | 'small' | undefined;
  themeColor?: string;

  onAddKey?: () => void;
  disableAddKey?: boolean;

  onRemoveKey?: () => void;
  disableRemoveKey?: boolean;

  onDeleteSelection?: () => void;
  disableDeleteSelection?: boolean;

  onFitScreen?: () => void;
  disableFitScreen?: boolean;

  onCopy?: () => void;
  disableCopy?: boolean;

  onPaste?: () => void;
  disablePaste?: boolean;

  hide?: boolean;
}

const colorPickerStyles = {
  default: {
    picker: {
      background: '#222e',
      backdropFilter: 'blur(3px)',
      borderRadius: '10px 10px 10px 10px',
      border: '0px',
      boxShadow: undefined,
    },
  },
};

const colorResultToString = (v: ColorResult) => {
  return `${v.hex}${Math.round(v.rgb.a! * 255)
    .toString(16)
    .padStart(2, '0')}`;
};

const EditTools: React.FC<EditToolsProps> = ({
  uiState,
  setUIState,
  themeColor = '#fff7',
  iconSize = 'large',
  ...props
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  usePreventDefaultBrowserTouch(divRef, 'touchmove');

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState('');

  const { mode, shape, showAnnotation } = uiState;

  useEffect(() => {
    if (showColorPicker) {
      setTempColor(uiState.color);
    }
  }, [showColorPicker]);

  return (
    <div className="edit_tools" ref={divRef}>
      <div
        className={`edit_tools__display edit_tools__display-${
          props.hide ? 'hide' : 'show'
        }`}
      >
        {showColorPicker && (
          <div
            onPointerDown={() => {
              setShowColorPicker(false);
            }}
            onTouchStart={() => {
              setShowColorPicker(false);
            }}
            style={{
              pointerEvents: 'auto',
              position: 'fixed',
              top: '0px',
              left: '0px',
              right: '0px',
              bottom: '0px',
            }}
          />
        )}
        <div className={'edit_tools_bar'}>
          <IconButton
            size={iconSize}
            style={{ color: showAnnotation ? themeColor : 'red' }}
            onPointerDown={() => {
              setUIState({
                ...uiState,
                showAnnotation: !uiState.showAnnotation,
              });
            }}
            title="Show/Hide Annotation"
          >
            {showAnnotation ? <Visibility /> : <VisibilityOff />}
          </IconButton>
          {props.onAddKey && (
            <IconButton
              size={iconSize}
              style={{
                color: themeColor,
                opacity: props.disableAddKey ? 0.2 : 1.0,
              }}
              disabled={props.disableAddKey}
              onPointerDown={props.onAddKey}
              title="Add Key"
            >
              <AddIcon />
            </IconButton>
          )}
          {props.onRemoveKey && (
            <IconButton
              size={iconSize}
              style={{
                color: themeColor,
                opacity: props.disableRemoveKey ? 0.2 : 1.0,
              }}
              disabled={props.disableRemoveKey}
              onPointerDown={props.onRemoveKey}
              title="Remove Key"
            >
              <RemoveIcon />
            </IconButton>
          )}

          {props.onDeleteSelection && (
            <IconButton
              size={iconSize}
              style={{
                color: themeColor,
                opacity: props.disableDeleteSelection ? 0.2 : 1.0,
              }}
              disabled={props.disableDeleteSelection}
              onPointerDown={props.onDeleteSelection}
              title="Delete Selected"
            >
              <DeleteIcon />
            </IconButton>
          )}
          {props.onCopy && <div className="icon_divider" />}
          {props.onCopy && (
            <IconButton
              size={iconSize}
              style={{
                color: themeColor,
                opacity: props.disableCopy ? 0.2 : 1.0,
              }}
              disabled={props.disableCopy}
              onPointerDown={props.onCopy}
              title="Copy Selected"
            >
              <CopyIcon />
            </IconButton>
          )}
          {props.onPaste && (
            <IconButton
              size={iconSize}
              style={{
                color: themeColor,
                opacity: props.disablePaste ? 0.2 : 1.0,
              }}
              disabled={props.disablePaste}
              onPointerDown={props.onPaste}
              title="Paste"
            >
              <PasteIcon />
            </IconButton>
          )}
          <div className="icon_divider" />
          <IconButton
            color={mode === 'selection' ? 'primary' : undefined}
            size={iconSize}
            style={{ color: mode !== 'selection' ? themeColor : undefined }}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'selection' });
            }}
            title="Selection"
          >
            <HighlightAltOutlined />
          </IconButton>
          <IconButton
            color={mode === 'draw' && shape === 'Path' ? 'primary' : undefined}
            size={iconSize}
            style={{
              color: !(mode === 'draw' && shape === 'Path')
                ? themeColor
                : undefined,
            }}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'draw', shape: 'Path' });
            }}
            title="Pen"
          >
            <Create />
          </IconButton>
          <IconButton
            color={
              mode === 'draw' && shape === 'Ellipse' ? 'primary' : undefined
            }
            style={{
              color: !(mode === 'draw' && shape === 'Ellipse')
                ? themeColor
                : undefined,
            }}
            size={iconSize}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'draw', shape: 'Ellipse' });
            }}
            title="Ellipse"
          >
            <CircleOutlined />
          </IconButton>
          <IconButton
            color={mode === 'draw' && shape === 'Rect' ? 'primary' : undefined}
            style={{
              color: !(mode === 'draw' && shape === 'Rect')
                ? themeColor
                : undefined,
            }}
            size={iconSize}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'draw', shape: 'Rect' });
            }}
            title="Rectangle"
          >
            <RectangleOutlined />
          </IconButton>
          <IconButton
            color={
              mode === 'draw' && shape === 'Textbox' ? 'primary' : undefined
            }
            style={{
              color: !(mode === 'draw' && shape === 'Textbox')
                ? themeColor
                : undefined,
            }}
            size={iconSize}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'draw', shape: 'Textbox' });
            }}
            title="Text"
          >
            <TextFields />
          </IconButton>
          <IconButton
            style={{ color: uiState.color, opacity: 1.0 }}
            size={iconSize}
            onPointerDown={() => setShowColorPicker(true)}
            title="Color"
          >
            <Circle />
          </IconButton>
          <IconButton
            color={mode === 'panZoom' ? 'primary' : undefined}
            style={{
              color: !(mode === 'panZoom') ? themeColor : undefined,
            }}
            size={iconSize}
            onPointerDown={() => {
              setUIState({ ...uiState, mode: 'panZoom' });
            }}
            title="Panzoom"
          >
            <PanToolOutlined fontSize={'medium'} />
          </IconButton>
          {props.onFitScreen && (
            <IconButton
              disabled={props.disableFitScreen}
              style={{
                color: themeColor,
                opacity: props.disableFitScreen ? 0.2 : 1.0,
              }}
              size={iconSize}
              onPointerDown={props.onFitScreen}
              title="Fit Content"
            >
              <FitScreenIcon />
            </IconButton>
          )}
          <div
            style={{
              display: showColorPicker ? 'block' : 'none',
              position: 'absolute',
              top: '55px',
              right: '0px',
            }}
          >
            <SketchPicker
              color={tempColor}
              styles={colorPickerStyles}
              onChange={(v) => {
                setTempColor(colorResultToString(v));
              }}
              onChangeComplete={(v) => {
                setUIState({
                  ...uiState,
                  color: colorResultToString(v),
                });
              }}
              presetColors={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTools;
