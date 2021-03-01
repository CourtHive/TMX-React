function getWindow() {
  try {
    return window;
  } catch (e) {
    return undefined;
  }
}

export function isDev() {
  return getWindow().dev && typeof getWindow().dev === 'object';
}
