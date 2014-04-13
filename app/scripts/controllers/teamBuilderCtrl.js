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
			});
			
		};
		
		$scope.ajaxGetChampInfo = function(champion) {		
			
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
				alert('Internal problem... lost track of champion "'+champion+'". Whoops!!');
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
						confidence = Math.round(Math.pow(upvotes-downvotes, 1/4) * Math.pow(upvotes/(downvotes+1), 2)) / 100;
						
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
						confidence = Math.round(Math.pow(upvotes-downvotes, 1/4) * Math.pow(upvotes/(downvotes+1), 2)) / 100;
						
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
						confidence = Math.round(Math.pow(upvotes-downvotes, 1/4) * Math.pow(upvotes/(downvotes+1), 2)) / 100;
						
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
		$scope.jungleScore = 0;
		$scope.teamScore = 0;
		
		
		//For the top lane score, start at 0
		$scope.topScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore + $scope.topLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.topScore = $scope.topScore + $scope.topLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["GoodWith"][j]["champName"]){
						$scope.topScore = $scope.topScore + $scope.topLane1[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["GoodWith"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane2[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		
		
	
		//For the mid lane score, start at 0
		$scope.midScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.midScore = $scope.midScore - $scope.midLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.midScore = $scope.midScore - $scope.midLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.midScore = $scope.midScore + $scope.midLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.midScore = $scope.midScore + $scope.midLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["GoodWith"][j]["champName"]){
						$scope.midScore = $scope.midScore + $scope.midLane1[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["GoodWith"][j]["champName"]){
						$scope.midScore = $scope.midScore - $scope.midLane2[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		
		//For the bot lane score, start at 0
		$scope.botScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.botScore = $scope.botScore - $scope.botLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane1.length; k++){
					if($scope.botLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.botScore = $scope.botScore - $scope.botLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.botScore = $scope.botScore + $scope.botLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane1.length; k++){
					if($scope.botLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.botScore = $scope.botScore + $scope.botLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.botLane1.length; k++){
					if($scope.botLane1[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["GoodWith"][j]["champName"]){
						$scope.botScore = $scope.botScore + $scope.botLane1[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["GoodWith"][j]["champName"]){
						$scope.botScore = $scope.botScore - $scope.botLane2[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		
		//For jungle influence, start at 0
		$scope.jungleScore = 0;
		//if we see that jungle 1 is weak against jungle 2, subtract that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that jungle 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < $scope.jungle2.length; i++){
			for(var j = 0; j < $scope.jungle2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.jungle2[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that jungle 1 is strong against jungle 2, add that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that jungle 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < $scope.jungle2.length; i++){
			for(var j = 0; j < $scope.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.jungle2[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that jungle 1 has champs that work well together, add that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["GoodWith"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle1[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		//if we see that jungle 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.jungle2.length; i++){
			for(var j = 0; j < $scope.jungle2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.jungle2[i]["GoodWith"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle2[i]["GoodWith"][j]["confidence"]/10;
					}
				}
			}
		}
		//round all of our scores to two decimal places:
		$scope.topScore = Math.round($scope.topScore*100)/100;
		$scope.midScore = Math.round($scope.midScore*100)/100;
		$scope.botScore = Math.round($scope.botScore*100)/100;
		$scope.jungleScore = Math.round($scope.jungleScore*100)/100;
		
		
		//and finally add up all lane scores to get a team score:
		$scope.teamScore = $scope.topScore + $scope.midScore + $scope.botScore + $scope.jungleScore;
		$scope.teamScore = Math.round($scope.teamScore*100)/100;
		
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
	
	$scope.resetPage = function(){
		$scope.topLane1 = [];
		$scope.topLane2 = [];
		$scope.midLane1 = [];
		$scope.midLane2 = [];
		$scope.botLane1 = [];
		$scope.botLane2 = [];
		$scope.jungle1 = [];
		$scope.jungle2 = [];
		//scope variables keeping track of the various scores:
		$scope.topScore = 0;
		$scope.midScore = 0;
		$scope.botScore = 0;
		$scope.jungleScore = 0;
		$scope.teamScore = 0;
		getAllChamps();
	};
	  
	$scope.topLane1 = [];
	$scope.topLane2 = [];
	$scope.midLane1 = [];
	$scope.midLane2 = [];
	$scope.botLane1 = [];
	$scope.botLane2 = [];
	$scope.jungle1 = [];
	$scope.jungle2 = [];
	//scope variables keeping track of the various scores:
	$scope.topScore = 0;
	$scope.midScore = 0;
	$scope.botScore = 0;
	$scope.jungleScore = 0;
	$scope.teamScore = 0;
	getAllChamps();
	
	}
]);