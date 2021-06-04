import { ArcModelEventTypes } from '@advanced-rest-client/arc-events';
import { oneEvent } from '@open-wc/testing';

export async function resetSelection() {
  const model = document.querySelector('variables-model');
  if (model.currentEnvironment) {
    model.currentEnvironment = null;
    await oneEvent(window, ArcModelEventTypes.Environment.State.select);
  }
}
