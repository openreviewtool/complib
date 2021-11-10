import React from 'react';
import { render, waitFor } from '@testing-library/react';

import AnnotateCanvas from '../../component/AnnotateCanvas';
import {
  sampleAnnotations2,
  sampleTextboxElement,
} from '../../stories/testdata/annotationSamples';
import { fabric } from 'fabric';
import { FabricObjectDefaults } from '../../component/AnnotateCanvas/utils';

jest.mock('fabric', () => {
  const originalModule = jest.requireActual('fabric');

  return {
    __esModule: true,
    ...originalModule,
    fabric: {
      ...originalModule.fabric,
      Canvas: jest.fn(),
      CanvasOri: originalModule.fabric.Canvas,
    },
  };
});

let testFCanvas = null;

// create a pointer to the underlying fabric canvas.
fabric.Canvas.mockImplementation((id, attr) => {
  testFCanvas = new fabric.CanvasOri('', attr);
  testFCanvas.oriFire = testFCanvas.fire;
  testFCanvas.fire = async (eventName, eventData) => {
    testFCanvas.oriFire(eventName, eventData);
    await sleep(0);
  };
  return testFCanvas;
});

const sleep = async (msec) => {
  await new Promise((r) => setTimeout(r, msec));
};

describe('AnnotateCanvas Intialization', () => {
  beforeEach = () => {
    testFCanvas.clear();
  };

  it('should initialize', async () => {
    render(
      <AnnotateCanvas width={1111} height={555} backgroundColor="#112233" />,
    );

    expect(testFCanvas.width).toEqual(1111);
    expect(testFCanvas.height).toEqual(555);
    expect(testFCanvas.backgroundColor).toEqual('#112233');
  });

  it('should draw elements.', async () => {
    render(<AnnotateCanvas elements={sampleAnnotations2} />);

    await sleep();
    const objs = testFCanvas.getObjects();
    expect(objs.length).toEqual(sampleAnnotations2.length);
    expect(objs.map((x) => x.id)).toEqual(sampleAnnotations2.map((x) => x.id));
    expect(objs.map((x) => x.eType)).toEqual(
      sampleAnnotations2.map((x) => x.eType),
    );
  });

  it('should draw text element.', async () => {
    render(<AnnotateCanvas elements={[sampleTextboxElement]} />);

    await sleep();
    const allObjs = testFCanvas.getObjects();
    expect(allObjs.length).toEqual(1);
    expect(allObjs[0].perPixelTargetFind).toEqual(
      FabricObjectDefaults.perPixelTargetFind,
    );
    expect(allObjs[0].uniformScaling).toEqual(
      FabricObjectDefaults.uniformScaling,
    );
    expect(allObjs[0].text).toEqual(sampleTextboxElement.text);
  });
});

describe('AnnotateCanvas Mouse Draw', () => {
  it.each([
    [[10, 20], [100, 120], 'Rect', '#123', 1, {}],
    [[10, 30], [120, 240], 'Rect', '#321', 2, {}],
    [[30, 20], [100, 120], 'Ellipse', '#123', 1, { rx: 35, ry: 50 }],
  ])(
    'should draw at coords: %o %o, shape: %s, color: %s, stroke: %i, extra: %o',
    async (p0, p1, shape, color, strokeWidth, extraFields) => {
      const addElementHandler = jest.fn();
      render(
        <AnnotateCanvas
          onAddElement={addElementHandler}
          uiState={{
            mode: 'draw',
            shape,
            // fontSize: number,
            color,
            strokeWidth,
            // fontFamily: string;
          }}
        />,
      );

      await sleep();

      const downevt = new MouseEvent('mousedown', {
        clientX: p0[0],
        clientY: p0[1],
      });

      const moveevt = new MouseEvent('mousemove', {
        clientX: p1[0],
        clientY: p1[1],
      });

      await testFCanvas.fire('mouse:down', { e: downevt });
      await testFCanvas.fire('mouse:move', { e: moveevt });
      await testFCanvas.fire('mouse:up', {});

      expect(addElementHandler).toBeCalled();
      expect(addElementHandler).toBeCalledWith(
        shape,
        expect.objectContaining({
          width: p1[0] - p0[0],
          height: p1[1] - p0[1],
          color,
          top: p0[1],
          left: p0[0],
          strokeWidth,
          fill: '',
          ...extraFields,
        }),
      );
    },
  );
});


