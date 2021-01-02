import { tmxStore } from 'stores/tmxStore';

export function resizeDraw({ structure }) {
  if (!structure) return;
  tmxStore.dispatch({ type: 'draw resize event' });
}
