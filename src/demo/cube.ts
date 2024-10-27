/*
 * This demo was created with the help of ChatGPT 4o
 */

import { AnimationContext, FrameBuffer, Animation } from '../types';

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

// Rotate point on X-axis
const rotateX = (point: { x: number; y: number; z: number }, angle: number) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * cos - point.z * sin,
    z: point.y * sin + point.z * cos,
  };
};

// Rotate point on Y-axis
const rotateY = (point: { x: number; y: number; z: number }, angle: number) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: -point.x * sin + point.z * cos,
  };
};

// Project 3D points to 2D screen
const project = (
  point: { x: number; y: number; z: number },
  context: AnimationContext,
) => {
  const scale = FOV / (point.z + DISTANCE); // Perspective projection
  const screenX = Math.round(point.x * scale + context.cols / 2);
  const screenY = Math.round(point.y * scale + context.rows / 2);
  return { x: screenX, y: screenY };
};

// Draw a line between two points using Bresenham's algorithm
const drawLine = (
  buffer: FrameBuffer,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (x1 >= 0 && x1 < buffer[0].length && y1 >= 0 && y1 < buffer.length) {
      buffer[y1][x1] = '*'; // Draw a point on the line
    }
    if (x1 === x2 && y1 === y2) break;
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
export const Cube: Animation = (coord, context, buffer, _) => {
  // Define rotation angles based on elapsed time for continuous rotation
  const angle = context.elapsedTime * 0.5;

  // Rotate and project each vertex
  const projectedVertices = cubeVertices.map((v) => {
    const rotatedVertex = rotateX(rotateY(v, angle), angle); // Rotate around Y and X
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
