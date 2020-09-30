export function attemptJSONparse(data) {
  if (!data) return undefined;
  try { return JSON.parse(data); }
  catch(e) { return undefined; }
}
