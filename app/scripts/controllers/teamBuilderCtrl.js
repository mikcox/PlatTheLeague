'use strict';
platTheLeagueModule.controller('teamBuilderCtrl', [
	'$scope',
	'$filter',
	'dataFactory',
	'formatFactory',
	function ($scope, $filter, dataFactory, formatFactory) {
		
		$scope.getChampInfo = function () {
			dataFactory.getHTTP($scope.url).success(function (data) {
				$scope.error = '';
				if (data) {
					$scope.results = data;
				}
			}).error(function (data, status) {
				$scope.error = 'HTTP get returned: ' + status;
			});
		};
		
		$scope.ajaxGetChampInfo = function (champion) {
			$.ajax({
				type: 'POST',
				url: 'scripts/button_actions/get_champ_info.php',
				data: { ChampionName: champion }
			});
			
			dataFactory.readJSON('champion_json/'+champion+'.json').success(function(data) {
					$scope.results = data;
					$scope.error = "";
			 	}).error(function(data, status, headers, config) {
			 		$scope.results = "";
			 		$scope.error = 'Problem reading file: ' + status;
			 });
		}
		
		
		
		//$scope.getChampInfo();
		/*$scope.getPersonnel();
		$scope.orderProp = 'Skill';
		$scope.reverse = false;
		$scope.DeleteButtonPressed = function (name, personuri, skill, skilluri) {
			var moveon = confirm('Delete ' + name + '\'s ' + skill + ' skill?');
			if (moveon) {
				//alert('Deleting ' + name + '\'s ' + skill + ' skill.  Wait a moment and refresh your page to see the change.');
				//ajaxSubmitDeletion(personuri, skilluri);
				updateAPISubmitDeletion(personuri, skilluri);
			} else {
				return;
			}
		};
		function ajaxSubmitDeletion(personuri, skilluri) {
			var deletionText = 'personuri,leveluri\n';
			deletionText += personuri + ',' + skilluri + '\n';
			$.ajax({
				type: 'POST',
				url: 'scripts/button_actions/removebuttonaction.php',
				data: { DeletionText: deletionText }
			});
		}
		function updateAPISubmitDeletion(personuri, skilluri){
			// = 'update=PREFIX laspskills: <http://webdev1.lasp.colorado.edu:57529/laspskills#> DELETE DATA {GRAPH <http://vitro.mannlib.cornell.edu/default/vitro-kb-2> {<'+personuri+'> <laspskills:hasSkill> <'+skilluri+'>}';
			//dataFactory.submitSPARQLUpdate($scope.urlBaseUpdate, deleteQuery);
			$.ajax({
				type: 'POST',
				url: 'scripts/button_actions/removebuttonactionVIVOsparqlUpdate.php',
				data: { DeletionText: {"personuri": personuri, "skilluri": skilluri} },
				success: function(data){
		            if(data == 200){
		            	alert('Skill deleted successfully.');
		            	location.reload();
		            }
		            else {
		            	alert('Return status: '+data);
		            }
		        }
			});
		}*/
		//search functions
		$scope.searchResults = function (person) {
			if (person.length > 0) {
				$scope.currentPageResults = 1;
			}
			return $scope.filterResults();
		};
		$scope.filterResults = function () {
			var filteredResults = [];
			filteredResults = $filter('ViewAllSearch')($scope.skills, $scope.query);
			filteredResults = $filter('orderBy')(filteredResults, $scope.orderProp, $scope.reverse);
			$scope.pagedResults = $scope.groupToPages(filteredResults);
		};
		//Pagination Functions
		//groupToPages() does not filter input
		$scope.groupToPages = function (list) {
			var pagedList = [];
			for (var i = 0; i < list.length; i++) {
				if (i % $scope.itemsPerPage === 0) {
					pagedList[Math.floor(i / $scope.itemsPerPage)] = [list[i]];
				} else {
					pagedList[Math.floor(i / $scope.itemsPerPage)].push(list[i]);
				}
			}
			return pagedList;
		};
		$scope.countPagedList = function (list) {
			var count = 0;
			if (typeof list === 'undefined') {
				return count;
			}
			for (var i = 0; i < list.length; i++) {
				count += list[i].length;
			}
			return count;
		};
		//Sorting Function
		$scope.changeSorting = function (sort) {
			if ($scope.orderProp === sort) {
				$scope.reverse = !$scope.reverse;
			} else {
				$scope.orderProp = sort;
				$scope.reverses = false;
			}
			$scope.filterResults();
		};
		$scope.sortingClass = function (sort) {
			var cls;
			if ($scope.orderProp === sort) {
				if ($scope.reverse) {
					cls = 'sorting_asc';
				} else {
					cls = 'sorting_desc';
				}
			} else {
				cls = 'sorting_both';
			}
			return cls;
		};
	}
]);