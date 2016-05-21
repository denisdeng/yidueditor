'use strict';

var appConfig = (function(){
  // 应用程序名和依赖
  var appName = 'toolApp';
  var dependencies = [
        'ui.router',
        'editor'
        ];
  // 添加新模块
  var registerModule = function(moduleName, depends) {
    angular.module(moduleName, depends || []);
    angular.module(appName).requires.push(moduleName);
  };
  return {
    appName: appName,
    dependencies: dependencies,
    registerModule: registerModule
  };
})();


angular.module(appConfig.appName, appConfig.dependencies)
.run(['$rootScope', '$location', '$http', '$state',
    function($rootScope, $location, $http, $state) {
        $rootScope.$state = $state;
    }
]);

angular.element(document).ready(function() {
   
    angular.bootstrap(document, [appConfig.appName],{
      strictDi:true
    });
});