'use strict';
angular.module('app', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'cKanvas'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: "/demo.html",
        controller: 'AppCtlr'
    })
    .otherwise({ redirectTo: '/' });
}])
.controller('AppCtlr', function($scope){
    $scope.lineWidth = 1;
    $scope.strokeStyle = '#000';
    $scope.fillStyle = '#B5DBEF';
    $scope.verts2array = function(str){
        $scope.pathArray = [{
            properties:{
                strokeStyle: '#000',
                lineWidth: 1,
                fillStyle: '#B5DBEF'
            },
            vertices:[]
        }];
        if(str){
            str = str.split(';');
            for(var i=0;i<str.length;i++){
                var temp = str[i].split(',');
                if(temp.length > 1){
                    $scope.pathArray[0].vertices.push( [parseFloat(temp[0]), parseFloat(temp[1])] );
                }
            }
        }

        $scope.output = JSON.stringify($scope.pathArray);
        return $scope.pathArray;
    };

    $scope.updateOutput = function(arr){
        $scope.output = JSON.stringify($scope.pathArray);
        return $scope.output;
    };

    $scope.verts = '';
    $scope.output = null;

    $scope.zoomFactor = 1;
    $scope.increaseZoom = function(){
        $scope.zoomFactor = $scope.zoomFactor + .25;
    };
    $scope.decreaseZoom = function(){
        $scope.zoomFactor = $scope.zoomFactor - .25;
    };
    $scope.getZoom = function(){
        return {
            'width': (100 * $scope.zoomFactor) + '%',
            'height': (100 * $scope.zoomFactor) + '%'
        }
    };

    $scope.path1 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices:[
            [23979.18, 21767.95],
            [23999.45, 20388.11],
            [23947.47, 20387.34],
            [23948.17, 20339.34],
            [23950.17, 20339.39],
            [23955.38, 19985.45],
            [23955.39, 19983.41],
            [25065.27, 19999.7],
            [25052.27, 20884.61],
            [24720.31, 20879.73],
            [24707.1, 21778.66],
            [23979.18, 21767.95],
            [23979.18, 21767.95]
        ]
    };

    $scope.path2 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices:[
            [22301.09, 16166.35],
            [22560.22, 16402.29],
            [22557.92, 16404.82],
            [22812.75, 16637.2],
            [21734.33, 17812.37],
            [21216.61, 17337.28],
            [20792.33, 17799.62],
            [20199.62, 17259.94],
            [20144.53, 17320.44],
            [19888.11, 17086.95],
            [19943.19, 17026.46],
            [19083.5, 16243.69],
            [19034.35, 16297.68],
            [18692.33, 15986.26],
            [18749.84, 15923.1],
            [18646.13, 15828.66],
            [18629.07, 15398.09],
            [18725.5, 15292.19],
            [18408.67, 15003.7],
            [18781.5, 14594.23],
            [18869.53, 14590.74],
            [18864.57, 14465.64],
            [18842.11, 14445.19],
            [19209.48, 14041.71],
            [19231.95, 14062.17],
            [19356.97, 14055.41],
            [19352.21, 13967.44],
            [19719.59, 13563.96],
            [20041.58, 13857.15],
            [20139.61, 13749.49],
            [20571.71, 13732.37],
            [20677.45, 13828.65],
            [20881.04, 13605.06],
            [21536.43, 14201.81],
            [21577.74, 14156.45],
            [21987.2, 14529.28],
            [21945.9, 14574.64],
            [22853.38, 15400.93],
            [22642.86, 15632.14],
            [22721.94, 15704.14],
            [22301.09, 16166.35]
        ]
    };

    $scope.path3 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [
            [-12908.08, 11882.23],
            [-12908.08, 11882.23],
            [-15211.8, 10205.04],
            [-15207.46, 10199.08],
            [-15254.32, 10164.96],
            [-16858.25, 12368.06],
            [-14807.23, 13861.28],
            [-14810.11, 13865.23],
            [-14790.68, 13879.37],
            [-14564.67, 13568.93],
            [-14281.73, 13774.92],
            [-14267.6, 13755.51],
            [-14271.54, 13752.64],
            [-13830.78, 13147.22],
            [-13828.86, 13148.61],
            [-13742.27, 13029.68],
            [-12908.08, 11882.23],
            [-12908.08, 11882.23]
        ]
    };

    $scope.path4 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices:[[-235642.01,37899.55],[-238006.66,37899.63],[-238006.66,38019.63],[-238942.9,38019.66],[-238942.83,39916.62],[-238056.27,39916.62],[-238056.26,40228.59],[-237528.26,40228.59],[-237528.26,40107.98],[-236721.99,40107.95],[-235645.02,40107.95],[-235642.01,39377.03],[-235642.01,37899.55]]
    };

    $scope.path5 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[23615.19,-4675.42],[23615.2,-4675.42],[23615.2,-4675.41],[23615.19,-4675.41],[23615.19,-4675.42]]
    };

    $scope.path6 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[10592.28,-11879.84],[10592.28,-10268.84],[10949.78,-10268.84],[10949.78,-10191.84],[10948.78,-10191.84],[10948.78,-10147.84],[11316.78,-10147.84],[11316.78,-11011.84],[11408.78,-11011.84],[11408.78,-11879.84],[10592.28,-11879.84]]
    };

    $scope.path7 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[4974.29,3314.05],[4944.29,3314.05],[4944.29,2936.05],[4734.29,2726.05],[4734.29,2048.05],[3307.29,2048.05],[3307.29,2365.33],[3337.29,2395.33],[3391.29,2395.33],[3391.29,2479.33],[3337.29,2479.33],[3307.29,2509.33],[3307.29,2845.33],[3337.29,2875.33],[3391.29,2875.33],[3391.29,2959.33],[3337.29,2959.33],[3307.29,2989.33],[3307.29,3458.05],[3376.29,3458.05],[3376.29,3641.33],[3448.29,3641.33],[3448.29,3823.33],[3391.29,3823.33],[3391.29,3919.33],[3337.29,3919.33],[3307.29,3949.33],[3307.29,4016.83],[4944.29,4016.83],[4944.29,3980.83],[4974.29,3980.83],[4974.29,3314.05]]
    };

    $scope.path8 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[36632.98,36137.3],[34900.98,36137.3],[34901.1,35836.6],[34836.98,35836.6],[34836.98,33497.3],[34840.98,33497.3],[36634.05,33497.3],[36633.94,33750.54],[36632.98,36137.3],[36632.98,36137.3]]
    };

    $scope.path9 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[-9730.93,-3441.67],[-9041.2,-2751.95],[-7802.24,-3993.52],[-8490.67,-4681.94],[-8490.67,-4681.94],[-8490.67,-4681.94],[-9730.93,-3441.67],[-9730.93,-3441.67],[-9730.93,-3441.67]]
    };

    $scope.path10 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[10352.37,-13223.04],[10361.84,-13227.77],[10548.18,-13227.77],[10593.9,-13227.77],[10607.92,-13227.06],[10610.75,-13215.77],[10628.75,-13179.77],[10640.75,-13159.77],[10640.75,-13125.02],[10802,-13126.54],[10802,-13111.53],[10802,-13096.51],[10802,-12648.01],[10802,-12639.77],[10802,-12629.7],[10802,-12620.09],[10802,-12174.19],[10802,-12167.24],[10802,-12157.39],[10802,-12134.79],[10802,-11933.01],[10534,-11933.02],[10534,-11890.99],[10296.25,-11891.02],[10296.25,-12087.02],[10016.24,-12087.02],[9993.34,-12087.02],[9918.25,-12087.02],[9918.25,-12045.02],[9820.25,-12045.02],[9820.25,-11929],[9532.25,-11929.02],[9532.25,-11881.02],[7342.58,-11881.02],[7340.1,-11887.02],[7266.27,-12032.94],[7323.13,-12061.86],[7225.49,-12256.96],[7381.52,-12335.76],[7269.27,-12560.26],[7294.04,-12572.65],[7158.58,-12846.47],[7168.42,-12851.39],[7144.05,-12900.14],[7170.88,-12913.56],[7157.46,-12940.39],[7175.97,-12949.64],[8185.23,-12949.64],[8257.23,-12877.64],[8342.26,-12877.64],[8414.26,-12949.64],[8718.08,-12949.64],[8753.09,-12880.14],[8821.24,-12913.27],[8825.5,-12904.76],[8825.5,-13633.52],[8874.09,-13633.52],[8874.09,-13921.52],[8831.53,-13921.52],[8831.55,-13973.02],[8995.3,-13973.02],[8995.5,-14081.14],[9435.88,-14081.21],[9435.91,-14652.27],[9925.75,-14652.27],[10580.75,-14652.27],[10580.75,-14580.27],[10726,-14580.27],[10726,-14522.02],[10744,-14522.02],[10744,-14121.02],[10726,-14121.02],[10726,-13919.02],[10608,-13919.02],[10608,-13853.02],[10431.25,-13853.02],[10431.25,-13581.99],[10292.31,-13394.59],[10281.37,-13379.84],[10275.45,-13376.88],[10352.37,-13223.04],[10352.37,-13223.04]]
    };

    $scope.path11 = {
        properties: {
            strokeStyle: '#000',
            lineWidth: 1,
            fillStyle: '#B5DBEF'
        },
        vertices: [[6578.9,-3583.75],[6578.9,-2690.75],[6498.9,-2690.75],[6498.9,-1865.75],[6123.4,-1865.75],[6123.4,-3583.75],[6578.9,-3583.75],[6578.9,-2690.75],[6578.9,-3583.75]]
    };


    // $scope.pathArray = [
    //     $scope.path1,
    //     $scope.path2,
    //     $scope.path7,
    //     $scope.path8,
    //     $scope.path9,
    //     $scope.path10,
    //     $scope.path11
    // ];

    // $scope.pathArray = [
    //     $scope.path7
    // ];

    // $scope.pathArray = [
    //     $scope.path3
    // ];
});
