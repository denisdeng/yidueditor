'use strict';
appConfig.registerModule('editor');

angular.module('editor').service('editorService', ['$http',
function($http){
    var urlUpdate = '/api/cdms/content/update',
        urlDetail = '/api/cdms/content/detail',
        urlList = '/api/cdms/content/pages';

    this.update = function(params) {
        return $http.post(urlUpdate,params);
    };

    this.getDetail = function(params) {
        return $http.post(urlDetail,params);
    };

    this.getList = function(params) {
        return $http.get(urlList,params);
    };

}])
.config([
    '$compileProvider',
    '$stateProvider',
    '$urlRouterProvider',
    function($compileProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('write', {
                url: "/write",
                templateUrl: 'partials/editor.html',
                controller: 'editorCtrl'
            })
            .state('edit', {
                url: "/edit/:id",
                templateUrl: 'partials/editor.html',
                controller: 'editorCtrl'
            })
            .state('list', {
                url: "/list",
                templateUrl: 'partials/list.html',
                controller: 'listCtrl'
            })
            .state('preview', {
                url: "/preview/:id",
                templateUrl: 'partials/preview.html',
                controller: 'previewCtrl'
            })
            ;
        $urlRouterProvider.otherwise("/list");
    }
])
.controller('listCtrl', ['$scope', '$stateParams', '$state', 'editorService',
    function($scope, $stateParams, $state, editorService) {
        editorService.getList({})
        .success(function (res){
            $scope.list= res.data && res.data;
            console.log($scope.list);
        });
    }
])
.controller('previewCtrl', ['$scope', '$stateParams', '$state', '$sce', 'editorService',
    function($scope, $stateParams, $state, $sce, editorService) {
        $scope.id = $stateParams.id;
        editorService.getDetail({
            id: $scope.id,
            decode: 1,
        })
        .success(function (res){
            var res = res.data && res.data.content;
            $scope.title = res.title; 
            $scope.content = $sce.trustAsHtml(res.contents);
        })
    }
])
.controller('editorCtrl', ['$scope', '$stateParams', '$state', '$sce', 'editorService',
    function($scope, $stateParams, $state, $sce, editorService) {

        var summernoteOpt = {
            toolbar: [
                ['style', ['style']], // no style button
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['picture', 'link', 'video']], // no insert buttons
                ['Misc',['fullscreen','codeview','undo','redo']]
                //['table', ['table']], // no table button
                //['help', ['help']] //no help button
            ],
            lang:'zh-CN',
            height: 400
        };
        $('#editor').summernote(summernoteOpt);

        $scope.id = $stateParams.id;
        if ($scope.id) {
            editorService.getDetail({
                id: $scope.id,
                decode: 1,
            })
            .success(function (res){
                $scope.content = res.data && res.data.content;
                if (!$scope.content) {
                    $scope.content = {
                        title: '',
                        contents: ''
                    }
                };
                $('#editor').summernote('code', $scope.content.contents);
            });
        }

        $scope.update = function () {
            var content = $('#editor').summernote('code');
            if (content) {
                var con = {
                    content_id: $scope.id,
                    content: {
                        title: $scope.content.title,
                        contents: content
                    }
                };
                editorService.update(con)
                .success(function (res){
                    console.log(res);
                    if (res.errno == 0){
                        $state.go('preview',{id: $scope.id});
                    }
                });
            };
        }

        $scope.preview = function () {
            var preCon = $('#editor').summernote('code'),
                patter = /(<p><br><\/p>)?/gi;
            if($.trim(preCon) != ''){
                $scope.isPreview = true;
                $scope.isEmpty = false;
                $scope.preCon = $sce.trustAsHtml(preCon);
            } else {
                $scope.isEmpty = true;
                $scope.isPreview = false;
            }
        }

        $scope.cancel = function () {
            $scope.isPreview = false;
            $scope.isEmpty = false;
        }
    }
])
