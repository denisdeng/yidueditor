'use strict';
appConfig.registerModule('editor');

angular.module('editor').service('editorService', ['$http',
function($http){
    var urlUpdate = '/api/cdms/content/update',
        urlDetail = '/api/cdms/content/detail';

    this.update = function(params) {
        return $http.post(urlUpdate,params);
    };

    this.getDetail = function(params) {
        return $http.post(urlDetail,params);
    };

}]).config([
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
            });
        $urlRouterProvider.otherwise("/write");
    }
]).controller('editorCtrl', ['$scope', '$stateParams', '$state', 'editorService',
    function($scope, $stateParams, $state, editorService) {

        var summernoteOpt = {
            toolbar: [
                ['style', ['style']], // no style button
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['Misc',['fullscreen','undo','redo']]
                //['insert', ['picture', 'link']], // no insert buttons
                //['table', ['table']], // no table button
                //['help', ['help']] //no help button
            ],
            lang:'zh-CN',
            height: 400
        };
        $('#editor').summernote(summernoteOpt);

        var id = $stateParams.id;
        if (id) {
            editorService.getDetail({
                id: id,
                decode: 1,
            })
            .success(function (res){
                var content = res.data && res.data.content && res.data.content.contents;
                if (content) {
                    $('#editor').summernote('code', content);
                }
            });
        }

        $scope.update = function () {
            var content = $('#editor').summernote('code');
            if (content) {
                editorService.update({
                    id: id,
                    content: content,
                })
                .success(function (res){
                    console.log(res);
                });
            };
        }
    }
])
