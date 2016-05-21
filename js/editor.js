'use strict';
appConfig.registerModule('editor');

angular.module('editor').config([
    '$compileProvider',
    '$stateProvider',
    '$urlRouterProvider',
    function($compileProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('write', {
                url: "/write",
                templateUrl: 'partials/editor.html',
                controller: 'editorCtrl'
            });
        $urlRouterProvider.otherwise("/write");
    }
]).controller('editorCtrl', ['$scope', '$stateParams', '$state',
    function($scope, $stateParams, $state) {
        var summernoteOpt = {
            lang:'zh-CN',
            height: 400
        };
        $('#editor').summernote(summernoteOpt);
    }
])
