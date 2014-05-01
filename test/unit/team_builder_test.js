'use strict';

describe('Controller: teamBuilderCtrl', function () {

	// load the controller's module
	var ctrl, $scope;
	beforeEach(angular.mock.module('platTheLeagueModule'));
	// Initialize the controller and a mock scope
	beforeEach(inject(function ($q, $controller, $rootScope) {
		$scope = $rootScope.$new();
		ctrl = $controller('teamBuilderCtrl', {
		$scope: $scope,
		$q: $q
		});
	}));
	
	it('got at least 1 champion from JSON', function () {
		var allChamps = $scope.getAllChamps.resolve();
		$rootScope.$apply();
		alert(allChamps);
		//expect(allChamps.length).toBeGreaterThan(0);
	});/*
	it('should have the background set correctly', function () {
		expect(JSON.stringify($scope.background)).toEqual(JSON.stringify({
			'background': 'url(images/mms.jpg) no-repeat center center',
			'background-size': 'contain'
		}));
	});
	it('should build the URL for the plotting page correctly', function () {
		//arrange
		var mission = 'mms';
		var systemID = '5';
		var schemaID = '2';
		
		//act
		var resultURL = $scope.goButtonClick(mission, systemID, schemaID);
		
		//assert
		expect(resultURL).toBe('#/plot/mms/5/2');
	});*/
});