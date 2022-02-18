import { AnnotateElement } from '../..';
import { TimedSketch } from '../../component/core/AnnotateCanvas/types';
import { v4 as uuid4 } from 'uuid';

export const sampleRectElement: AnnotateElement = {
  id: 'rect1_id',
  etype: 'Rect',
  transformMatrix: [1, 0, 0, 1, 100, 100],

  fill: '',
  stroke: 'pink',
  strokeWidth: 37,

  width: 100,
  height: 100,
};

export const sampleRectElement2: AnnotateElement = {
  ...sampleRectElement,
  id: 'rect2_id',
  stroke: 'Indigo',
  strokeWidth: 19,
  transformMatrix: [1, 0, 0, 1, 180, 140],
  width: 150,
  height: 100,
};

export const samplePathElement: AnnotateElement = {
  id: 'path_id',
  etype: 'Path',
  transformMatrix: [1, 0, 0, 1, 290, 150],

  stroke: 'DodgerBlue',
  strokeWidth: 4,
  fill: '',

  path: 'M 0 0 L 200 100 L 170 200 z',
};

export const samplePathElement2: AnnotateElement = {
  id: 'path_id2',
  etype: 'Path',
  transformMatrix: [1, 0, 0, 1, 600, 300],

  stroke: 'Coral',
  strokeWidth: 20,
  fill: '',

  path: [
    ['M', 684.8225588271229, 131.7986117006109],
    [
      'Q',
      617.1981542846981,
      131.7986117006109,
      603.3285328400982,
      131.7986117006109,
    ],
    [
      'Q',
      558.2522631451483,
      159.53246825369084,
      555.6517091242858,
      162.99920032282583,
    ],
    [
      'Q',
      546.1163443811234,
      178.5994946339333,
      546.1163443811234,
      179.46617765121704,
    ],
    [
      'Q',
      544.3826417005483,
      188.99969084133826,
      544.3826417005483,
      192.46642291047326,
    ],
    [
      'Q',
      553.0511551034234,
      216.7335473944182,
      558.2522631451484,
      221.93364549812068,
    ],
    [
      'Q',
      745.4921526472477,
      303.401849122793,
      747.2258553278227,
      305.13521515736045,
    ],
    [
      'Q',
      759.3617740918477,
      332.8690717104404,
      759.3617740918477,
      333.7357547277241,
    ],
    [
      'Q',
      736.8236392443728,
      365.8030263672226,
      733.3562338832228,
      367.53639240179024,
    ],
    [
      'Q',
      670.942937382523,
      374.46985654006016,
      664.8749780005105,
      374.46985654006016,
    ],
    [
      'Q',
      589.4589113954983,
      358.86956222895276,
      585.9915060343483,
      357.13619619438526,
    ],
    ['L', 553.0411551034234, 329.3923396413053],
  ],
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
  transformMatrix: [1, 0, 0, 1, 300, 400],

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
    sketch: [
      sampleCircleElement,
      sampleRectElement,
      { ...sampleTextboxElement, text: 'Annotate!' },
    ],
  },
  {
    time: 1100,
    id: 'sketch_1',
    sketch: [
      samplePathElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '1100' },
    ],
  },
  {
    time: 1200,
    id: 'sketch_1a',
    sketch: [
      sampleRectElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '1200' },
    ],
  },
  {
    time: 3600,
    id: 'sketch_2',
    sketch: [
      { ...sampleRectElement2, id: `rect_${uuid4()}` },
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '3600' },
    ],
  },
];

const mediaAnnotate3: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [
      sampleCircleElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: 'Dance!' },
    ],
  },
  {
    time: 4500,
    id: 'sketch_1',
    sketch: [
      samplePathElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '4500' },
    ],
  },
  {
    time: 9050,
    id: 'sketch_3',
    sketch: [
      sampleRectElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '9050' },
    ],
  },
];

const mediaAnnotate2: TimedSketch[] = [
  {
    time: 0,
    id: 'sketch_0',
    sketch: [
      sampleCircleElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: 'Draw!' },
    ],
  },
  {
    time: 1100,
    id: 'sketch_1',
    sketch: [
      samplePathElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '1100' },
    ],
  },
  {
    time: 2000,
    id: 'sketch_2',
    sketch: [
      sampleRectElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '2000' },
    ],
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
    sketch: [
      samplePathElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '1100' },
    ],
  },
  {
    time: 5000,
    id: 'sketch_2',
    sketch: [
      sampleRectElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '5000' },
    ],
  },
];

const mediaAnnotate5: TimedSketch[] = [
  {
    time: 1000,
    id: 'sketch_0',
    sketch: [sampleCircleElement, { ...sampleTextboxElement, text: 'Listen!' }],
  },
  {
    time: 2100,
    id: 'sketch_1',
    sketch: [
      samplePathElement,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '1100' },
    ],
  },
  {
    time: 5000,
    id: 'sketch_2',
    sketch: [
      sampleRectElement2,
      { ...sampleTextboxElement, id: `text_${uuid4()}`, text: '5000' },
    ],
  },
];

export const sampleMediaAnnotateList = [
  mediaAnnotate,
  mediaAnnotate2,
  mediaAnnotate3,
  mediaAnnotate4,
  mediaAnnotate5,
];
