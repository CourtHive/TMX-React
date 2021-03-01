export function fetchImages(directive) {
  return new Promise((resolve) => {
    const { imagRefs } = directive;
    let images = {};

    imagRefs.array.forEach((imageRef) => {
      images[imageRef.name] = resolveImageRef(imageRef);
    });

    resolve(images);
  });
}

function resolveImageRef(imageRef) {
  if (!imageRef || !imageRef.type) return undefined;

  switch (imageRef.type.trim().toLowerCase()) {
    case 'b64':
      return imageRef.data;
    case 'url':
      break;
    case 'db':
      break;
    default:
      return undefined;
  }
}
