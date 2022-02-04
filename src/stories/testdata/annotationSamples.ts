import { AnnotateElement } from '../..';

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
  transformMatrix: [1, 0, 0, 1, 300, 200],

  text: 'hello, world!',
  fontSize: 40,
  fontFamily: 'Times New Roman',
  fill: 'rgba(255,200,100,1)',

  width: 200,
};

export const sampleAnnotations: AnnotateElement[] = [
  sampleRectElement,
  sampleRectElement2,
  sampleCircleElement,
  sampleTextboxElement,
  samplePathElement,
];

const mediaAnnotate: { time: number; sketch: AnnotateElement[] }[] = [
  {
    time: 0,
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: '0' }],
  },
  {
    time: 1000,
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1000' }],
  },
  {
    time: 2000,
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '2000' }],
  }
];

const mediaAnnotate2 = [
  {
    time: 1000,
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: '1000' }],
  },
  {
    time: 1500,
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1500' }],
  },
  {
    time: 1750,
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '1750' }],
  }
];

const mediaAnnotate3 = [
  {
    time: 0,
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: '0' }],
  },
  {
    time: 1100,
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1100' }],
  },
  {
    time: 2000,
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '2000' }],
  }
]

export const sampleMediaAnnotateList = [
  mediaAnnotate,
  mediaAnnotate2,
  mediaAnnotate3,
];
