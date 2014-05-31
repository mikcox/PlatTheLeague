'use strict';
platTheLeagueModule.controller('teamBuilderCtrl', [
	'$scope',
	'$filter',
	'$modal',
	'$q',
	'dataFactory',
	'$timeout',
	function ($scope, $filter, $modal, $q, dataFactory, $timeout) {
		
		$scope.getAllChamps = function() {
			dataFactory.readJSON('champion_json/all_champs.json').then(function(data) {
				$scope.allChamps = data["Champions"];
				//$scope.filterChamps();
			});
			
		}
		
		$scope.ajaxGetChampInfo = function(champion) {		
			
			//change the champion's name into what lolcounter expects
			champion = champion.toLowerCase();
			champion = champion.replace(" ", "");
			champion = champion.replace("'", "");
			champion = champion.replace(".", "");
			
			//set $scope.selectedChamp to the champ that was clicked and return a modal
			$scope.selectedChamp = $scope.getCounterJSON(champion, true);
		
			
		}
		//reads the contents of the champion's JSON, does a bit of formatting, and generates a $scope.error if there is one.
		$scope.getCounterJSON = function(champion, openModal) {
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
			//alert(JSON.stringify($scope.allChamps[indexOfMatch]));
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
		};
	
	//Function to populate game prediction panel
	$scope.populateGamePredictions = function () {
		$scope.getChampSuggestions();
		$scope = dataFactory.calculateScores($scope);
		$scope.chartConfig = $scope.refreshChartConfig();
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
						scopeObj.topLane1.push($scope.getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope if it's a unique name
						if(JSON.stringify($scope.champSuggestions["top"]).indexOf(scopeObj.allChamps[k]["ChampionName"]["pretty"]) == -1){
							$scope.champSuggestions["top"].push({
								"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
								"teamScore" : scopeObj.teamScore
							});
						}
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
						scopeObj.midLane1.push($scope.getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope if it's a unique name
						if(JSON.stringify($scope.champSuggestions["mid"]).indexOf(scopeObj.allChamps[k]["ChampionName"]["pretty"]) == -1){
							$scope.champSuggestions["mid"].push({
								"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
								"teamScore" : scopeObj.teamScore
							});
						}
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
						scopeObj.botLane1.push($scope.getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope if it's a unique name
						if(JSON.stringify($scope.champSuggestions["bot"]).indexOf(scopeObj.allChamps[k]["ChampionName"]["pretty"]) == -1){
							$scope.champSuggestions["bot"].push({
								"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
								"teamScore" : scopeObj.teamScore
							});
						}
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
						scopeObj.jungle1.push($scope.getCounterJSON(scopeObj.allChamps[k]["ChampionName"]["lower"], false));
						//Calculate the team scores
						scopeObj = dataFactory.calculateScores(scopeObj);
						//alert("champ: "+scopeObj.allChamps[k]["ChampionName"]["pretty"]+" score: "+scopeObj.teamScore);
						//save the resulting champ and score in an object on the scope if it's a unique name
						if(JSON.stringify($scope.champSuggestions["jungle"]).indexOf(scopeObj.allChamps[k]["ChampionName"]["pretty"]) == -1){
							$scope.champSuggestions["jungle"].push({
								"champ" : scopeObj.allChamps[k]["ChampionName"]["pretty"],
								"teamScore" : scopeObj.teamScore
							});
						}
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
	      templateUrl: 'views/champ_counter_modal_content.html',
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
		return $filter('allChampTextFilter')($scope.allChamps, $scope.allChampFilterQuery);
	};
	
	//for highcharts graphing:
	$scope.refreshChartConfig = function() {
		var categories = ['Top', 'Mid', 'Bot', 'Jungle', 'Late Game', 'Team'];
		return {
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
	};
	
	//for handling drag and drop clicking issues:
	$scope.onChampClick = function(champion) {
		if (!$scope.dragged) {
			$scope.ajaxGetChampInfo(champion);
		}
		$scope.dragged = false;
		$scope.selectedChamp = $scope.getCounterJSON(champion, false);
	};

	$scope.startDragging = function() {
		$scope.dragged = true;    
	};
	
	//for timers:
	$scope.toggleTimers = function () {
		$scope.timersCollapsed = !$scope.timersCollapsed;
	};
	$scope.startTimer = function (buff) {
		//set the passed buff's 'isRunning' to true if it wasn't running before
		if($scope.timers[buff].isRunning === false){
			$scope.timers[buff].isRunning = true;
		} else { // if the buff's timer WAS running:
			$scope.timers[buff].isRunning = false;
			$scope.timers[buff].minutes = $scope.timers[buff].startMinutes;
			$scope.timers[buff].seconds = $scope.timers[buff].startSeconds;
		}
		//count how many buff timers are running
		var runningCount = 0;
		for(var key in $scope.timers){
			if($scope.timers[key].isRunning){
				runningCount = runningCount+1;
			}
		}
		//alert(runningCount);
		//start the timeout sequence if exactly one buff is running
		if(runningCount === 1){
			$scope.mytimeout = $timeout($scope.onTimeout, 200);
		}
	};
	$scope.stopTimer = function (buff) {
		//set the passed buff's 'isRunning' to false if it wasn't running before
		if($scope.timers[buff].isRunning === true){
			$scope.timers[buff].isRunning = false;
			$scope.timers[buff].minutes = $scope.timers[buff].startMinutes;
			$scope.timers[buff].seconds = $scope.timers[buff].startSeconds;
		}
		//count how many buff timers are running
		var runningCount = 0;
		for(var key in $scope.timers){
			if($scope.timers[key].isRunning){
				runningCount = runningCount+1;
			}
		}
		//stop the timeout sequence if no timers are running
		if(runningCount === 0){
			$timeout.cancel($scope.mytimeout);
		}
	};
	//runs every 200ms, and updates all timers that are running
	$scope.onTimeout = function() {
		for(var key in $scope.timers) {
			if($scope.timers[key].isRunning) {
				//if minutes and seconds are both at 0, we're done!
				if($scope.timers[key].seconds === 0 && $scope.timers[key].minutes === 0){
					alert('done!');
				}
				//if seconds hit 0, decrement minutes
				if($scope.timers[key].seconds === 0){
					$scope.timers[key].minutes = $scope.timers[key].minutes - 1;
					$scope.timers[key].seconds = 59.8;
				} else {
					$scope.timers[key].seconds = Math.round(($scope.timers[key].seconds - 0.2)*10)/10;
				}
			}
		}
		$scope.mytimeout = $timeout($scope.onTimeout, 200);
	};
	
	
	$scope.resetPage = function(){
		$scope.init();
	};
	  
	$scope.init = function() {
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
		$scope.timers = {
			yourBlue: {startMinutes: 0, startSeconds: 10, minutes: 0, seconds:10, isRunning: false},
			yourRed: {startMinutes: 5, startSeconds: 0,minutes: 5, seconds:0, isRunning: false},
			theirBlue: {startMinutes: 5, startSeconds: 0,minutes: 5, seconds:0, isRunning: false},
			theirRed: {startMinutes: 5, startSeconds: 0,minutes: 5, seconds:0, isRunning: false},
			dragon: {startMinutes: 6, startSeconds: 0,minutes: 6, seconds:0, isRunning: false},
			baron: {startMinutes: 7, startSeconds: 0,minutes: 7, seconds:0, isRunning: false}
		};
		//variables for feedback
		$scope.wereWeCorrect = null;
		$scope.feedbackComments = null;
		
		//for drag and drop clicking issue
		$scope.dragged = false;
		
		//give $scope the Math service
		$scope.Math = window.Math;
		
		$scope.allChamps = $scope.getAllChamps();
		$scope.chartConfig = $scope.refreshChartConfig();
		$scope.timersCollapsed = true;
	};
	
	$scope.init();

}]);