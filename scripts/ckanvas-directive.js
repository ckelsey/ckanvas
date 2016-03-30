(function(cKanvas) {
    /*
        TODO:
        - minimap functionality

        MODULE NAME: 'cKanvas'

        MARKUP:
        <ckanvas center=true|false offset-x="number:pixels" offset-y="number:pixels" paths="pathArray" responsive=true|false transform-controls=true|false  zoom="number:1===100"></ckanvas>
    */
    cKanvas.directive('ckanvas', function($compile){
        return {
            restrict: 'E',
            scope: {
                center: '@center', // BOOL: true || false
                miniMap: '@miniMap', // Currently not functional
                offsetX: '@offsetX', // NUMBER:
                offsetY: '@offsetY',
                paths: '=paths', // ARRAY
                /* Example ARRAY
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
                */
                responsive: '@responsive', // BOOL: true || false
                transformControls: '@transformControls', //BOOL: true || false
                zoom: '@zoom', // NUMBER: 1 === 100, less than 1 === 1
            },
            link: function(scope,elm,attrs){
                var canvas = null; // DOM: Inner canvas element
                var miniMap = null; // DOM: Inner minimap canvas element
                var zoomMinusButton = null; // DOM: Inner button(-) element


                /* Sets the transform styles on the canvas element */
                var setTransform = function(){
                    /* Prevent the canvas from being zoomed out less than 100% */
                    if(scope.zoom < 1) scope.zoom = 1;

                    /* Disable/enable zoom out button */
                    if(scope.zoom === 1){
                        zoomMinusButton.className = zoomMinusButton.className.indexOf('c-ckanvas__zoom-button-disabled') === -1 ? zoomMinusButton.className + ' c-ckanvas__zoom-button-disabled' : zoomMinusButton.className;
                    }else{
                        zoomMinusButton.className = zoomMinusButton.className.split('c-ckanvas__zoom-button-disabled').join('');
                    }

                    /* Transform string, defaults to 0 if scope property is available */
                    var transform = 'translate(' + (scope.offsetX ? scope.offsetX +'px': '0px') +', '+ (scope.offsetY ? scope.offsetY +'px': '0px') +') scale('+ (scope.zoom ? scope.zoom : '1') +')';

                    /* Set transform origin in relation to the viewable are of the canvas */
                    var transformOriginX = 50;
                    var transformOriginY = 50;
                    if(scope.offsetX){
                        transformOriginX = (((canvas.width - scope.offsetX) / canvas.width) * 100) - 90;
                    }
                    if(scope.offsetY){
                        transformOriginY = (((canvas.height - scope.offsetY) / canvas.height) * 100) - 50;
                    }

                    transformOrigin = transformOriginX +'% '+ transformOriginY +'%';

                    canvas.style.webkitTransform = transform;
                    canvas.style.webkitTransformOrigin = transformOrigin;
                    canvas.style.MozTransform = transform;
                    canvas.style.MozTransformOrigin = transformOrigin;
                    canvas.style.msTransform = transform;
                    canvas.style.msTransformOrigin = transformOrigin;
                    canvas.style.OTransform = transform;
                    canvas.style.OTransformOrigin = transformOrigin;
                    canvas.style.transform = transform;
                    canvas.style.transformOrigin = transformOrigin;
                };


                /* Remove event listeners when done dragging */
                var mousedoneHandler = function(e){
                    var target = e.target;
                    document.body.removeEventListener('mousemove', mousemoveHandler, true);
                    document.body.removeEventListener('mouseleave', mousedoneHandler, true);
                    document.body.removeEventListener('mouseup', mousedoneHandler, true);
                };

                /* On mouse down, store the mouse position to be able to tell how far the mouse dragged */
                var initMovePositionX = 0;
                var initMovePositionY = 0;

                /* Move the canvas around with the mouse cursor */
                var mousemoveHandler = function(e){
                    var mouseCanvasX = e.pageX - canvas.getBoundingClientRect().left;
                    var mouseCanvasY = e.pageY - canvas.getBoundingClientRect().top;
                    scope.offsetX = scope.offsetX + (mouseCanvasX - initMovePositionX);
                    scope.offsetY = scope.offsetY + (mouseCanvasY - initMovePositionY);
                    /* Set the canvas new styles */
                    setTransform();
                };

                /* Start dragging the canvas around */
                var mousedownHandler = function(e){
                    /* On mouse down, store the mouse position to be able to tell how far the mouse dragged */
                    initMovePositionX = e.pageX - canvas.getBoundingClientRect().left;
                    initMovePositionY = e.pageY - canvas.getBoundingClientRect().top;
                    /* Listen for mouse moving */
                    document.body.addEventListener('mousemove', mousemoveHandler, true);
                    /* Events that signal done dragging */
                    document.body.addEventListener('mouseleave', mousedoneHandler, true);
                    document.body.addEventListener('mouseup', mousedoneHandler, true);
                };

                /* Draw, stroke, and fill a path in the path array */
                var doPath = function(index, ctx, pathsToDraw){
                    /* If any properties, i.e. fillStyle, strokeStyle, set them */
                    for(var p in pathsToDraw[index].properties){
                        ctx[p] = pathsToDraw[index].properties[p];
                    }

                    /* Set starting point */
                    ctx.beginPath();
                    ctx.moveTo(
                        pathsToDraw[index].vertices[0][0],
                        pathsToDraw[index].vertices[0][1]
                    );

                    /* Iterate over the next vertices and draw */
                    for(var i=1; i<pathsToDraw[index].vertices.length; i++){
                        var x = pathsToDraw[index].vertices[i][0];
                        var y = pathsToDraw[index].vertices[i][1];
                        ctx.lineTo(x,y);
                    }
                    ctx.closePath();

                    /* Fill if applicable */
                    if(pathsToDraw[index].properties.fillStyle){
                        ctx.fill();
                    }

                    /* Stroke if applicable */
                    if(pathsToDraw[index].properties.strokeStyle){
                        ctx.stroke();
                    }
                }

                /* Out of all the paths, find the min/max x and y so we can normalize/maximize the paths in the canvas during drawing */
                var getMinMx = function(x, X, y, Y, verts){
                    for(var i=0; i<verts.length; i++){
                        if(verts[i][0] > X){
                            X = verts[i][0];
                        }
                        if(verts[i][0] < x){
                            x = verts[i][0];
                        }
                        if(verts[i][1] > Y){
                            Y = verts[i][1];
                        }
                        if(verts[i][1] < y){
                            y = verts[i][1];
                        }
                    }
                    return {
                        x:x,
                        X:X,
                        y:y,
                        Y:Y
                    };
                };

                /* Set all the vertices to be relative to the min/max x and y, also taking into account scale and offsets */
                var normalizeVertices = function(pathsToDraw){
                    for(var index=0; index<pathsToDraw.length; index++){
                        for(var i=0; i<pathsToDraw[index].vertices.length; i++){
                            var x = ((pathsToDraw[index].vertices[i][0] - pathsToDraw.x) * pathsToDraw.scaleRatio) + pathsToDraw.offsetX;
                            var y = ((pathsToDraw[index].vertices[i][1] - pathsToDraw.y) * pathsToDraw.scaleRatio) + pathsToDraw.offsetY;
                            pathsToDraw[index].vertices[i][0] = x;
                            pathsToDraw[index].vertices[i][1] = y;
                        }
                    }
                    return pathsToDraw;
                };

                /* Starts calculating the min/max and scale ratio */
                var getVertices = function(pathsToDraw, canvas){
                    pathsToDraw.x = pathsToDraw[0].vertices[0][0];
                    pathsToDraw.X = 0;
                    pathsToDraw.y = pathsToDraw[0].vertices[0][1];
                    pathsToDraw.Y = 0;

                    /* Set the min/max x and y to the paths array */
                    for(var i=0; i<pathsToDraw.length; i++){
                        var minmax = getMinMx(pathsToDraw.x, pathsToDraw.X, pathsToDraw.y, pathsToDraw.Y, pathsToDraw[i].vertices);
                        pathsToDraw.x = minmax.x;
                        pathsToDraw.X = minmax.X;
                        pathsToDraw.y = minmax.y;
                        pathsToDraw.Y = minmax.Y;
                    }

                    pathsToDraw.X = pathsToDraw.X - pathsToDraw.x;
                    pathsToDraw.Y = pathsToDraw.Y - pathsToDraw.y;

                    /* Scale ratio is based on the min/max x and y in relation to the canvas width. I.e. if canvas width is 300 but the max x is 600, the ratio is .5 */
                    pathsToDraw.scaleRatio = ((canvas.width / pathsToDraw.X) * pathsToDraw.Y) < canvas.height ? canvas.width / pathsToDraw.X : canvas.height / pathsToDraw.Y;

                    return pathsToDraw;
                };

                /* Intialize the canvas element */
                var create = function(pathsToDraw){
                    /* Remove existing mousedown listener */
                    elm[0].removeEventListener('mousedown', mousedownHandler, true);

                    /* html will be what goes inside the directive */
                    var html = '<canvas class="c-ckanvas__canvas"></canvas>';

                    /* If transform-controls is set to true, set default/supplied values for zoom and offsets */
                    if(scope.transformControls){
                        if(scope.zoom === undefined){
                            scope.zoom = 1;
                        }

                        if(scope.offsetX === undefined){
                            scope.offsetX = 0;
                        }

                        if(scope.offsetY === undefined){
                            scope.offsetY = 0;
                        }

                        /* A class that sets the cursor to grab */
                        if(elm[0].className.indexOf('c-ckanvas__tranform') === - 1){
                            elm[0].className += ' c-ckanvas__tranform';
                        }

                        /* Zoom buttons */
                        html += '<div class="c-ckanvas__zoom-buttons"><button ng-click="zoom=zoom+.25" class="c-ckanvas__zoom-buttons_plus">+</button><button ng-click="zoom=zoom-.25" class="c-ckanvas__zoom-buttons_minus">-</button></div>';
                    }else if(elm[0].className.indexOf('c-ckanvas__tranform') > - 1){
                        /* Remove the class that sets the cursor to grab */
                        elm[0].className = elm[0].className.split('c-ckanvas__tranform').join('');
                    }

                    if(scope.miniMap){
                        //html += '<canvas class="c-ckanvas__mini-canvas"></canvas>';
                    }

                    /* Compile the directive with the new html */
                    elm.html(html);
                    $compile(elm.contents())(scope);
                    canvas = elm[0].querySelectorAll('canvas')[0];

                    /* Set up the new canvas element */
                    canvas.width = elm[0].offsetWidth;
                    canvas.height = elm[0].offsetHeight;
                    var ctx = canvas.getContext("2d");

                    /* For HiDi displays */
                    var devicePixelRatio = window.devicePixelRatio || 1;
                    var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
                    var pixelRatio = (devicePixelRatio / backingStoreRatio) * (scope.zoom ? scope.zoom : 1);
                    if (devicePixelRatio !== backingStoreRatio) {
                        ctx.scale(pixelRatio, pixelRatio);
                        var oldWidth = canvas.width;
                        var oldHeight = canvas.height;
                        ctx.canvas.width = oldWidth * pixelRatio;
                        ctx.canvas.height = oldHeight * pixelRatio;
                    }

                    /* If responsive is set to true, width and height values should be percentages, otherwise use pixels */
                    if(scope.responsive){
                        canvas.style.width = 100 +'%';
                        canvas.style.height = 100 +'%';
                    }else{
                        canvas.style.width = oldWidth +'px';
                        canvas.style.height = oldHeight +'px';
                    }

                    /* Starts calculating the min/max and scale ratio */
                    pathsToDraw = getVertices(pathsToDraw, canvas);

                    /* If center is set to true, adjust the offset so the drawing will be in the center of the canvas */
                    var center = scope.center;
                    if(center || center === undefined){
                        pathsToDraw.offsetX = (canvas.width - (pathsToDraw.X * pathsToDraw.scaleRatio)) / 2;
                        pathsToDraw.offsetY = (canvas.height - (pathsToDraw.Y * pathsToDraw.scaleRatio)) / 2;
                    }else{
                        pathsToDraw.offsetX = 0;
                        pathsToDraw.offsetY = 0;
                    }

                    /* Starts adjusting the vertices to be relative to the canvas */
                    pathsToDraw = normalizeVertices(pathsToDraw);

                    /* If any of the following is set to true, store the minus button(needed to make sure the canvas zoom doesn't go less than 100%) and initialize the transform styles */
                    if(scope.zoom !== undefined || scope.offsetX !== undefined || scope.offsetY !== undefined){
                        zoomMinusButton = elm[0].querySelector('button.c-ckanvas__zoom-buttons_minus');
                        setTransform();
                    }

                    /* If set to true, listen for dragging */
                    if(scope.transformControls){
                        elm[0].addEventListener('mousedown', mousedownHandler, true);
                    }

                    /* All done, start drawing */
                    for(var i=0; i<pathsToDraw.length; i++){
                        doPath(i, ctx, pathsToDraw);
                    }
                };

                create(angular.copy(scope.paths));

                /* Listen for path updates */
                scope.$watch(function(){return scope.paths}, function(n,o){
                    if(n !== o){
                        create(angular.copy(scope.paths));
                    }
                });

                /* Listen for zoom updates */
                scope.$watch(function(){return scope.zoom}, function(n,o){
                    if(n !== o){
                        create(angular.copy(scope.paths));
                    }
                });

                /* Listen for width/height updates */
                if(scope.responsive){
                    var elWidth = elm[0].getBoundingClientRect().width;
                    var elHeight = elm[0].getBoundingClientRect().height;
                    var timer = setInterval(function(){
                        if(elWidth !== elm[0].getBoundingClientRect().width || elHeight !== elm[0].getBoundingClientRect().height){
                            elWidth = elm[0].getBoundingClientRect().width;
                            elHeight = elm[0].getBoundingClientRect().height
                            create(angular.copy(scope.paths));
                        }
                    },100);
                }
            }
        };
    });
})(angular.module('cKanvas', []));
