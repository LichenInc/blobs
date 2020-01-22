// Converts degrees to radians.
export const rad = (deg) => {
  return deg / 360 * 2 * Math.PI;
};

// Converts radians to degrees.
export const deg = (rad) => {
  return (((rad / Math.PI) * 1) / 2) * 360;
};
