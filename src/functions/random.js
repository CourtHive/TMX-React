export function biasedBinary(bias = 0.5) {
  return Math.random() > bias ? 1 : 0;
}
