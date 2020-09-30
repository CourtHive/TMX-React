import Axios from "axios";
import { encode } from "base64-arraybuffer";

export async function getFromURL(imageURL: string) {
  const resp = await Axios({
    url: imageURL,
    method: "GET",
    responseType: "arraybuffer",
  });

  if (!resp || resp.status !== 200) {
    throw new Error(`Response error for image: ${imageURL}`);
  }

  let contentType: string | undefined = resp.headers["content-type"];
  if (contentType) contentType = contentType.trim();

  const encodedImage = encode(resp.data);
  if (!encodedImage) throw new Error(`No image data received for: ${imageURL}`);

  return `data:${contentType || "image/png"};base64,${encodedImage}`;
}
