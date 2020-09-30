// eslint-disable-next-line
export function clearHistory() { history.pushState('', document.title, getWindow().location.pathname); };

export function getWindow() {
  try {
    return window;
  } catch (e) {
    return undefined;
  }
}

export function getNavigator() {
  try {
    return navigator || window.navigator;
  } catch (e) {
    return undefined;
  }
}
