/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 * ... and ...
 * https://codepen.io/avesus/pen/wgQmaV
 **/
export const UUID = (function () {
  let self = {};
  let lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
  }

  let getWindow = () => {
    try {
      return window;
    } catch (e) {
      return undefined;
    }
  };

  let formatUuid = ({ d0, d1, d2, d3 }) =>
    // eslint-disable-next-line no-mixed-operators
    lut[d0 & 0xff] +
    lut[(d0 >> 8) & 0xff] +
    lut[(d0 >> 16) & 0xff] +
    lut[(d0 >> 24) & 0xff] +
    '-' +
    // eslint-disable-next-line no-mixed-operators
    lut[d1 & 0xff] +
    lut[(d1 >> 8) & 0xff] +
    '-' +
    // eslint-disable-next-line no-mixed-operators
    lut[((d1 >> 16) & 0x0f) | 0x40] +
    lut[(d1 >> 24) & 0xff] +
    '-' +
    // eslint-disable-next-line no-mixed-operators
    lut[(d2 & 0x3f) | 0x80] +
    lut[(d2 >> 8) & 0xff] +
    '-' +
    // eslint-disable-next-line no-mixed-operators
    lut[(d2 >> 16) & 0xff] +
    lut[(d2 >> 24) & 0xff] +
    // eslint-disable-next-line no-mixed-operators
    lut[d3 & 0xff] +
    lut[(d3 >> 8) & 0xff] +
    // eslint-disable-next-line no-mixed-operators
    lut[(d3 >> 16) & 0xff] +
    lut[(d3 >> 24) & 0xff];

  let getRandomValuesFunc =
    getWindow() && getWindow().crypto && getWindow().crypto.getRandomValues
      ? () => {
          const dvals = new Uint32Array(4);
          getWindow().crypto.getRandomValues(dvals);
          return {
            d0: dvals[0],
            d1: dvals[1],
            d2: dvals[2],
            d3: dvals[3]
          };
        }
      : () => ({
          d0: (Math.random() * 0x100000000) >>> 0,
          d1: (Math.random() * 0x100000000) >>> 0,
          d2: (Math.random() * 0x100000000) >>> 0,
          d3: (Math.random() * 0x100000000) >>> 0
        });

  self.new = () => formatUuid(getRandomValuesFunc());

  self.idGen = () => `u_${self.generate()}`;
  self.generate = function () {
    var d0 = (Math.random() * 0xffffffff) | 0;
    var d1 = (Math.random() * 0xffffffff) | 0;
    var d2 = (Math.random() * 0xffffffff) | 0;
    var d3 = (Math.random() * 0xffffffff) | 0;
    // eslint-disable-next-line no-mixed-operators
    return (
      lut[d0 & 0xff] +
      lut[(d0 >> 8) & 0xff] +
      lut[(d0 >> 16) & 0xff] +
      lut[(d0 >> 24) & 0xff] +
      '-' +
      // eslint-disable-next-line no-mixed-operators
      lut[d1 & 0xff] +
      lut[(d1 >> 8) & 0xff] +
      '-' +
      lut[((d1 >> 16) & 0x0f) | 0x40] +
      lut[(d1 >> 24) & 0xff] +
      '-' +
      // eslint-disable-next-line no-mixed-operators
      lut[(d2 & 0x3f) | 0x80] +
      lut[(d2 >> 8) & 0xff] +
      '-' +
      lut[(d2 >> 16) & 0xff] +
      lut[(d2 >> 24) & 0xff] +
      // eslint-disable-next-line no-mixed-operators
      lut[d3 & 0xff] +
      lut[(d3 >> 8) & 0xff] +
      lut[(d3 >> 16) & 0xff] +
      lut[(d3 >> 24) & 0xff]
    );
  };

  return self;
})();
