import { AnnotateElement } from '../..';
import { TimedSketch } from '../../component/core/AnnotateCanvas/types';

export const sampleRectElement: AnnotateElement = {
  id: 'rect1_id',
  etype: 'Rect',
  transformMatrix: [1, 0, 0, 1, 100, 100],

  fill: '',
  stroke: 'pink',
  strokeWidth: 7,

  width: 100,
  height: 100,
};

export const sampleRectElement2: AnnotateElement = {
  ...sampleRectElement,
  id: 'rect2_id',
  stroke: 'Indigo',
  strokeWidth: 9,
  transformMatrix: [1, 0, 0, 1, 180, 140],
  width: 150,
  height: 100,
};

export const samplePathElement: AnnotateElement = {
  id: 'path_id',
  etype: 'Path',
  transformMatrix: [1, 0, 0, 1, 290, 150],

  stroke: 'DodgerBlue',
  strokeWidth: 7,
  fill: '',

  path: 'M 0 0 L 200 100 L 170 200 z',
};

export const sampleCircleElement: AnnotateElement = {
  id: 'circle_id',
  etype: 'Circle',
  transformMatrix: [1, 0, 0, 1, 400, 200],

  radius: 150,
  fill: '',
  stroke: 'MediumSeaGreen',
  strokeWidth: 8,
};

export const sampleTextboxElement: AnnotateElement = {
  id: 'textbox_id',
  etype: 'Textbox',
  transformMatrix: [1, 0, 0, 1, 300, 200],

  text: 'hello, world!',
  fontSize: 50,
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

const mediaAnnotate: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: 'Annotate!' }],
  },
  {
    time: 1100,
    id: 'sketch_1',
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1100' }],
  },
  {
    time: 3600,
    id: 'sketch_2',
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '3600' }],
  },
];

const mediaAnnotate3: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: 'Dance!' }],
  },
  {
    time: 4500,
    id: 'sketch_1',
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '4500' }],
  },
  {
    time: 9050,
    id: 'sketch_3',
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '9050' }],
  },
];

const mediaAnnotate2: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: 'Draw!' }],
  },
  {
    time: 1100,
    id: 'sketch_1',
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1100' }],
  },
  {
    time: 2000,
    id: 'sketch_2',
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '2000' }],
  },
];

const mediaAnnotate4: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [
      sampleCircleElement,
      { ...sampleTextboxElement, text: 'Scribble!' },
    ],
  },
  {
    time: 1100,
    id: 'sketch_1',
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1100' }],
  },
  {
    time: 5000,
    id: 'sketch_2',
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '5000' }],
  },
];

const mediaAnnotate5: TimedSketch[] = [
  {
    time: 1000,
    id: 'sketch_0',
    sketch: [
      sampleCircleElement,
      { ...sampleTextboxElement, text: 'Listen!' },
    ],
  },
  {
    time: 2100,
    id: 'sketch_1',
    sketch: [samplePathElement, { ...sampleTextboxElement, text: '1100' }],
  },
  {
    time: 5000,
    id: 'sketch_2',
    sketch: [sampleRectElement2, { ...sampleTextboxElement, text: '5000' }],
  },
];

export const sampleMediaAnnotateList = [
  mediaAnnotate,
  mediaAnnotate2,
  mediaAnnotate3,
  mediaAnnotate4,
  mediaAnnotate5,
];