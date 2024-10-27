# ASCII Engine

An ASCII-based renderer for creating animations directly in the browser. ASCII Engine allows for dynamic, grid-based animations displayed as text, providing a unique, retro feel. This package is still under development.

## Installation

You can install ASCII Engine via npm:

```bash
npm install ascii-engine
```

## Usage

### Using a Script Tag

Include the ASCII Engine script in your HTML file and call the `render` function:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCII Engine Example</title>
</head>
<body>
    <div id="background" style="height: 100vh"></div>
    <script src="../ascii-engine.js"></script>
    <script>
        AsciiEngine.render(
            document.getElementById('background'),
            AnAnimationModule,
            { resolution: 8 }
        );
    </script>
</body>
</html>
```

### Using ES Modules

Import the `render` function from the ASCII Engine package and use it in your JavaScript code:

```javascript
import { render } from 'ascii-engine';

const backgroundElement = document.getElementById('background');
const animationModule = {
    // Define your animation module here
};

render(backgroundElement, animationModule);
```

## Example Animation Module

Here is a simple example of an animation module you can use with ASCII Engine:

```javascript
export const CheckerBoard: Animation = (coords, context, buffer, cursor) => {
  // create a static checkboard pattern
  return (coords.x + coords.y) % 2 === 0 ? '█' : ' ';
};
```

## API

### Renderer

`render(target: HTMLElement, animation: Animation, options?: RenderOptions): void`

Renders the ASCII animation on the specified target element.

- `target`: The HTML element where the animation will be rendered.
- `animation`: The animation module containing the `main` function.
- `options`: Optional rendering options.
  - `resolution`: Controls the size of each character cell. Accepts numbers between `1 to 10` or `Resolution` enum values (TypeScript only).

### Animation Module

An animation module should have the following structure:

```typescript
// anim.ts
export const CheckerBoard: Animation = (coord: Coordinates, context: AnimationContext, buffer: FrameBuffer, cursor: CursorContext): string | null => {
  // do stuff and return back a character 
};
```


#### Parameters
- `coords`: The coordinates of the current cell.
    - `x`: (number) Column index
    - `y`: (number) Row index
- `context`: The animation context, providing cell metrics and frame information.
    - `frame`: (number) Current frame count
    - `deltaTime`: (number) Time in seconds since the last frame
    - `elapsedTime`: (number) Total elapsed time in seconds
    - `cellWidth`, cellHeight: (number) Dimensions of each cell
    - `rows`: (number) Grid dimensions
    - `cols`: (number) Grid dimensions
- `buffer`: (string[][]) The frame buffer, allowing direct mutation of the grid.
- `cursor`: The cursor’s position and state, including:
    - `x`: Cursor coordinates in pixels
    - `y`: Cursor coordinates in pixels
    - `col`, row: Cursor location in grid cells
    - `pressed`: Whether the cursor button is pressed

Please check demo animations under `src/demo` for different use cases for these parameters.

## Development

You can simply clone the repo and then use `yarn` to install dependencies, and then `yarn build` to build the project. You can then use the `index.html` for demo and development purposes.


## ToDo

- [ ] Colored characters
- [ ] Pre and post render functions

## License

This project is licensed under the GNU Public License.