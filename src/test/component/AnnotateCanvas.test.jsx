import React from 'react';
import { render } from '@testing-library/react';

import AnnotateCanvas from '../../component/AnnotateCanvas';
import { sampleAnnotations2, sampleTextboxElement } from '../../stories/testdata/annotationSamples';
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
    }
  };
});

let testFCanvas = null

// create a pointer to the underlying fabric canvas.
fabric.Canvas.mockImplementation((id, attr)=>{
  testFCanvas = new fabric.CanvasOri('', attr);
  return testFCanvas;
}) 

describe('Annotate Canvas', () => {
  beforeEach = ()=> {
    testFCanvas.clear();
  }

  it('should initialize', async () => {
    const { container } = render(
      <AnnotateCanvas
        width={1000}
        height={500}
        backgroundColor="#112233"
      />,
    );

    expect(testFCanvas.width).toEqual(1000)
    expect(testFCanvas.height).toEqual(500)
    expect(testFCanvas.backgroundColor).toEqual("#112233")
  });

  it('should draw elements.', async () => {
    const { container } = render(
      <AnnotateCanvas
        elements={sampleAnnotations2}
      />,
    );
    
    await new Promise((r) => setTimeout(r, 10));
    const objs = testFCanvas.getObjects();
    expect(objs.length).toEqual(sampleAnnotations2.length)
    expect(objs.map(x=>x.id)).toEqual(sampleAnnotations2.map(x=>x.id))
    expect(objs.map(x=>x.eType)).toEqual(sampleAnnotations2.map(x=>x.eType))
  });

  it('should draw text element.', async () => {
    const { container } = render(
      <AnnotateCanvas
        elements={[sampleTextboxElement]}
      />,
    );
    
    await new Promise((r) => setTimeout(r, 10));
    const allObjs = testFCanvas.getObjects();
    expect(allObjs.length).toEqual(1);
    expect(allObjs[0].perPixelTargetFind).toEqual(FabricObjectDefaults.perPixelTargetFind);
    expect(allObjs[0].uniformScaling).toEqual(FabricObjectDefaults.uniformScaling);
    expect(allObjs[0].text).toEqual(sampleTextboxElement.text);

  });

});
