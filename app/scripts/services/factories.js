'use strict';
/* Services */
platTheLeagueModule.factory('dataFactory', function ($http, $q) {
	var dataFactory = {};	
	
	dataFactory.readJSON = function(file) {
		var deferred = $q.defer();
		
		$http.get(file).success(function(data) {
			deferred.resolve(data);
		});
		
		return deferred.promise;
	}
	
	
	dataFactory.calculateScores = function (inputScope) {
		var scopeObj = inputScope;
		//scope variables keeping track of the various scores:
		scopeObj.topScore = 0;
		scopeObj.midScore = 0;
		scopeObj.botScore = 0;
		scopeObj.jungleScore = 0;
		scopeObj.lateGameScore = 0;
		scopeObj.teamScore = 0;
		
		
		//For the top lane score, start at 0
		scopeObj.topScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore - scopeObj.topLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore - scopeObj.topLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore + scopeObj.topLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore + scopeObj.topLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore + scopeObj.topLane1[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.topScore = scopeObj.topScore - scopeObj.topLane2[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		
		
	
		//For the mid lane score, start at 0
		scopeObj.midScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore - scopeObj.midLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore - scopeObj.midLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore + scopeObj.midLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore + scopeObj.midLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore + scopeObj.midLane1[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.midScore = scopeObj.midScore - scopeObj.midLane2[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		
		//For the bot lane score, start at 0
		scopeObj.botScore = 0;
		//if we see that lane 1 is weak against lane 2, subtract that confidence:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore - scopeObj.botLane1[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is strong against lane 1, subtract that confidence:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore - scopeObj.botLane2[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 is strong against lane 2, add that confidence:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore + scopeObj.botLane1[i]["StrongAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 2 is weak against lane 1, add that confidence:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore + scopeObj.botLane2[i]["WeakAgainst"][j]["confidence"];
					}
				}
			}
		}
		//if we see that lane 1 has champs that work well together, add that confidence:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore + scopeObj.botLane1[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that lane 2 has champs that work well together, subtract that confidence:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.botScore = scopeObj.botScore - scopeObj.botLane2[i]["GoodWith"][j]["confidence"]/2;
					}
				}
			}
		}
		
		//For jungle influence, start at 0
		scopeObj.jungleScore = 0;
		//if we see that jungle 1 is weak against jungle 2, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle1[i]["WeakAgainst"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that jungle 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle2[i]["StrongAgainst"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against jungle 2, add that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle1[i]["StrongAgainst"][j]["confidence"]/2;
					}
				}
			}
		}
		//if we see that jungle 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle2[i]["WeakAgainst"][j]["confidence"]/2;
					}
				}
			}
		}
		//jungle1/top2 lane influence:
		//if we see that jungle 1 is weak against top 2, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.topLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against top 2, add that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.topLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle1/mid2 lane influence:
		//if we see that jungle 1 is weak against mid 2, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.midLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against mid 2, add that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.midLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle1/bot2 lane influence:
		//if we see that jungle 1 is weak against bot 2, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 2 is strong against jungle 1, subtract that confidence:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.botLane2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 1 is strong against bot 2, add that confidence:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 2 is weak against jungle 1, add that confidence:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.botLane2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle2/top2 lane influence:
		//if we see that jungle 2 is weak against top 1, add that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 1 is strong against jungle 2, add that confidence:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.topLane1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 2 is strong against top 1, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that top 1 is weak against jungle 2, subtract that confidence:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.topLane1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle2/mid1 lane influence:
		//if we see that jungle 2 is weak against mid 1, add that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 1 is strong against jungle 2, add that confidence:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.midLane1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 2 is strong against mid 1, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that mid 1 is weak against jungle 2, subtract that confidence:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.midLane1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//jungle2/bot1 lane influence:
		//if we see that jungle 2 is weak against bot 1, add that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.jungle2[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 1 is strong against jungle 2, add that confidence:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore + scopeObj.botLane1[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that jungle 2 is strong against bot 1, subtract that confidence:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.jungle2[i]["StrongAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		//if we see that bot 1 is weak against jungle 2, subtract that confidence:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.jungleScore = scopeObj.jungleScore - scopeObj.botLane1[i]["WeakAgainst"][j]["confidence"]/3;
					}
				}
			}
		}
		
		//late game influence:
		scopeObj.lateGameScore = 0;
		//if we see that team 1 has champs that work well together across different lanes, add that confidence with a small multiplier:
		//bot/top:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/bot:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/mid:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/bot:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/jungle:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/bot:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.jungle1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/mid:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/top:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/jungle:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/top:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.jungle1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/jungle:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle1.length; k++){
					if(scopeObj.jungle1[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/mid:
		for(var i = 0; i < scopeObj.jungle1.length; i++){
			for(var j = 0; j < scopeObj.jungle1[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.jungle1[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.jungle1[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//more late game influence:
		//if we see that team 2 has champs that work well together across different lanes, subtract that confidence with a small multiplier:
		//bot/top:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/bot:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/mid:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/bot:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot/jungle:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/bot:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.jungle2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/mid:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/top:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//top/jungle:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/top:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.jungle2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid/jungle:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.jungle2.length; k++){
					if(scopeObj.jungle2[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//jungle/mid:
		for(var i = 0; i < scopeObj.jungle2.length; i++){
			for(var j = 0; j < scopeObj.jungle2[i]["GoodWith"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.jungle2[i]["GoodWith"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.jungle2[i]["GoodWith"][j]["confidence"]/5;
					}
				}
			}
		}
		//more late game influence:
		//if we see that a team has champs that are weak against champs in different lanes of the other team, handle that confidence with a small multiplier:
		//bot1/top2:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top2/bot1:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot1/mid2:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid2/top1:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/top1:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/bot2:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/mid1:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/bot2:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/top2:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top2/mid1:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/mid2:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane1[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid2/top1:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["WeakAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["WeakAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane2[i]["WeakAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		
		
		//and finally again do the opposite for anybody on team 1 who is strong against team 2 across lanes:
		//bot1/top2:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top2/bot1:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot1/mid2:
		for(var i = 0; i < scopeObj.botLane1.length; i++){
			for(var j = 0; j < scopeObj.botLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.botLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.botLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid2/bot1:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane1.length; k++){
					if(scopeObj.botLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/top1:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/bot2:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//bot2/mid1:
		for(var i = 0; i < scopeObj.botLane2.length; i++){
			for(var j = 0; j < scopeObj.botLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.botLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.botLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/bot2:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.botLane2.length; k++){
					if(scopeObj.botLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid1/top2:
		for(var i = 0; i < scopeObj.midLane1.length; i++){
			for(var j = 0; j < scopeObj.midLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane2.length; k++){
					if(scopeObj.topLane2[k]["ChampionName"]["pretty"] == scopeObj.midLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.midLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top2/mid1:
		for(var i = 0; i < scopeObj.topLane2.length; i++){
			for(var j = 0; j < scopeObj.topLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane1.length; k++){
					if(scopeObj.midLane1[k]["ChampionName"]["pretty"] == scopeObj.topLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.topLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//top1/mid2:
		for(var i = 0; i < scopeObj.topLane1.length; i++){
			for(var j = 0; j < scopeObj.topLane1[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.midLane2.length; k++){
					if(scopeObj.midLane2[k]["ChampionName"]["pretty"] == scopeObj.topLane1[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore + scopeObj.topLane1[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		//mid2/top1:
		for(var i = 0; i < scopeObj.midLane2.length; i++){
			for(var j = 0; j < scopeObj.midLane2[i]["StrongAgainst"].length; j++){
				for(var k = 0; k < scopeObj.topLane1.length; k++){
					if(scopeObj.topLane1[k]["ChampionName"]["pretty"] == scopeObj.midLane2[i]["StrongAgainst"][j]["champName"]){
						scopeObj.lateGameScore = scopeObj.lateGameScore - scopeObj.midLane2[i]["StrongAgainst"][j]["confidence"]/5;
					}
				}
			}
		}
		
		//hopefully done....?
		
		//round all of our scores to two decimal places:
		scopeObj.topScore = Math.round(scopeObj.topScore*100)/100;
		scopeObj.midScore = Math.round(scopeObj.midScore*100)/100;
		scopeObj.botScore = Math.round(scopeObj.botScore*100)/100;
		scopeObj.jungleScore = Math.round(scopeObj.jungleScore*100)/100;
		scopeObj.lateGameScore = Math.round(scopeObj.lateGameScore*100)/100;
		
		
		//and finally add up all lane scores to get a team score:
		scopeObj.teamScore = scopeObj.topScore + scopeObj.midScore + scopeObj.botScore + scopeObj.jungleScore + scopeObj.lateGameScore;
		scopeObj.teamScore = Math.round(scopeObj.teamScore*100)/100;
		
		//and populate our nice JSON object for highcharts plotting later:
		if(scopeObj.topScore >= 0){
			scopeObj.scoresObject["top1"] = (-1) * scopeObj.topScore;
			scopeObj.scoresObject["top2"] = 0;
		} else {
			scopeObj.scoresObject["top1"] = 0;
			scopeObj.scoresObject["top2"] = (-1) * scopeObj.topScore;
		}
		if(scopeObj.midScore >= 0){
			scopeObj.scoresObject["mid1"] = (-1) * scopeObj.midScore;
			scopeObj.scoresObject["mid2"] = 0;
		} else {
			scopeObj.scoresObject["mid1"] = 0;
			scopeObj.scoresObject["mid2"] = (-1) * scopeObj.midScore;
		}
		if(scopeObj.botScore >= 0){
			scopeObj.scoresObject["bot1"] = (-1) * scopeObj.botScore;
			scopeObj.scoresObject["bot2"] = 0;
		} else {
			scopeObj.scoresObject["bot1"] = 0;
			scopeObj.scoresObject["bot2"] = (-1) * scopeObj.botScore;
		}
		if(scopeObj.jungleScore >= 0){
			scopeObj.scoresObject["jungle1"] = (-1) * scopeObj.jungleScore;
			scopeObj.scoresObject["jungle2"] = 0;
		} else {
			scopeObj.scoresObject["jungle1"] = 0;
			scopeObj.scoresObject["jungle2"] = (-1) * scopeObj.jungleScore;
		}
		if(scopeObj.lateGameScore >= 0){
			scopeObj.scoresObject["lateGame1"] = (-1) * scopeObj.lateGameScore;
			scopeObj.scoresObject["lateGame2"] = 0;
		} else {
			scopeObj.scoresObject["lateGame1"] = 0;
			scopeObj.scoresObject["lateGame2"] = (-1) * scopeObj.lateGameScore;
		}
		if(scopeObj.teamScore >= 0){
			scopeObj.scoresObject["team1"] = (-1) * scopeObj.teamScore;
			scopeObj.scoresObject["team2"] = 0;
		} else {
			scopeObj.scoresObject["team1"] = 0;
			scopeObj.scoresObject["team2"] = (-1) * scopeObj.teamScore;
		}
		return(scopeObj);
	};
	return dataFactory;
});