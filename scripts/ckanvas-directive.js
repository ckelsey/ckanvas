/*
- responsive
- grid paper per unit(scaled)
- size key
- {
    paths:[]
    stroke{
        width
        color
    }
    fillcolor
}
*/
(function(cKanvas) {
    /* MARKUP
     * <ckanvas></ckanvas>
     */

    cKanvas.directive('ckanvas', function($compile){
        return {
            restrict: 'E',
            scope: {
                paths: '=paths',
                transformControls: '@transformControls',
                miniMap: '@miniMap',
                zoom: '@zoom',
                offsetX: '@offsetX',
                offsetY: '@offsetY',
                center: '@center',
                responsive: '@responsive'
            },
            link: function(scope,elm,attrs){
                var canvas = null;
                var miniMap = null;
                var zoomMinusButton = null;

                var setTransform = function(){
                    if(scope.zoom < 1){
                        scope.zoom = 1;
                    }
                    if(scope.zoom === 1){
                        zoomMinusButton.className = zoomMinusButton.className.indexOf('c-ckanvas__zoom-button-disabled') === -1 ? zoomMinusButton.className + ' c-ckanvas__zoom-button-disabled' : zoomMinusButton.className;
                    }else{
                        zoomMinusButton.className = zoomMinusButton.className.split('c-ckanvas__zoom-button-disabled').join('');
                    }
                    var transform = 'translate(' + (scope.offsetX ? scope.offsetX +'px': '0px') +', '+ (scope.offsetY ? scope.offsetY +'px': '0px') +') scale('+ (scope.zoom ? scope.zoom : '1') +')';
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
                };

                var mousedoneHandler = function(e){
                    var target = e.target;
                    document.body.removeEventListener('mousemove', mousemoveHandler, true);
                    document.body.removeEventListener('mouseleave', mousedoneHandler, true);
                    document.body.removeEventListener('mouseup', mousedoneHandler, true);
                };

                var initMovePositionX = 0;
                var initMovePositionY = 0;
                var mousemoveHandler = function(e){
                    var mouseCanvasX = e.pageX - canvas.getBoundingClientRect().left;
                    var mouseCanvasY = e.pageY - canvas.getBoundingClientRect().top;
                    scope.offsetX = scope.offsetX + (mouseCanvasX - initMovePositionX);
                    scope.offsetY = scope.offsetY + (mouseCanvasY - initMovePositionY);
                    setTransform();
                };

                var mousedownHandler = function(e){
                    initMovePositionX = e.pageX - canvas.getBoundingClientRect().left;
                    initMovePositionY = e.pageY - canvas.getBoundingClientRect().top;
                    document.body.addEventListener('mousemove', mousemoveHandler, true);
                    document.body.addEventListener('mouseleave', mousedoneHandler, true);
                    document.body.addEventListener('mouseup', mousedoneHandler, true);
                };

                var doPath = function(index, ctx, pathsToDraw){
                    for(var p in pathsToDraw[index].properties){
                        ctx[p] = pathsToDraw[index].properties[p];
                    }
                    ctx.beginPath();
                    ctx.moveTo(
                        pathsToDraw[index].vertices[0][0],
                        pathsToDraw[index].vertices[0][1]
                    );
                    for(var i=1; i<pathsToDraw[index].vertices.length; i++){
                        var x = pathsToDraw[index].vertices[i][0];
                        var y = pathsToDraw[index].vertices[i][1];
                        ctx.lineTo(x,y);
                    }
                    ctx.closePath();
                    if(pathsToDraw[index].properties.fillStyle){
                        ctx.fill();
                    }
                    if(pathsToDraw[index].properties.strokeStyle){
                        ctx.stroke();
                    }
                }

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

                var getVertices = function(pathsToDraw, canvas){
                    pathsToDraw.x = pathsToDraw[0].vertices[0][0];
                    pathsToDraw.X = 0;
                    pathsToDraw.y = pathsToDraw[0].vertices[0][1];
                    pathsToDraw.Y = 0;

                    for(var i=0; i<pathsToDraw.length; i++){
                        var minmax = getMinMx(pathsToDraw.x, pathsToDraw.X, pathsToDraw.y, pathsToDraw.Y, pathsToDraw[i].vertices);
                        pathsToDraw.x = minmax.x;
                        pathsToDraw.X = minmax.X;
                        pathsToDraw.y = minmax.y;
                        pathsToDraw.Y = minmax.Y;
                    }

                    pathsToDraw.X = pathsToDraw.X - pathsToDraw.x;
                    pathsToDraw.Y = pathsToDraw.Y - pathsToDraw.y;
                    pathsToDraw.scaleRatio = ((canvas.width / pathsToDraw.X) * pathsToDraw.Y) < canvas.height ? canvas.width / pathsToDraw.X : canvas.height / pathsToDraw.Y;

                    return pathsToDraw;
                };

                var create = function(pathsToDraw){
                    canvas = elm[0].querySelector('canvas');
                    elm[0].removeEventListener('mousedown', mousedownHandler, true);
                    var html = '<canvas class="c-ckanvas__canvas"></canvas>';
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

                        if(elm[0].className.indexOf('c-ckanvas__tranform') === - 1){
                            elm[0].className += ' c-ckanvas__tranform';
                        }

                        html += '<div class="c-ckanvas__zoom-buttons"><button ng-click="zoom=zoom+.25" class="c-ckanvas__zoom-buttons_plus">+</button><button ng-click="zoom=zoom-.25" class="c-ckanvas__zoom-buttons_minus">-</button></div>';
                    }else if(elm[0].className.indexOf('c-ckanvas__tranform') > - 1){
                        elm[0].className = elm[0].className.split('c-ckanvas__tranform').join('');
                    }

                    if(scope.miniMap){
                        //html += '<canvas class="c-ckanvas__mini-canvas"></canvas>';
                    }

                    elm.html(html);
                    $compile(elm.contents())(scope);
                    canvas = elm[0].querySelectorAll('canvas')[0];

                    canvas.width = elm[0].offsetWidth;
                    canvas.height = elm[0].offsetHeight;
                    var ctx = canvas.getContext("2d");
                    var devicePixelRatio = window.devicePixelRatio || 1;
                    var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
                    var pixelRatio = (devicePixelRatio / backingStoreRatio) * (scope.zoom ? scope.zoom : 1);
                    if (devicePixelRatio !== backingStoreRatio) {
                        ctx.scale(pixelRatio, pixelRatio);
                        var oldWidth = canvas.width;
                        var oldHeight = canvas.height;
                        ctx.canvas.width = oldWidth * pixelRatio;
                        ctx.canvas.height = oldHeight * pixelRatio;

                        if(scope.responsive){
                            canvas.style.width = 100 +'%';
                            canvas.style.height = 100 +'%';
                        }else{
                            canvas.style.width = oldWidth +'px';
                            canvas.style.height = oldHeight +'px';
                        }
                    }

                    pathsToDraw = getVertices(pathsToDraw, canvas);

                    var center = scope.center;
                    if(center || center === undefined){
                        pathsToDraw.offsetX = (canvas.width - (pathsToDraw.X * pathsToDraw.scaleRatio)) / 2;
                        pathsToDraw.offsetY = (canvas.height - (pathsToDraw.Y * pathsToDraw.scaleRatio)) / 2;
                    }else{
                        pathsToDraw.offsetX = 0;
                        pathsToDraw.offsetY = 0;
                    }

                    pathsToDraw = normalizeVertices(pathsToDraw);

                    if(scope.zoom !== undefined || scope.offsetX !== undefined || scope.offsetY !== undefined){
                        zoomMinusButton = elm[0].querySelector('button.c-ckanvas__zoom-buttons_minus');
                        setTransform();
                    }

                    if(scope.transformControls){
                        elm[0].addEventListener('mousedown', mousedownHandler, true);
                    }

                    for(var i=0; i<pathsToDraw.length; i++){
                        doPath(i, ctx, pathsToDraw);
                    }
                };

                create(angular.copy(scope.paths));

                scope.$watch(function(){return scope.paths}, function(n,o){
                    if(n !== o){
                        create(angular.copy(scope.paths));
                    }
                });
                scope.$watch(function(){return scope.zoom}, function(n,o){
                    if(n !== o){
                        create(angular.copy(scope.paths));
                    }
                });

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
