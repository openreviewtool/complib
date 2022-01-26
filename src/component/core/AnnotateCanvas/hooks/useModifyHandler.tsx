import React from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { AnnotateElement, fObjExtend } from './../types';

function useModifyHandler(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  onChangeElement?: (element: Partial<AnnotateElement>) => void,
): void {
  React.useEffect(() => {
    fabricCanvasRef.current.on('object:modified', handle_object_modified);
  }, []);

  const handle_object_modified = (event: IEvent) => {
    if (event.target) {
      let selection: fabric.Object[];
      if (event.target.hasOwnProperty('_objects')) {
        selection = (event.target as any)._objects;
      } else {
        selection = [event.target];
      }

      selection.forEach((obj) => {
        if (onChangeElement) {
          const updates: Partial<AnnotateElement> = {
            transformMatrix: obj.calcTransformMatrix(),
          };
          const fObj = obj as fObjExtend;
          if (fObj.etype === 'Textbox') {
            updates.text = fObj.text;
            updates.width = fObj.width;
          }
          onChangeElement({ id: fObj.id, ...updates });
        }
      });
    }
  };
}

export default useModifyHandler;
