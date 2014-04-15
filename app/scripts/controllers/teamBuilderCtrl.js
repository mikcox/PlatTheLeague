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
				var multiplier = 0;
				for(var i = 0; i < selectedChamp["WeakAgainst"].length; i++){
					if($.inArray(selectedChamp["WeakAgainst"][i]["champName"], uniqueNames) == -1 ){
						//calculate a confidence score:
						upvotes = parseInt(selectedChamp["WeakAgainst"][i]["upvotes"]);
						downvotes = parseInt(selectedChamp["WeakAgainst"][i]["downvotes"]);
						if(downvotes > upvotes){
							multiplier = 0;
						} else {
							multiplier = Math.pow(upvotes-downvotes, 1/4);
						}
						confidence = Math.round(multiplier * upvotes/(downvotes+1)) / 10;
						
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
						if(downvotes > upvotes){
							multiplier = 0;
						} else {
							multiplier = Math.pow(upvotes-downvotes, 1/4);
						}
						confidence = Math.round(multiplier * upvotes/(downvotes+1)) / 10;
						
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
						if(downvotes > upvotes){
							multiplier = 0;
						} else {
							multiplier = Math.pow(upvotes-downvotes, 1/4);
						}
						confidence = Math.round(multiplier * upvotes/(downvotes+1)) / 10;
						
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
		$scope.lateGameScore = 0;
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
						$scope.topScore = $scope.topScore + $scope.topLane1[i]["GoodWith"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["GoodWith"][j]["champName"]){
						$scope.topScore = $scope.topScore - $scope.topLane2[i]["GoodWith"][j]["confidence"]/3;
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
						$scope.midScore = $scope.midScore + $scope.midLane1[i]["GoodWith"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["GoodWith"][j]["champName"]){
						$scope.midScore = $scope.midScore - $scope.midLane2[i]["GoodWith"][j]["confidence"]/3;
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
						$scope.botScore = $scope.botScore + $scope.botLane1[i]["GoodWith"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["GoodWith"][j]["champName"]){
						$scope.botScore = $scope.botScore - $scope.botLane2[i]["GoodWith"][j]["confidence"]/3;
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
		//jungle/top lane influence:
		//if we see that jungle 1 is weak against top 2, subtract that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.topLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against top 2, add that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.topLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle/mid lane influence:
		//if we see that jungle 1 is weak against mid 2, subtract that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.midLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against mid 2, add that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.midLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle/bot lane influence:
		//if we see that jungle 1 is weak against bot 2, subtract that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore - $scope.botLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against bot 2, add that confidence:
		for(var i = 0; i < $scope.jungle1.length; i++){
			for(var j = 0; j < $scope.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.botLane2.length; k++){
					if($scope.botLane2[k]["ChampionName"]["pretty"] == $scope.jungle1[i]["StrongAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.jungleScore = $scope.jungleScore + $scope.botLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		
		//late game influence:
		$scope.lateGameScore = 0;
		//if we see that team 1 has champs that work well together across different lanes, add that confidence with a small multiplier:
		//bot/top:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/mid:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/jungle:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/mid:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.topLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/jungle:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.topLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/jungle:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle1.length; k++){
					if($scope.jungle1[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.midLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//more late game influence:
		//if we see that team 2 has champs that work well together across different lanes, subtract that confidence with a small multiplier:
		//bot/top:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/mid:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/jungle:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/mid:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.topLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/jungle:
		for(var i = 0; i < $scope.topLane2.length; i++){
			for(var j = 0; j < $scope.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.topLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.topLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/jungle:
		for(var i = 0; i < $scope.midLane2.length; i++){
			for(var j = 0; j < $scope.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < $scope.jungle2.length; k++){
					if($scope.jungle2[k]["ChampionName"]["pretty"] == $scope.midLane2[i]["GoodWith"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.midLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//more late game influence:
		//if we see that a team has champs that are weak against champs in different lanes of the other team, handle that confidence with a small multiplier:
		//bot1/top2:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot1/mid2:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/top1:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/mid1:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/top2:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.midLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/mid2:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["WeakAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.topLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		
		//and finally again do the opposite for anybody on team 1 who is strong against team 2 across lanes:
		//bot1/top2:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot1/mid2:
		for(var i = 0; i < $scope.botLane1.length; i++){
			for(var j = 0; j < $scope.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.botLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.botLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/top1:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane1.length; k++){
					if($scope.topLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/mid1:
		for(var i = 0; i < $scope.botLane2.length; i++){
			for(var j = 0; j < $scope.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane1.length; k++){
					if($scope.midLane1[k]["ChampionName"]["pretty"] == $scope.botLane2[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore - $scope.botLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/top2:
		for(var i = 0; i < $scope.midLane1.length; i++){
			for(var j = 0; j < $scope.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.topLane2.length; k++){
					if($scope.topLane2[k]["ChampionName"]["pretty"] == $scope.midLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.midLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/mid2:
		for(var i = 0; i < $scope.topLane1.length; i++){
			for(var j = 0; j < $scope.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < $scope.midLane2.length; k++){
					if($scope.midLane2[k]["ChampionName"]["pretty"] == $scope.topLane1[i]["StrongAgainst"][j]["champName"]){
						$scope.lateGameScore = $scope.lateGameScore + $scope.topLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		
		//hopefully done....?
		
		//round all of our scores to two decimal places:
		$scope.topScore = Math.round($scope.topScore*100)/100;
		$scope.midScore = Math.round($scope.midScore*100)/100;
		$scope.botScore = Math.round($scope.botScore*100)/100;
		$scope.jungleScore = Math.round($scope.jungleScore*100)/100;
		$scope.lateGameScore = Math.round($scope.lateGameScore*100)/100;
		
		
		//and finally add up all lane scores to get a team score:
		$scope.teamScore = $scope.topScore + $scope.midScore + $scope.botScore + $scope.jungleScore + $scope.lateGameScore;
		$scope.teamScore = Math.round($scope.teamScore*100)/100;
		
		//and populate our nice JSON object for highcharts plotting later:
		if($scope.topScore >= 0){
			$scope.scoresObject["top1"] = (-1) * $scope.topScore;
			$scope.scoresObject["top2"] = 0;
		} else {
			$scope.scoresObject["top1"] = 0;
			$scope.scoresObject["top2"] = (-1) * $scope.topScore;
		}
		if($scope.midScore >= 0){
			$scope.scoresObject["mid1"] = (-1) * $scope.midScore;
			$scope.scoresObject["mid2"] = 0;
		} else {
			$scope.scoresObject["mid1"] = 0;
			$scope.scoresObject["mid2"] = (-1) * $scope.midScore;
		}
		if($scope.botScore >= 0){
			$scope.scoresObject["bot1"] = (-1) * $scope.botScore;
			$scope.scoresObject["bot2"] = 0;
		} else {
			$scope.scoresObject["bot1"] = 0;
			$scope.scoresObject["bot2"] = (-1) * $scope.botScore;
		}
		if($scope.jungleScore >= 0){
			$scope.scoresObject["jungle1"] = (-1) * $scope.jungleScore;
			$scope.scoresObject["jungle2"] = 0;
		} else {
			$scope.scoresObject["jungle1"] = 0;
			$scope.scoresObject["jungle2"] = (-1) * $scope.jungleScore;
		}
		if($scope.lateGameScore >= 0){
			$scope.scoresObject["lateGame1"] = (-1) * $scope.lateGameScore;
			$scope.scoresObject["lateGame2"] = 0;
		} else {
			$scope.scoresObject["lateGame1"] = 0;
			$scope.scoresObject["lateGame2"] = (-1) * $scope.lateGameScore;
		}
		if($scope.teamScore >= 0){
			$scope.scoresObject["team1"] = (-1) * $scope.teamScore;
			$scope.scoresObject["team2"] = 0;
		} else {
			$scope.scoresObject["team1"] = 0;
			$scope.scoresObject["team2"] = (-1) * $scope.teamScore;
		}
		
		$scope.refreshChartConfig();
		
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
	
	//code for highcharts graphing:
	$scope.refreshChartConfig = function() {
		var categories = ['Top', 'Mid', 'Bot', 'Jungle', 'Late Game', 'Team'];
		$scope.chartConfig = {
				"options": {
				    "chart": {
				      "type": "bar"
				    },
				    "plotOptions": {
				      "series": {
				        "stacking": "normal"
				      }
				    }
				  },
				  xAxis: [{
		                reversed: true,
		                categories: categories,
		                labels: {
		                    step: 1
		                }
		            }, { // mirror axis on right side
		                opposite: true,
		                reversed: true,
		                categories: categories,
		                linkedTo: 0,
		                labels: {
		                    step: 1
		                }
		            }],
		            
		            yAxis: {
		                title: {
		                    text: null
		                },
		                min: -10,
		                max: 10
		            },
				  series: [{
		                name: 'Team 1',
		                data: [$scope.scoresObject["top1"],
		                       $scope.scoresObject["mid1"],
		                       $scope.scoresObject["bot1"],
		                       $scope.scoresObject["jungle1"],
		                       $scope.scoresObject["lateGame1"],
		                       $scope.scoresObject["team1"],
		                ],
		                color:'#3399FF'
		            }, {
		            	name: 'Team 2',
		                data: [$scope.scoresObject["top2"],
		                       $scope.scoresObject["mid2"],
		                       $scope.scoresObject["bot2"],
		                       $scope.scoresObject["jungle2"],
		                       $scope.scoresObject["lateGame2"],
		                       $scope.scoresObject["team2"],
		                ],
		                color:'#CC3399'
		            }
		            
		            ],
				  "title": {
				    "text": "Hello"
				  },
				  "loading": false,
				  "size": {}
				}
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
		$scope.lateGameScore = 0;
		$scope.teamScore = 0;
		$scope.scoresObject = {
				top1: null,
				top2: null,
				mid1: null,
				mid2: null,
				bot1: null,
				bot2: null,
				jungle1: null,
				jungle2: null,
				lateGame1: null,
				lateGame2: null,
				team1: null,
				team2: null
		}
		getAllChamps();
		$scope.refreshChartConfig();
	};
	  
	
	
	//THE ACTUAL CODE THAT RUNS ON WEBPAGE LOAD
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
	$scope.scoresObject = {
			top1: null,
			top2: null,
			mid1: null,
			mid2: null,
			bot1: null,
			bot2: null,
			jungle1: null,
			jungle2: null,
			lateGame1: null,
			lateGame2: null,
			team1: null,
			team2: null
	}
	getAllChamps();
	$scope.refreshChartConfig();
	
	}
	
]);