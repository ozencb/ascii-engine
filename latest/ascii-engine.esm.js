var Resolution;
(function (Resolution) {
    Resolution[Resolution["Low"] = 1] = "Low";
    Resolution[Resolution["MediumLow"] = 2] = "MediumLow";
    Resolution[Resolution["Medium"] = 3] = "Medium";
    Resolution[Resolution["MediumHigh"] = 4] = "MediumHigh";
    Resolution[Resolution["High"] = 5] = "High";
    Resolution[Resolution["VeryHigh"] = 6] = "VeryHigh";
    Resolution[Resolution["Ultra"] = 7] = "Ultra";
    Resolution[Resolution["UltraHigh"] = 8] = "UltraHigh";
    Resolution[Resolution["Extreme"] = 9] = "Extreme";
    Resolution[Resolution["Maximum"] = 10] = "Maximum";
})(Resolution || (Resolution = {}));
const Nbsp = '\u00A0';
const ScaleFactor = 0.05;

const addPointerEvents = (target, context, cursor) => {
    const bbox = target.getBoundingClientRect();
    target.addEventListener('pointermove', (e) => {
        if (!(e instanceof PointerEvent))
            return;
        cursor.x = e.x - bbox.left;
        cursor.y = e.y - bbox.top;
        cursor.col = Math.floor(cursor.x / context.cellWidth);
        cursor.row = Math.floor(cursor.y / context.cellHeight);
    });
    target.addEventListener('pointerdown', (e) => {
        if (!(e instanceof PointerEvent))
            return;
        cursor.pressed = true;
    });
    target.addEventListener('pointerup', (e) => {
        if (!(e instanceof PointerEvent))
            return;
        cursor.pressed = false;
    });
};
const addWindowEvents = (target, context, options) => {
    window.addEventListener('resize', () => {
        const updatedCellMetrics = calculateCellMetrics(target, options.resolution);
        context.rows = updatedCellMetrics.rows;
        context.cols = updatedCellMetrics.cols;
        context.cellWidth = updatedCellMetrics.cellWidth;
        context.cellHeight = updatedCellMetrics.cellHeight;
        bootElements(target, context);
    });
};

const createBaseSpanElement = () => {
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.fontFamily = 'monospace';
    span.style.userSelect = 'none';
    span.style.overflow = 'hidden';
    span.innerHTML = Nbsp;
    return span;
};
const createSpanElement = (context) => {
    const { cellHeight } = context;
    const span = createBaseSpanElement();
    span.style.height = `${cellHeight}px`;
    span.style.fontSize = `${cellHeight}px`;
    span.style.lineHeight = `${cellHeight}px`;
    span.innerHTML = Nbsp;
    return span;
};
const calculateCellMetrics = (target, resolution) => {
    const { height: targetHeight, width: targetWidth } = target.getBoundingClientRect();
    const tempEl = createBaseSpanElement();
    tempEl.style.visibility = 'hidden';
    tempEl.style.display = 'inline';
    tempEl.innerHTML = Nbsp;
    target.appendChild(tempEl);
    const { height: baseHeight } = tempEl.getBoundingClientRect();
    target.removeChild(tempEl);
    const scale = resolution * ScaleFactor;
    const cellHeight = Math.floor(baseHeight / scale);
    const cellWidth = cellHeight * 0.6;
    const rows = (targetHeight > 0 ? Math.floor(targetHeight / cellHeight) : 0) + 1; // +1 to prevent empty row at the bottom
    const cols = (targetWidth > 0 ? Math.floor(targetWidth / cellWidth) : 0) + 1;
    return {
        rows,
        cols,
        cellHeight,
        cellWidth,
    };
};
const bootCursor = (target, context) => {
    const cursor = {
        x: 0,
        y: 0,
        col: 0,
        row: 0,
        pressed: false,
    };
    addPointerEvents(target, context, cursor);
    return cursor;
};
const bootElements = (target, context) => {
    // Reset target content
    target.innerHTML = '';
    for (let i = 0; i < context.rows; i++) {
        target.appendChild(createSpanElement(context));
    }
};
const bootContext = (target, options) => {
    const cellMetrics = calculateCellMetrics(target, options.resolution);
    const context = {
        rows: cellMetrics.rows,
        cols: cellMetrics.cols,
        cellWidth: cellMetrics.cellWidth,
        cellHeight: cellMetrics.cellHeight,
        frame: 0,
        deltaTime: 0,
        elapsedTime: 0,
        options,
    };
    addWindowEvents(target, context, options);
    return context;
};
const getRowElement = (target, row) => {
    return target.children[row];
};
const processFrameBuffer = (target, context, frameBuffer) => {
    for (let i = 0; i < context.rows; i++) {
        const rowElement = getRowElement(target, i);
        if (!rowElement)
            continue;
        const rowContent = [];
        frameBuffer[i].forEach((char, j) => {
            rowContent[j] = char;
        });
        rowElement.innerHTML = rowContent.join('');
    }
};
const runAnimationLoop = (target, context, animation, cursor) => {
    let previousTimestamp = 0;
    const frameBuffer = [];
    function loop(timestamp) {
        context.deltaTime = (timestamp - previousTimestamp) / 1000;
        context.elapsedTime += context.deltaTime;
        previousTimestamp = timestamp;
        for (let i = 0; i < context.rows; i++) {
            if (!frameBuffer[i]) {
                frameBuffer[i] = Array(context.cols).fill(null);
            }
        }
        for (let i = 0; i < context.rows; i++) {
            for (let j = 0; j < context.cols; j++) {
                const coords = { x: j, y: i };
                const char = animation(coords, context, frameBuffer, cursor);
                frameBuffer[i][j] = !char || char === ' ' ? Nbsp : char;
            }
        }
        processFrameBuffer(target, context, [...frameBuffer]);
        frameBuffer.length = 0;
        context.frame++;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};
const render = (target, animation, options = {
    resolution: Resolution.Maximum,
}) => {
    if (!target)
        throw new Error('Target element cannot be null');
    const context = bootContext(target, options);
    bootElements(target, context);
    const cursor = bootCursor(target, context);
    runAnimationLoop(target, context, animation, cursor);
};

/*
 * This demo was created with the help of ChatGPT 4o
 */
// Projection constants and rotation speed
const FOV$1 = 300; // Field of view for perspective
const DISTANCE$1 = 45; // Distance of the cube from the viewer
// Define cube vertices and edges
const cubeVertices$1 = [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 },
];
// Edges defining cube connections between vertices
const edges$1 = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Front face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // Connecting edges
];
// Rotate point on X-axis
const rotateX$1 = (point, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
    };
};
// Rotate point on Y-axis
const rotateY$1 = (point, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
    };
};
// Project 3D points to 2D screen
const project$1 = (point, context) => {
    const scale = FOV$1 / (point.z + DISTANCE$1); // Perspective projection
    const screenX = Math.round(point.x * scale + context.cols / 2);
    const screenY = Math.round(point.y * scale + context.rows / 2);
    return { x: screenX, y: screenY };
};
// Draw a line between two points using Bresenham's algorithm
const drawLine$1 = (buffer, x1, y1, x2, y2) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
        if (x1 >= 0 && x1 < buffer[0].length && y1 >= 0 && y1 < buffer.length) {
            buffer[y1][x1] = '*'; // Draw a point on the line
        }
        if (x1 === x2 && y1 === y2)
            break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
};
// Main function to render the rotating cube
const Cube = (coord, context, buffer, _) => {
    // Define rotation angles based on elapsed time for continuous rotation
    const angle = context.elapsedTime * 0.5;
    // Rotate and project each vertex
    const projectedVertices = cubeVertices$1.map((v) => {
        const rotatedVertex = rotateX$1(rotateY$1(v, angle), angle); // Rotate around Y and X
        return project$1(rotatedVertex, context);
    });
    // Draw each edge on the buffer
    edges$1.forEach(([start, end]) => {
        const { x: x1, y: y1 } = projectedVertices[start];
        const { x: x2, y: y2 } = projectedVertices[end];
        drawLine$1(buffer, x1, y1, x2, y2); // Draw edge between vertices
    });
    // Render frame
    return buffer[coord.y][coord.x] || ' '; // Return character at current position
};

