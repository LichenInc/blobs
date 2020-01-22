import { rad } from "./unit.js";
// Translates a point's [x,y] cartesian coordinates into values relative to the viewport.
// Translates the angle from degrees to radians and moves the start angle a half rotation.
export const interpolate = (point, height) => {
    const handles = point.handles || { angle: 0, out: 0, in: 0 };
    //  * Math.random(0,1) / Math.E
    handles.angle = Math.PI + rad(handles.angle);
    return {
        x: point.x,
        y: height - point.y,
        handles,
    };
};
