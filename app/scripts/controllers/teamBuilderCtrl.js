'use strict';
platTheLeagueModule.controller('teamBuilderCtrl', [
	'$scope',
	'$filter',
	'$modal',
	'$q',
	'dataFactory',
	function ($scope, $filter, $modal, $q, dataFactory) {
		
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
		$scope.getChampSuggestions();
		$scope = dataFactory.calculateScores($scope);
		$scope.refreshChartConfig();
	};
	
	//creating champion suggestions:
	$scope.getChampSuggestions = function(){
		var scopeObj = $scope;
		//top:
		$scope.champSuggestions["top"] = [];
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.allChamps.length; k++){
					if(scopeObj.allChamps[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["WeakAgainst"][j]["champName"]){
						//get the matching champ's counter JSON and temporarily add it to the topLane1 list:
						scopeObj.topLane1.push(getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope
						$scope.champSuggestions["top"].push({
							"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
							"teamScore" : scopeObj.teamScore
						});
						//remove the temporary champ from the topLane1 list
						scopeObj.topLane1.pop();
					}
				}
			}
		}
		//mid:
		$scope.champSuggestions["mid"] = [];
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.allChamps.length; k++){
					if(scopeObj.allChamps[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["WeakAgainst"][j]["champName"]){
						//get the matching champ's counter JSON and temporarily add it to the midLane1 list:
						scopeObj.midLane1.push(getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope
						$scope.champSuggestions["mid"].push({
							"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
							"teamScore" : scopeObj.teamScore
						});
						//remove the temporary champ from the midLane1 list
						scopeObj.midLane1.pop();
					}
				}
			}
		}
		//bot:
		$scope.champSuggestions["bot"] = [];
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.allChamps.length; k++){
					if(scopeObj.allChamps[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["WeakAgainst"][j]["champName"]){
						//get the matching champ's counter JSON and temporarily add it to the botLane1 list:
						scopeObj.botLane1.push(getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope
						$scope.champSuggestions["bot"].push({
							"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
							"teamScore" : scopeObj.teamScore
						});
						//remove the temporary champ from the botLane1 list
						scopeObj.botLane1.pop();
					}
				}
			}
		}
		//jungle:
		$scope.champSuggestions["jungle"] = [];
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.allChamps.length; k++){
					if(scopeObj.allChamps[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["WeakAgainst"][j]["champName"]){
						//get the matching champ's counter JSON and temporarily add it to the jungle1 list:
						scopeObj.jungle1.push(getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope
						$scope.champSuggestions["jungle"].push({
							"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
							"teamScore" : scopeObj.teamScore
						});
						//remove the temporary champ from the jungle1 list
						scopeObj.jungle1.pop();
					}
				}
			}
		}
	};
	
	//for popup windows
	$scope.openChampCountersModal = function (champ) {

		var modalInstance = $modal.open({
	      templateUrl: 'views/champ_counter_modal_content.php',
	      controller: 'modalInstanceCtrl',
	      resolve: {
	    	  data: function () {
	    		  return champ;
	    	  }
	      }
		});
	    
	};
	  
	//for drag and drop:
	$scope.filterChamps = function() {
		$scope.filteredChamps = $filter('allChampTextFilter')($scope.allChamps, $scope.allChampFilterQuery);
		return $scope.filteredChamps;
	};
	
	//for highcharts graphing:
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
				    },
				    tooltip: {
		            	
		                formatter: function(){
		                    return '<b>'+this.series.name+' advantage: </b>'+ Highcharts.numberFormat(Math.abs(this.point.y), 2);
		                }
		            }
				  },
				  xAxis: [{
		                reversed: true,
		                categories: categories,
		                gridLineWidth: 2,
		                labels: {
		                    step: 1
		                }
		            }, { // mirror axis on right side
		                opposite: true,
		                reversed: true,
		                categories: categories,
		                gridLineWidth: 2,
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
				    "text": "Scoring Breakdown"
				  },
				  "loading": false,
				  "size": {}
				}
	};
	
	//for handling resizing of tab content:
	$scope.triggerResize = function() {
		  $(window).resize();
	}
	
	$scope.$watch('teamScore', function() {
		setTimeout($scope.triggerResize, 1);
      });
	
	//for submitting feedback:
	$scope.submitFeedback = function(wereWeCorrect, feedbackComments) {
		var feedbackJSON = {
			"feedback":[{
				"wereWeCorrect":wereWeCorrect,
				"comments":feedbackComments
			}]	
		};
		var feedback = JSON.stringify(feedbackJSON);
		$.ajax({
			type: 'POST',
			url: 'scripts/button_actions/submitFeedback.php',
			data: { Feedback: feedback }
		}).success(function(data) {
			alert('Feedback received.  Thanks!');
			$scope.resetPage();
		});
	}
	
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
		};
		$scope.champSuggestions = {
			top: [],
			mid: [],
			bot: [],
			jungle: []
		};
		$scope.wereWeCorrect = null;
		$scope.feedbackComments = null;
		
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
	};
	$scope.champSuggestions = {
			top: [],
			mid: [],
			bot: [],
			jungle: []
	};
	//variables for feedback
	$scope.wereWeCorrect = null;
	$scope.feedbackComments = null;
	
	getAllChamps();
	$scope.refreshChartConfig();
	}
	
]);