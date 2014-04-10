'use strict';

/* App Module */
var platTheLeagueModule = angular.module('platTheLeagueModule', [ 'ngDragDrop', 'ui.bootstrap', 'ngRoute']); //dependencies go inside the square brackets

platTheLeagueModule.config(function ($routeProvider, $httpProvider) {
    $routeProvider. //this controls navigation within our app
        when('/', { controller: 'teamBuilderCtrl', templateUrl: 'views/teamBuilder.php'}).
        otherwise({ redirectTo: '/' });

//enable cross domain requests
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    delete $httpProvider.defaults.headers.post["Content-Type"];
});

