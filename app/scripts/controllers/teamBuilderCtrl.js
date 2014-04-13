'use strict';
platTheLeagueModule.controller('teamBuilderCtrl', [
	'$scope',
	'$filter',
	'$modal',
	'dataFactory',
	'formatFactory',
	function ($scope, $filter, $modal, dataFactory, formatFactory, modalInstanceCtrl) {
		
		function getAllChamps() {
			dataFactory.readJSON('champion_json/all_champs.json').success(function(data) {
				$scope.allChamps = data["Champions"];
				//sort the champion list
				$scope.allChamps.sort(function (a, b) {
					if (a["ChampionName"]["pretty"].toUpperCase() < b["ChampionName"]["pretty"].toUpperCase()) {
						return -1;
					} else if (a["ChampionName"]["pretty"].toUpperCase() > b["ChampionName"]["pretty"].toUpperCase()) {
						return 1;
					}
					return 0;
				});
			}).error(function(data, status, headers, config) {
		 		$scope.allChamps = "";
		 		$scope.error = 'Problem finding all champions list: unable to read all_champs.json, Error Code '+status;
			});
			
		};
		
		$scope.ajaxGetChampInfo = function (champion) {		
			
			//change the champion's name into what lolcounter expects
			champion = champion.toLowerCase();
			champion = champion.replace(" ", "");
			champion = champion.replace("'", "");
			champion = champion.replace(".", "");
			
			//set $scope.selectedChamp to the champ that was clicked and return a modal
			returnJSON(champion);
			
		}
		
	//reads the contents of the champion's JSON file into $scope.selectedChamp, does a bit of formatting, and generates a $scope.error if there is one.
	function returnJSON(champion) {
		dataFactory.readJSON('champion_json/'+champion+'.json').success(function(data) {
			$scope.selectedChamp = data;
			$scope.unalteredData = data;
			$scope.error = "";
			
			//filter duplicates from WeakAgainst list
			var uniqueNames = [];
			var uniqueWeakAgainst = [];
			var confidence = 0;
			var upvotes = 0;
			var downvotes = 0;
			for(var i = 0; i < $scope.selectedChamp["WeakAgainst"].length; i++){
				if($.inArray($scope.selectedChamp["WeakAgainst"][i]["champName"], uniqueNames) == -1 ){
					//calculate a confidence score:
					upvotes = parseInt($scope.selectedChamp["WeakAgainst"][i]["upvotes"]);
					downvotes = parseInt($scope.selectedChamp["WeakAgainst"][i]["downvotes"]);
					confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
					
					uniqueWeakAgainst.push({"champName": $scope.selectedChamp["WeakAgainst"][i]["champName"],
											"upvotes": upvotes,
											"downvotes": downvotes,
											"confidence": confidence});
				}
				uniqueNames.push($scope.selectedChamp["WeakAgainst"][i]["champName"]);
			}
			$scope.selectedChamp["WeakAgainst"] = uniqueWeakAgainst;
			
			//filter duplicates from StrongAgainst list
			uniqueNames = [];
			var uniqueStrongAgainst = [];
			for(var i = 0; i < $scope.selectedChamp["StrongAgainst"].length; i++){
				if($.inArray($scope.selectedChamp["StrongAgainst"][i]["champName"], uniqueNames) == -1 ){
					//calculate a confidence score:
					upvotes = parseInt($scope.selectedChamp["StrongAgainst"][i]["upvotes"]);
					downvotes = parseInt($scope.selectedChamp["StrongAgainst"][i]["downvotes"]);
					confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
					
					uniqueStrongAgainst.push({"champName": $scope.selectedChamp["StrongAgainst"][i]["champName"],
												"upvotes": upvotes,
												"downvotes": downvotes,
												"confidence": confidence});
				}
				uniqueNames.push($scope.selectedChamp["StrongAgainst"][i]["champName"]);
			}
			$scope.selectedChamp["StrongAgainst"] = uniqueStrongAgainst;
			
			//filter duplicates from GoodWith list
			uniqueNames = [];
			var uniqueGoodWith = [];
			for(var i = 0; i < $scope.selectedChamp["GoodWith"].length; i++){
				if($.inArray($scope.selectedChamp["GoodWith"][i]["champName"], uniqueNames) == -1 ){
					//calculate a confidence score:
					upvotes = parseInt($scope.selectedChamp["GoodWith"][i]["upvotes"]);
					downvotes = parseInt($scope.selectedChamp["GoodWith"][i]["downvotes"]);
					confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
					
					uniqueGoodWith.push({"champName": $scope.selectedChamp["GoodWith"][i]["champName"],
											"upvotes": upvotes,
											"downvotes": downvotes,
											"confidence": confidence});

				}
				uniqueNames.push($scope.selectedChamp["GoodWith"][i]["champName"]);
			}
			$scope.selectedChamp["GoodWith"] = uniqueGoodWith;
			
			
			//and open our modal to display
			$scope.openChampCounters();
			
		}).error(function(data, status, headers, config) {
	 		$scope.selectedChamp = "";
	 		$scope.error = 'Problem finding champion: check that your champion name is spelled correctly.  Error from server: "'+status+'"';
	 	});
		
	};
	
	//code for popup windows
	$scope.openChampCounters = function () {

	    var modalInstance = $modal.open({
	      templateUrl: 'views/champ_counter_modal_content.html',
	      controller: 'modalInstanceCtrl',
	      resolve: {
	        data: function () {
	          return $scope.selectedChamp;
	        }
	      }
	    });
	    
	  };
	  
	  //code for drag and drop:
	  $scope.filterIt = function() {
		return $filter('filter')($scope.allChamps, $scope.allChampFilterQuery);
	  };
	
	  $scope.topLane1 = [];
	  $scope.topLane2 = [];
	  getAllChamps();
	
	}
]);