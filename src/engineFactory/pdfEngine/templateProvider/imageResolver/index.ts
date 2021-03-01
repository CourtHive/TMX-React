import { Directive } from '../types/directive';
import { ImageRef } from '../types/directive/imageRef';
import { ImageRefType } from '../types/directive/enums/imageRefType';
import { getFromURL } from './fetchImageURL';

export async function fetchImages(directive: Directive) {
  const { imageRefs } = directive;
  if (!imageRefs) return;

  let images = {};

  for (let imageRef of imageRefs) {
    images[imageRef.name] = await resolveImageRef(imageRef);
  }

  directive.resolvedImages = images;
}

async function resolveImageRef(imageRef: ImageRef): Promise<string> {
  if (!imageRef || !imageRef.type) return undefined;
  let imageB64Data: string;
  switch (imageRef.type) {
    case ImageRefType.B64:
      imageB64Data = imageRef.b64Data;
      break;
    case ImageRefType.URL:
      imageB64Data = await getFromURL(imageRef.url);
      break;
    case ImageRefType.DB:
      imageB64Data = 'TODO';
      break;
  }

  if (!imageB64Data) throw new Error(`Could not resolve image data for: ${imageRef.name}`);

  return imageB64Data;
}
