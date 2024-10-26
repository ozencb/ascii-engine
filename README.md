# ASCII Engine

ASCII based renderer for browsers.

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
            // your animation module
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
const animationModule = {
    main: (coords, context, cursor) => {
        // Return a character based on the coordinates, context, and cursor
        return (coords.x + coords.y) % 2 === 0 ? '#' : ' ';
    }
};
```

## API

### `render(target: HTMLElement, animation: Animation, options?: RenderOptions): void`

Renders the ASCII animation on the specified target element.

- `target`: The HTML element where the animation will be rendered.
- `animation`: The animation module containing the `main` function.
- `options`: Optional rendering options.

### Animation Module

An animation module should have the following structure:

```typescript
interface Animation {
    main: (coords: { x: number, y: number }, context: AnimationContext, cursor: CursorContext) => string;
}
```

- `coords`: The coordinates of the current cell.
- `context`: The animation context containing information like cell width and height.
- `cursor`: The cursor context containing information about the cursor position and state.

## License

This project is licensed under the MIT License.