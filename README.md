# cKanvas
Canvas directive for angular.

``bower install ckanvas``

**Add to your app**  

angular.module('app', ['cKanvas'])

<br />
## Directive

The ckanvas directive creates a canvas element that draws based on data in it's paths attribute.

**Markup:**
```html
<ckanvas center=true|false offset-x="number:pixels" offset-y="number:pixels" paths="pathArray" responsive=true|false transform-controls=true|false  zoom="number:1===100"></ckanvas>
```
**Attributes**  

  ``center`` - Optional. When set to true, will center the drawing in the canvas.  

  ``offset-x`` - Optional. Offset the drawing in relation to the canvas in pixels.  

  ``offset-x`` - Optional. Offset the drawing in relation to the canvas in pixels.  

  ``paths`` - Required. Data to draw.  

  ``
    [
      {
            properties: {} // OBJECT: canvas propeties, i.e. fillStyle, strokeStyle, etc. required for .stroke() and .fill()
            vertices:[
                [x, y],
                [x, y],
                ...
            ]
        }
    ]
  ``

  ``responsive`` - Optional. Will set the width/height of the canvas to percentages and will also listen for the directives width/height changes and redraw.  

  ``transform-controls`` - Optional. Will display zoom in/out buttons and allow you to drag the canvas around in the directive.  

  ``zoom`` - Optional. Zoom in or out of the drawing. Minimum zoom is 100%. Value of 1 equals 100%, 2 equals 200%.