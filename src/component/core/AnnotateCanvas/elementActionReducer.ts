import { ElementsAction, AnnotateElement } from './types';

/**
 * The reducers captures all the element events, with the aim to sync to another user.
 * @param state All the elements on the canvas
 * @param action The action.
 * @returns Updated set of elements on the canvas
 */
export default function elementsActionReducer(
  state: AnnotateElement[],
  action: ElementsAction,
): AnnotateElement[] {
  switch (action.type) {
    case 'addElement':
      if (!action.newElement.id) {
        throw Error(
          `Unexpected add element with no new id: ${action.newElement}`,
        );
      }
      return [...state, action.newElement];

    case 'changeElement':
      return state.map((element) => {
        if (element.id === action.elementUpdates.id) {
          return { ...element, ...action.elementUpdates };
        } else {
          return element;
        }
      });

    case 'removeElement':
      const removeIndex = state.reduce((a, c, index) => {
        if (action.removeIds.indexOf(c.id) !== -1) {
          a.push(index);
        }
        return a;
      }, [] as number[]);

      const updatedElements = [...state];
      removeIndex.reverse().forEach((removeIndex) => {
        updatedElements.splice(removeIndex, 1);
      });

      return updatedElements;
  }
}
