🚧 WIP 🚧

# ASCII Engine

ASCII based renderer for browsers.

## Usage

```html
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
```

or 

```
npm install ascii-engine
```
```
import { render } from 'ascii-engine';
```