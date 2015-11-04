# canvas-starfield

A canvas rendered starfield.

### Install

```bash
npm install canvas-starfield
```

### Getting Started

```javascript

var Starfield = require('canvas-starfield')
var sf = new Starfield({
  canvas: '#starfield-canvas', // string selector or HTML element
  numStars: 800,               // default 500
  dx: 0.05,                    // x speed of stars in px/frame, default 0.05
  dy: 0.025,                   // y speed of stars in px/frame, default 0.05
  maxRadius: 2,                // maximum star radius in px
  shootingStarInterval: 5     // time in seconds between shooting stars (omit field to disable shooting stars)
})

sf.start()

```