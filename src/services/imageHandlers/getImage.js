import { env } from 'config/defaults';
import { db } from 'services/storage/db';

export function getLogo() {
  let imageRoot = env.assets.imageRoot;
  let imageFile = env.assets.pdf.logoImage || 'courthive.png';
  return getImage({ key: 'orgLogo', path: `${imageRoot}${imageFile}` });
}

export function getName() {
  let imageRoot = env.assets.imageRoot;
  let imageFile = env.assets.pdf.nameImage || 'courthive.png';
  return getImage({ key: 'orgName', path: `${imageRoot}${imageFile}` });
}

function getImage({ key, path }) {
  return new Promise((resolve, reject) => {
     db.findSetting(key).then(checkLogo, console.log);
     function checkLogo(logo) {
        if (logo && logo.image && logo.image.indexOf('image') >= 0) {
           return resolve(logo.image);
        } else {
           getDataUri(path).then(resolve, reject);
        }
     }
  });
}

function getDataUri(url) {
  return new Promise(resolve => {
     var image = new Image();

     image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        canvas.getContext('2d').drawImage(this, 0, 0);

        resolve(canvas.toDataURL('image/png'));
     };

     image.src = url;
  });
}