const density = [' ', '░', '▒', '▓', '█'];
const Static = () => {
    return density[Math.floor(Math.random() * density.length)];
};

/*
 * This demo was created with the help of ChatGPT 4o
 */
// Projection constants and rotation speed
const FOV = 300; // Field of view for perspective
const DISTANCE = 45; // Distance of the cube from the viewer
// Define cube vertices and edges
const cubeVertices = [
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 },
];
// Edges defining cube connections between vertices
const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // Back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // Front face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // Connecting edges
];
// Initial rotation angles for the cube
let rotationX = 0;
let rotationY = 0;
// Track the last cursor position for calculating drag distance
let lastCursorX = 0;
let lastCursorY = 0;
// Rotate point on X-axis
const rotateX = (point, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
    };
};
// Rotate point on Y-axis
const rotateY = (point, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
    };
};
// Project 3D points to 2D screen
const project = (point, context) => {
    const scale = FOV / (point.z + DISTANCE); // Perspective projection
    const screenX = Math.round(point.x * scale + context.cols / 2);
    const screenY = Math.round(point.y * scale + context.rows / 2);
    return { x: screenX, y: screenY };
};
// Draw a line between two points using Bresenham's algorithm
const drawLine = (buffer, x1, y1, x2, y2) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
        if (x1 >= 0 && x1 < buffer[0].length && y1 >= 0 && y1 < buffer.length) {
            buffer[y1][x1] = '*'; // Draw a point on the line
        }
        if (x1 === x2 && y1 === y2)
            break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
    }
};
// Main function to render the rotating cube
const CubeInput = (coord, context, buffer, cursor) => {
    // If the cursor is pressed, update rotation angles based on drag distance
    if (cursor.pressed) {
        const dx = cursor.x - lastCursorX;
        const dy = cursor.y - lastCursorY;
        rotationX += dy * 0.01; // Scale for smooth rotation
        rotationY += dx * 0.01;
    }
    // Update the last cursor position for the next frame
    lastCursorX = cursor.x;
    lastCursorY = cursor.y;
    // Rotate and project each vertex
    const projectedVertices = cubeVertices.map((v) => {
        const rotatedVertex = rotateX(rotateY(v, rotationY), rotationX);
        return project(rotatedVertex, context);
    });
    // Draw each edge on the buffer
    edges.forEach(([start, end]) => {
        const { x: x1, y: y1 } = projectedVertices[start];
        const { x: x2, y: y2 } = projectedVertices[end];
        drawLine(buffer, x1, y1, x2, y2); // Draw edge between vertices
    });
    // Render frame
    return buffer[coord.y][coord.x] || ' '; // Return character at current position
};

export { Cube, CubeInput, Resolution, Static, render };
