export function boolAttrs(optionsObject) {
  if (!optionsObject) return;
  var oKeys = Object.keys(optionsObject);
  for (var k = 0; k < oKeys.length; k++) {
    var oo = optionsObject[oKeys[k]];
    if (oo && typeof oo === 'object' && typeof oo !== 'function' && oo.constructor !== Array) {
      boolAttrs(optionsObject[oKeys[k]]);
    } else {
      if (oo && oo.toString().toLowerCase() === 'true') {
        optionsObject[oKeys[k]] = true;
      } else if (oo !== undefined && oo.toString().toLowerCase() === 'false') {
        optionsObject[oKeys[k]] = false;
      } else if (!isNaN(oo)) {
        optionsObject[oKeys[k]] = parseInt(oo);
      }
    }
  }
}

export function keyWalk(valuesObject, optionsObject) {
  if (!valuesObject || !optionsObject) return;
  var vKeys = Object.keys(valuesObject);
  var oKeys = Object.keys(optionsObject);
  for (var k = 0; k < vKeys.length; k++) {
    if (oKeys.indexOf(vKeys[k]) >= 0) {
      var oo = optionsObject[vKeys[k]];
      var vo = valuesObject[vKeys[k]];
      if (oo && typeof oo === 'object' && typeof vo !== 'function' && oo.constructor !== Array) {
        keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
      } else {
        optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
      }
    }
  }
}

export function fxAttrs(optionsObject) {
  if (!optionsObject) return;
  var oKeys = Object.keys(optionsObject);
  for (var k = 0; k < oKeys.length; k++) {
    var oo = optionsObject[oKeys[k]];
    if (typeof oo === 'object') {
      fxAttrs(optionsObject[oKeys[k]]);
    } else {
      if (oKeys[k] === 'fx' && typeof oo === 'string') {
        try {
          optionsObject.fx = createFx(optionsObject.fx);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

export function createFx(str) {
  var startBody = str.indexOf('{') + 1;
  var endBody = str.lastIndexOf('}');
  var startArgs = str.indexOf('(') + 1;
  var endArgs = str.indexOf(')');
  // eslint-disable-next-line
  return new Function(str.substring(startArgs, endArgs), str.substring(startBody, endBody));
}
