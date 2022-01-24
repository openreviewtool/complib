import { AnnotateElement } from "../..";

export const sampleRectElement: AnnotateElement = {
  id: 'rect1_id',
  etype: 'Rect',
  transformMatrix: [1, 0, 0, 1, 100, 100],

  fill: '',
  stroke: 'pink',
  strokeWidth: 3,

  width: 100,
  height: 100,
};

export const sampleRectElement2: AnnotateElement = {
  ...sampleRectElement,
  id: 'rect2_id',
  stroke: 'Indigo',
  transformMatrix: [1, 0, 0, 1, 180, 140],
  width: 150,
  height: 100,
};

export const samplePathElement: AnnotateElement = {
  id: 'path_id',
  etype: 'Path',
  transformMatrix: [1, 0, 0, 1, 290, 150],

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
  transformMatrix: [1, 0, 0, 1, 150, 200],

  text: 'hello, world!',
  fontSize: 25,
  fontFamily: 'Times New Roman',
  fill: 'rgba(255,255,122,0.8)',

  width: 200,
};

export const sampleAnnotations = [
  sampleRectElement,
  sampleRectElement2,
  sampleCircleElement,
  sampleTextboxElement,
  samplePathElement,
];