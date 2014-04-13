'use strict';
platTheLeagueModule.controller('teamBuilderCtrl', [
	'$scope',
	'$filter',
	'$modal',
	'$q',
	'dataFactory',
	function ($scope, $filter, $modal, $q, dataFactory, modalInstanceCtrl) {
		
		function getAllChamps() {
			dataFactory.readJSON('champion_json/all_champs.json').then(function(data) {
				$scope.allChamps = data["Champions"];
				$scope.filterChamps();
				/*
				//sort the champion list
				$scope.allChamps.sort(function (a, b) {
					if (a["ChampionName"]["pretty"].toUpperCase() < b["ChampionName"]["pretty"].toUpperCase()) {
						return -1;
					} else if (a["ChampionName"]["pretty"].toUpperCase() > b["ChampionName"]["pretty"].toUpperCase()) {
						return 1;
					}
					return 0;
				});*/
			});
			
		};
		
		$scope.ajaxGetChampInfo = function (champion) {		
			
			//change the champion's name into what lolcounter expects
			champion = champion.toLowerCase();
			champion = champion.replace(" ", "");
			champion = champion.replace("'", "");
			champion = champion.replace(".", "");
			
			//set $scope.selectedChamp to the champ that was clicked and return a modal
			$scope.selectedChamp = getCounterJSON(champion, true);
		
			
		}
		//reads the contents of the champion's JSON, does a bit of formatting, and generates a $scope.error if there is one.
		function getCounterJSON(champion, openModal) {
			//var promise = dataFactory.readJSON('champion_json/'+champion+'.json').then(function(data) {
			var indexOfMatch = -1;
			for(var i = 0; i < $scope.allChamps.length; i++) {
				if($scope.allChamps[i]["ChampionName"]["lower"] == champion){
					indexOfMatch = i;
					break;
				}
			}
			if(indexOfMatch == -1){
				alert('Internal problem... lost track of champion '+champion+'. Whoops!!');
				return;
			}
			var selectedChamp = $scope.allChamps[indexOfMatch];
			//var selectedChamp = $scope.allChamps.indexOf();
				$scope.error = "";
				
				//filter duplicates from WeakAgainst list
				var uniqueNames = [];
				var uniqueWeakAgainst = [];
				var confidence = 0;
				var upvotes = 0;
				var downvotes = 0;
				for(var i = 0; i < selectedChamp["WeakAgainst"].length; i++){
					if($.inArray(selectedChamp["WeakAgainst"][i]["champName"], uniqueNames) == -1 ){
						//calculate a confidence score:
						upvotes = parseInt(selectedChamp["WeakAgainst"][i]["upvotes"]);
						downvotes = parseInt(selectedChamp["WeakAgainst"][i]["downvotes"]);
						confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
						
						uniqueWeakAgainst.push({"champName": selectedChamp["WeakAgainst"][i]["champName"],
												"upvotes": upvotes,
												"downvotes": downvotes,
												"confidence": confidence});
					}
					uniqueNames.push(selectedChamp["WeakAgainst"][i]["champName"]);
				}
				selectedChamp["WeakAgainst"] = uniqueWeakAgainst;
				
				//filter duplicates from StrongAgainst list
				uniqueNames = [];
				var uniqueStrongAgainst = [];
				for(var i = 0; i < selectedChamp["StrongAgainst"].length; i++){
					if($.inArray(selectedChamp["StrongAgainst"][i]["champName"], uniqueNames) == -1 ){
						//calculate a confidence score:
						upvotes = parseInt(selectedChamp["StrongAgainst"][i]["upvotes"]);
						downvotes = parseInt(selectedChamp["StrongAgainst"][i]["downvotes"]);
						confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
						
						uniqueStrongAgainst.push({"champName": selectedChamp["StrongAgainst"][i]["champName"],
													"upvotes": upvotes,
													"downvotes": downvotes,
													"confidence": confidence});
					}
					uniqueNames.push(selectedChamp["StrongAgainst"][i]["champName"]);
				}
				selectedChamp["StrongAgainst"] = uniqueStrongAgainst;
				
				//filter duplicates from GoodWith list
				uniqueNames = [];
				var uniqueGoodWith = [];
				for(var i = 0; i < selectedChamp["GoodWith"].length; i++){
					if($.inArray(selectedChamp["GoodWith"][i]["champName"], uniqueNames) == -1 ){
						//calculate a confidence score:
						upvotes = parseInt(selectedChamp["GoodWith"][i]["upvotes"]);
						downvotes = parseInt(selectedChamp["GoodWith"][i]["downvotes"]);
						confidence = Math.round(Math.sqrt(upvotes-downvotes) * Math.pow(upvotes/downvotes, 3)) / 100;
						
						uniqueGoodWith.push({"champName": selectedChamp["GoodWith"][i]["champName"],
												"upvotes": upvotes,
												"downvotes": downvotes,
												"confidence": confidence});
	
					}
					uniqueNames.push(selectedChamp["GoodWith"][i]["champName"]);
				}
				selectedChamp["GoodWith"] = uniqueGoodWith;
				
				if(openModal){
					//if we have to, open our modal to display
					$scope.openChampCountersModal(selectedChamp);
				}
				//alert(selectedChamp);
				return selectedChamp;
			//});
			//return promise;
		};
	
	//Function to populate game prediction panel
	$scope.populateGamePredictions = function () {
		//scope variables keeping track of the various scores:
		$scope.topScore = 0;
		$scope.midScore = 0;
		$scope.botScore = 0;
		
		
		
		//start at 0
		$scope.topScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane1[i]["WeakAgainst"][j]["confidence"]
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane2[i]["StrongAgainst"][j]["confidence"]
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore + $scope.topLane1[i]["StrongAgainst"][j]["confidence"]
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore + $scope.topLane2[i]["WeakAgainst"][j]["confidence"]
					}
				}
			}
		}
	};
	
	
	//code for popup windows
	$scope.openChampCountersModal = function (champ) {

	    var modalInstance = $modal.open({
	      templateUrl: 'views/champ_counter_modal_content.html',
	      controller: 'modalInstanceCtrl',
	      resolve: {
	        data: function () {
	          return champ;
	        }
	      }
	    });
	    
	  };
	  
	  //code for drag and drop:
	  $scope.filterChamps = function() {
		  $scope.filteredChamps = $filter('allChampTextFilter')($scope.allChamps, $scope.allChampFilterQuery);
		  return $scope.filteredChamps;
	  };
	  
	  $scope.topLane1 = [];
	  $scope.topLane2 = [];
	  $scope.midLane1 = [];
	  $scope.midLane2 = [];
	  getAllChamps();
	
	}
]);