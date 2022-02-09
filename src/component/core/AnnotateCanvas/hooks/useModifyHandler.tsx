import React from 'react';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { AnnotateElement, fObjExtend } from './../types';

function useModifyHandler(
  fabricCanvasRef: React.MutableRefObject<fabric.Canvas>,
  onChangeElement?: (elementUpdates: Partial<AnnotateElement>[]) => void,
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

      if (onChangeElement) {
        const changeBatch: Partial<AnnotateElement>[] = [];
        selection.forEach((obj) => {
          const updates: Partial<AnnotateElement> = {
            transformMatrix: obj.calcTransformMatrix(),
          };
          const fObj = obj as fObjExtend;
          if (fObj.etype === 'Textbox') {
            updates.text = fObj.text;
            updates.width = fObj.width;
          }
          changeBatch.push({ id: fObj.id, ...updates });
        });
        onChangeElement(changeBatch);
      }
    }
  };
}

export default useModifyHandler;
