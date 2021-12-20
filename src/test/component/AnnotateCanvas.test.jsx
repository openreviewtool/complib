import React from 'react';
import { render } from '@testing-library/react';

import AnnotateCanvas from '../../component/AnnotateCanvas';
import {
  sampleAnnotations,
  samplePathElement,
  sampleRectElement,
  sampleTextboxElement,
} from '../../stories/testdata/annotationSamples';
import { fabric } from 'fabric';
import { FabricObjectDefaults } from '../../component/AnnotateCanvas/defaults';

const sleep = async (msec) => {
  await new Promise((r) => setTimeout(r, msec));
};

/**
 * Mock the fabric canvas module.
 */
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

/**
 * Mock render
 */
jest.mock('@testing-library/react', () => {
  const originalModule = jest.requireActual('@testing-library/react');

  return {
    __esModule: true,
    ...originalModule,
    render: async (comp) => {
      const { rerender, ...others } = originalModule.render(comp);

      const rerenderWithSleep = async (comp) => {
        const rerenderResult = rerender(comp);
        await sleep(0);
        return rerenderResult;
      };
      await sleep(0);
      return { rerender: rerenderWithSleep, ...others };
    },
  };
});

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

  it('should initialize with elements.', async () => {
    await render(<AnnotateCanvas elements={sampleAnnotations} />);

    const objs = testFCanvas.getObjects();
    expect(objs.length).toEqual(sampleAnnotations.length);
    expect(objs.map((x) => x.id)).toEqual(sampleAnnotations.map((x) => x.id));
    expect(objs.map((x) => x.eType)).toEqual(
      sampleAnnotations.map((x) => x.eType),
    );
  });

  it('should init text element.', async () => {
    await render(<AnnotateCanvas elements={[sampleTextboxElement]} />);

    const allObjs = testFCanvas.getObjects();
    expect(allObjs.length).toEqual(1);
    // expect(allObjs[0].perPixelTargetFind).toEqual(
    //   FabricObjectDefaults.perPixelTargetFind,
    // );
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
    [
      [30, 20],
      [100, 120],
      'Textbox',
      '#123',
      1,
      {
        text: 'Hello',
        fill: '#123',
        stroke: '',
        strokeWidth: 0,
      },
    ],
  ])(
    'should draw at coords: %o %o, shape: %s, color: %s, stroke: %i, results: %o',
    async (p0, p1, shape, color, strokeWidth, outExtra) => {
      const addElementHandler = jest.fn();
      await render(
        <AnnotateCanvas
          onAddElement={addElementHandler}
          uiState={{
            mode: 'draw',
            text: 'Hello',
            shape,
            color,
            strokeWidth,
          }}
        />,
      );

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

      let result = {
        stroke: color,
        strokeWidth,
        fill: '',
        top: p0[1],
        left: p0[0],
      };
      if (shape !== 'Textbox') {
        result = {
          ...result,
          width: p1[0] - p0[0],
          height: p1[1] - p0[1],
        };
      }
      expect(addElementHandler).toBeCalledWith(
        shape,
        expect.objectContaining({ ...result, ...outExtra }),
      );
    },
  );

  it('should draw path', async () => {
    const addElementHandler = jest.fn();
    await render(<AnnotateCanvas onAddElement={addElementHandler} />);

    const pathObj = new fabric.Path(samplePathElement.path, {
      strokeLineCap: 'round',
      ...FabricObjectDefaults,
      stroke: '#321',
    });

    await testFCanvas.fire('path:created', { path: pathObj });

    expect(addElementHandler).toBeCalled();
    expect(addElementHandler).toBeCalledWith(
      'Path',
      expect.objectContaining({
        path: [['M', 0, 0], ['L', 200, 100], ['L', 170, 200], ['z']],
        height: 200,
        width: 200,
        stroke: '#321',
      }),
    );
  });
});

describe('AnnotateCanvas Move Element', () => {
  it('should move element', async () => {
    const changeElementHandler = jest.fn();
    await render(
      <AnnotateCanvas
        elements={[sampleRectElement]}
        onChangeElement={changeElementHandler}
      />,
    );

    const rect = testFCanvas.getObjects()[0];
    await testFCanvas.fire('object:modified', { target: rect });

    expect(changeElementHandler).toBeCalled();
    expect(changeElementHandler).toBeCalledWith({
      id: sampleRectElement.id,
      transformMatrix: sampleRectElement.transformMatrix,
    });
  });
});

describe('AnnotateCanvas Apply Properties to Selected Element', () => {
  it('should apply properties element', async () => {
    const changeElementHandler = jest.fn();
    const elements = [sampleRectElement, samplePathElement];
    const uiState = {};
    const { rerender } = await render(
      <AnnotateCanvas
        elements={elements}
        onChangeElement={changeElementHandler}
        uiState={uiState}
        selection={[]}
      />,
    );

    // select something
    await rerender(
      <AnnotateCanvas
        elements={elements}
        onChangeElement={changeElementHandler}
        uiState={uiState}
        selection={[sampleRectElement.id]}
      />,
    );

    // apply red as color
    uiState.color = 'red';
    await rerender(
      <AnnotateCanvas
        elements={elements}
        onChangeElement={changeElementHandler}
        uiState={uiState}
        selection={[sampleRectElement.id]}
      />,
    );

    expect(changeElementHandler).toBeCalledWith({
      id: sampleRectElement.id,
      stroke: 'red',
    });

    // apply strokeWidth
    uiState.strokeWidth = 50;
    await rerender(
      <AnnotateCanvas
        elements={elements}
        onChangeElement={changeElementHandler}
        uiState={uiState}
        selection={[sampleRectElement.id]}
      />,
    );

    expect(changeElementHandler).toBeCalledWith({
      id: sampleRectElement.id,
      strokeWidth: 50,
    });
  });
});
