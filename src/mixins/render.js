import {loopAccess} from "./utils.js";
import {interpolate} from "./point";
import {xml} from "./editable";

// export interface RenderOptions {
//     // Viewport size.
//     width: number;
//     height: number;

//     // Transformation applied to all drawn points.
//     transform?: string;

//     // Declare whether the path should be closed.
//     // This option is currently always true.
//     closed: true;

//     // Output path styling.
//     fill?: string;
//     stroke?: string;
//     strokeWidth?: number;

//     // Option to render guides (points, handles and viewport).
//     guides?: boolean;
//     boundingBox?: boolean;
// }

// Renders a shape made up of the input points to an editable data structure
// which can be rendered to svg.
export const renderEditable = (p, opt) => {
    const points = p.map((point) => interpolate(point, opt.height));
    // Compute guides from input point data.
    const handles = [];
    for (let i = 0; i < points.length; i++) {
        const {x, y, handles: hands} = loopAccess(points)(i);

        const next = loopAccess(points)(i + 1);
        const nextHandles = next.handles;

        if (hands === undefined) {
            handles.push({x1: x, y1: y, x2: next.x, y2: next.y});
            continue;
        }
        handles.push({
            x1: x - Math.cos(hands.angle) * hands.out,
            y1: y + Math.sin(hands.angle) * hands.out,
            x2: next.x + Math.cos(nextHandles.angle) * nextHandles.in,
            y2: next.y - Math.sin(nextHandles.angle) * nextHandles.in,
        });
    }

    // Render path data attribute from points and handles. Must loop more times
    // than the number of points in order to correctly close the path.
    let path = "";
    for (let i = 0; i <= points.length; i++) {
        const point = loopAccess(points)(i);
        const hands = loopAccess(handles)(i - 1);

        // Start at the first point's coordinates.
        if (i === 0) {
            path += `M${point.x},${point.y}`;
            continue;
        }

        // Add cubic bezier coordinates using the computed handle positions.
        path += `C${hands.x1},${hands.y1},${hands.x2},${hands.y2},${point.x},${point.y}`;
    }

    const stroke = opt.stroke || (opt.guides ? "black" : "none");
    const strokeWidth = opt.strokeWidth || (opt.guides ? 1 : 0);

    const xmlRoot = xml("svg");
    xmlRoot.attributes.width = opt.width;
    xmlRoot.attributes.height = opt.height;
    xmlRoot.attributes.viewBox = `0 0 ${opt.width} ${opt.height}`;
    xmlRoot.attributes.xmlns = "http://www.w3.org/2000/svg";

    const xmlContentGroup = xml("g");
    xmlContentGroup.attributes.transform = opt.transform || "";

    const xmlBlobPath = xml("path");
    xmlBlobPath.attributes.stroke = stroke;
    xmlBlobPath.attributes["stroke-width"] = strokeWidth;
    xmlBlobPath.attributes.fill = opt.fill || "none";
    xmlBlobPath.attributes.d = path;

    xmlContentGroup.children.push(xmlBlobPath);
    xmlRoot.children.push(xmlContentGroup);

    return xmlRoot;
};
