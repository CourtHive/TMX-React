export function getActionPanelBounds(ref) {
  const boundingClient = ref?.current?.getBoundingClientRect();
  const top = boundingClient?.top + window.scrollY;
  const height = boundingClient?.height;
  const width = boundingClient?.width;
  const bounds = { top, height, width };

  const values = {
    elementDimensions: {
      top: bounds?.top,
      height: bounds?.height,
      width: bounds?.width
    },
    style: {
      zIndex: 1,
      position: 'absolute',
      backgroundColor: '#F5F5F5',
      borderRadius: '3px 3px 0 0',
      top: `${bounds?.top || 0}px`,
      height: `${bounds?.height || 0}px`,
      width: `${bounds?.width || 0}px`
    }
  }
  return values;
}
