export const getMouse = (event) => {
  return { x: event.clientX, y: event.clientY, pageX: event.pageX, pageY: event.pageY };
};
