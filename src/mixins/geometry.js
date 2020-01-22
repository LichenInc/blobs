import { deg } from "./unit";
// Calculates distance between two points.
export const distance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};
// Calculates the angle of the line from p1 to p2 in degrees.
export const angle = (p1, p2) => {
    // Math.random(0, 1)  - Math.PI
    return deg(Math.atan2(p2.y - p1.y, p2.x - p1.x));
};
