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
  const elementIndexById = state.reduce((a: { [id: string]: number }, v, i) => {
    a[v.id] = i;
    return a;
  }, {});

  const updatedElements = [...state];

  switch (action.type) {
    case 'addElement':
      if (!action.newElement.id) {
        throw Error(
          `Unexpected add element with no new id: ${action.newElement}`,
        );
      }
      return [...state, action.newElement];

    case 'changeElement':
      action.elementUpdates.forEach((updates) => {
        const index = elementIndexById[updates.id!];
        // this goes against the conventions of react, to directly manipulate
        // the state, that because the changes has already done to the elements
        // and we dont' want to trigger a re-render.
        state[index] = { ...updatedElements[index], ...updates };
        // updatedElements[index] = {...updatedElements[index], ...updates}
      });

      // return updatedElements
      return state;

    case 'removeElements':
      // ToDo: update this now that there is a elemetIndexById look up.
      const removeIndex = state.reduce((a, c, index) => {
        if (action.ids.indexOf(c.id) !== -1) {
          a.push(index);
        }
        return a;
      }, [] as number[]);

      removeIndex.reverse().forEach((removeIndex) => {
        updatedElements.splice(removeIndex, 1);
      });

      return updatedElements;

    case 'updateSketch':
      return action.sketch;
  }
}
