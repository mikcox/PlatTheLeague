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
			//check that we have a champion name
			if(champion == null || champion.length < 1){
				$scope.error = "Please enter a champion name";
				document.getElementById("championSearchBox").style.backgroundColor = "yellow";
				return;
			} else {
				$scope.error = "";
				document.getElementById("championSearchBox").style.backgroundColor = "white";
			}			
			
			//change the champion's name into what lolcounter expects
			champion = champion.toLowerCase();
			champion = champion.replace(" ", "");
			champion = champion.replace("'", "");
			champion = champion.replace(".", "");
			
			//submit the champion's name to our php script to go fetch the info (will be obsolete soon)
			$.ajax({
				type: 'POST',
				url: 'scripts/button_actions/get_champ_info.php',
				data: { ChampionName: champion }
			}).done(function(data) {
				returnJSON(champion);
			});
			//returnJSON(champion);
			
		}
		
	//reads the contents of the champion's JSON file into $scope.selectedChamp, does a bit of formatting, and generates a $scope.error if there is one.
	function returnJSON(champion) {
		dataFactory.readJSON('champion_json/'+champion+'.json').success(function(data) {
			$scope.selectedChamp = data;
			$scope.error = "";
			
			//filter duplicates from WeakAgainst list
			var uniqueNames = [];
			var uniqueWeakAgainst = [];
			for(var i = 0; i < $scope.selectedChamp["WeakAgainst"].length; i++){
				if($.inArray($scope.selectedChamp["WeakAgainst"][i]["champName"], uniqueNames) == -1 ){
					uniqueWeakAgainst.push({"champName": $scope.selectedChamp["WeakAgainst"][i]["champName"],
											"certainty": 0});
				}
				uniqueNames.push($scope.selectedChamp["WeakAgainst"][i]["champName"]);
			}
			$scope.selectedChamp["WeakAgainst"] = uniqueWeakAgainst;
			
			//filter duplicates from StrongAgainst list
			uniqueNames = [];
			var uniqueStrongAgainst = [];
			for(var i = 0; i < $scope.selectedChamp["StrongAgainst"].length; i++){
				if($.inArray($scope.selectedChamp["StrongAgainst"][i]["champName"], uniqueNames) == -1 ){
					uniqueStrongAgainst.push({"champName": $scope.selectedChamp["StrongAgainst"][i]["champName"],
											  "certainty": 0});
				}
				uniqueNames.push($scope.selectedChamp["StrongAgainst"][i]["champName"]);
			}
			$scope.selectedChamp["StrongAgainst"] = uniqueStrongAgainst;
			
			//filter duplicates from GoodWith list
			uniqueNames = [];
			var uniqueGoodWith = [];
			for(var i = 0; i < $scope.selectedChamp["GoodWith"].length; i++){
				if($.inArray($scope.selectedChamp["GoodWith"][i]["champName"], uniqueNames) == -1 ){
					uniqueGoodWith.push({"champName": $scope.selectedChamp["GoodWith"][i]["champName"],
										 "certainty": $scope.selectedChamp["GoodWith"][i]["certainty"]});

				}
				uniqueNames.push($scope.selectedChamp["GoodWith"][i]["champName"]);
			}
			$scope.selectedChamp["GoodWith"] = uniqueGoodWith;
			
			
			
		}).error(function(data, status, headers, config) {
	 		$scope.selectedChamp = "";
	 		dataFactory.readJSON('champion_json/error.json').success(function(data) {
	 			$scope.error = 'Problem finding champion: check that your champion name is spelled correctly.  Error from server: "'+data["ServerError"]+'"';
	 		}).error(function(data, status, headers, config) {
	 			$scope.error = 'Failed to read error file. whoops!'
	 		});
	 	});
		
	};
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