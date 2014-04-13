'use strict';
platTheLeagueModule.controller('modalInstanceCtrl', [
	'$scope',
	'$modalInstance',
	'data',
	function ($scope, $modalInstance, data) {
		$scope.selectedChamp = data;
		
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
]);