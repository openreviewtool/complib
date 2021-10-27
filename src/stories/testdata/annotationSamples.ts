import { AnnotateElement } from '../../component/AnnotateCanvas/types';

export const sampelAnnotations1: AnnotateElement[] = [
  {
    etype: 'Rect',
    width: 100,
    height: 100,
    strokeWidth: 3,
    stroke: 'darkblue',
    fill: '',
    transformMatrix: [1, 0, 0, 1, 100, 100],
    id: 'blue_rect_id',
  },
  { etype: 'Circle', radius: 50, fill: '', strokeWidth: 2, stroke: 'green', id: 'circle_green_id' },
];

export const sampleRectElement: AnnotateElement = {
  id: 'pink_rect_id',
  etype: 'Rect',
  transformMatrix: [1, 0, 0, 1, 100, 100],

  fill: '',
  stroke: 'pink',
  strokeWidth: 2,

  width: 100,
  height: 100,
};

export const sampleRectElement2: AnnotateElement = {
  ...sampleRectElement,
  id: 'blue_rect_id',
  stroke: 'skyblue',
  transformMatrix: [1, 0, 0, 1, 180, 140],
  width: 150,
  height: 100,
};

export const samplePathElement: AnnotateElement = {
  id: 'path_id',
  etype: 'Path',
  transformMatrix: [1, 0, 0, 1, 200, 200],

  stroke: 'DodgerBlue',
  strokeWidth: 3,
  fill: '',

  path: 'M 0 0 L 200 100 L 170 200 z',
};

export const sampleCircleElement: AnnotateElement = {
  id: 'circle_id',
  etype: 'Circle',
  transformMatrix: [1, 0, 0, 1, 50, 50],

  radius: 30,
  fill: '',
  stroke: 'MediumSeaGreen',
  strokeWidth: 5,
};

export const sampleTextboxElement: AnnotateElement = {
  id: 'textbox_id',
  etype: 'Textbox',
  transformMatrix: [1, 0, 0, 1, 200, 200],

  text: 'hello, world!',
  fontSize: 25,
  fontFamily: 'Times New Roman',
  fill: 'rgba(255,255,122,0.8)',

  width: 200,
};

export const sampleAnnotations2 = [sampleRectElement, sampleRectElement2, sampleCircleElement, 
  sampleTextboxElement, samplePathElement]; 
