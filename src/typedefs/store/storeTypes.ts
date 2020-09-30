import { TmxInterface } from 'typedefs/store/tmxTypes';

// TODO: this is the main global store type which should contain all store types
// Most of the types are unknown at the moment so they should be gradually added as the development progresses
export interface GlobalStoreInterface {
  tmx: TmxInterface;
}
