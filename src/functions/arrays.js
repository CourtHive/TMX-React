export function numArr(count) {
  return [...Array(count)].map((_, i) => i);
}
export function arrayOfLength(count) {
  return [...Array(count)].map((_, i) => i);
}
export function unique(arr) {
  return arr.filter((item, i, s) => s.lastIndexOf(item) === i);
}
export function generateRange(start, end) {
  return Array.from({ length: end - start }, (v, k) => k + start);
}
export function indices(val, arr) {
  return arr.reduce((a, e, i) => {
    if (e === val) a.push(i);
    return a;
  }, []);
}
export function arrayIndices(val, arr) {
  return arr.reduce((a, e, i) => {
    if (e === val) a.push(i);
    return a;
  }, []);
}
export function intersection(a, b) {
  return a.filter((n) => b.indexOf(n) !== -1).filter((e, i, c) => c.indexOf(e) === i);
}
export function safeArr(x) {
  return (Array.isArray(x) && x) || (typeof x === 'object' && Object.keys(x).map((k) => x[k])) || [];
}
export function randomPop(array) {
  return Array.isArray(array) && array.length
    ? array.splice(Math.floor(Math.random() * array.length), 1)[0]
    : undefined;
}
export function occurrences(val, arr) {
  return (
    arr.reduce((r, val) => {
      r[val] = 1 + r[val] || 1;
      return r;
    }, {})[val] || 0
  );
}
export function flatten(arr) {
  return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}
export function subSort(arr, i, n, sortFx) {
  return [].concat(...arr.slice(0, i), ...arr.slice(i, i + n).sort(sortFx), ...arr.slice(i + n, arr.length));
}
export function inPlaceSubSort(arr, i, n, sortFx) {
  const newarray = [].concat(...arr.slice(0, i), ...arr.slice(i, i + n).sort(sortFx), ...arr.slice(i + n, arr.length));
  arr.length = 0;
  arr.push.apply(arr, newarray);
  return arr;
}
export function chunkArray(arr, chunksize) {
  return arr.reduce((all, one, i) => {
    const ch = Math.floor(i / chunksize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
}
export function randomMember(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
