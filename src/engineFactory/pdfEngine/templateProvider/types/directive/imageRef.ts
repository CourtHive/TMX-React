import { ImageRefType } from "./enums/imageRefType";

export interface ImageRef {
  type: ImageRefType;
  name: string;
  b64Data?: string;
  url?: string;
}
