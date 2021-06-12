import EventEmitter from 'wolfy87-eventemitter';
import { context } from '../context';

export function createEmitter() {
  if (!context.ee) {
    context.ee = new EventEmitter();
  }
}
