<!doctype html>
<div class="container-fluid">
	<div id="circle">&nbsp;</div>
		<div class="row-fluid" style="color:black">
			<div id="allChampsList" class="thumbnail" style="float:left; width:15%;" data-drop="true" data-jqyoui-options ng-model="allChamps"
			jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions', onDrop: 'filterChamps'}">
				<input type="text" class="input-large search-query" data-ng-model="allChampFilterQuery" 
				ng-change="filterChamps()" placeholder="Search" style="width:70%"/>
						<br>
						All Champions: 
						<div ng-repeat="champ in allChamps | allChampTextFilter:allChampFilterQuery">
							<div class="btn btn-draggable" data-drag="true" data-jqyoui-options="{revert: 'invalid'}" ng-model="allChamps" 
							jqyoui-draggable="{index: $index, animate:true, applyFilter:'filterChamps'}"
							ng-click="ajaxGetChampInfo(champ.ChampionName.lower)">
								<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
							</div>
							<br>
						</div>
							
			</div>
			<div id = "restOfPage" style="width:80%; position:absolute; left:20%;">
				<div id="mapDivs" style="width:50%; position:absolute;">
				<h2 style="text-align: center;">Drag Champions to Map:</h2>
					<img src="images/season4map.jpg"></img>
					
					<!-- Boxes for Top Lane -->
					<div class="thumbnail" data-drop="true" data-jqyoui-options ng-model="topLane1"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" style="width: 12%; min-height: 5%; position:absolute;
						left:5%; top: 20%; padding:0px;">
						<p ng-hide="topLane1.length > 0" style="text-align: center;">Team 1 Top</p>
						<div class="btn btn-draggable" ng-repeat="champ in topLane1" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="topLane1" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					<div class="thumbnail" style="width: 12%; min-height: 5%; position:absolute; left:18%; top: 7%; padding:0px;" data-drop="true"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" data-jqyoui-options ng-model="topLane2">
						<p ng-hide="topLane2.length > 0" style="text-align: center;">Team 2 Top</p>
						<div class="btn btn-draggable" ng-repeat="champ in topLane2" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="topLane2" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					
					<!-- Boxes for Mid Lane -->
					<div class="thumbnail" data-drop="true" data-jqyoui-options ng-model="midLane1"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" style="width: 12%; min-height: 5%; position:absolute;
						left:38%; top: 54%; padding:0px;">
						<p ng-hide="midLane1.length > 0" style="text-align: center;">Team 1 Mid</p>
						<div class="btn btn-draggable" ng-repeat="champ in midLane1" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="midLane1" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					<div class="thumbnail" style="width: 12%; min-height: 5%; position:absolute; left:48%; top: 42%; padding:0px;" data-drop="true"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" data-jqyoui-options ng-model="midLane2">
						<p ng-hide="midLane2.length > 0" style="text-align: center;">Team 2 Mid</p>
						<div class="btn btn-draggable" ng-repeat="champ in midLane2" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="midLane2" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					
					<!-- Boxes for Bot Lane -->
					<div class="thumbnail" data-drop="true" data-jqyoui-options ng-model="botLane1"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" style="width: 12%; min-height: 5%; position:absolute;
						left:70%; top: 85%; padding:0px;">
						<p ng-hide="botLane1.length > 0" style="text-align: center;">Team 1 Bot</p>
						<div class="btn btn-draggable" ng-repeat="champ in botLane1" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="botLane1" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					<div class="thumbnail" style="width: 12%; min-height: 5%; position:absolute; left:85%; top: 73%; padding:0px;" data-drop="true"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" data-jqyoui-options ng-model="botLane2">
						<p ng-hide="botLane2.length > 0" style="text-align: center;">Team 2 Bot</p>
						<div class="btn btn-draggable" ng-repeat="champ in botLane2" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="botLane2" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					
					<!-- Boxes for Jungle -->
					<div class="thumbnail" data-drop="true" data-jqyoui-options ng-model="jungle1"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" style="width: 12%; min-height: 5%; position:absolute;
						left:22%; top: 40%; padding:0px;">
						<p ng-hide="jungle1.length > 0">Team 1 Jungle</p>
						<div class="btn btn-draggable" ng-repeat="champ in jungle1" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="jungle1" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					<div class="thumbnail" style="width: 12%; min-height: 5%; position:absolute; left:65%; top: 54%; padding:0px;" data-drop="true"
						jqyoui-droppable="{index: $index, onDrop: 'populateGamePredictions'}" data-jqyoui-options ng-model="jungle2">
						<p ng-hide="jungle2.length > 0">Team 2 Jungle</p>
						<div class="btn btn-draggable" ng-repeat="champ in jungle2" data-drag="true" data-jqyoui-options="{revert: 'invalid', animate:true}"
							ng-model="jungle2" jqyoui-draggable="{index: $index}"
							style="width:95%; text-align:center; padding: 1px;">
							<img ng-src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
						</div>
					</div>	
					<button class="btn btn-warning" ng-click="resetPage()">Reset</button>
				</div>
				
				
				
				<div id="statsDiv" style="width:50%; position:absolute; right:0%; text-align:center;">
					<h2>Game Predictions:</h2>
					<table id="topLaneDiv" class="thumbnail" ng-show="topLane1.length > 0 || topLane2.length > 0"
					style="margin:0 auto; text-align:center;">
						<th colspan="3" style="width:100%;"><h3> Top: </h3><th>
						<tr>
							<td id="topLeftImages" style="width: 40%; text-align:right">
								<div ng-hide="topLane1.length > 0"> 
									<p> </p>
								</div>
								<div ng-repeat="champ in topLane1">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
							<td id="topvsDiv" style="padding:10px; vertical-align:middle;">
								<p>vs.</p>
							</td>
							<td id="topRightImages" style="width: 40%; text-align:left">
								<p ng-hide="topLane2.length > 0"> </p>
								<div ng-repeat="champ in topLane2">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
						</tr>
						<tr ng-show="topScore">
							<td colspan="3">
								{{topScore}}
							</td>
						</tr>
						</table>
						<br>
						<table id="midLaneDiv" class="thumbnail" ng-show="midLane1.length > 0 || midLane2.length > 0"
						style="margin:0 auto; text-align:center;">
						<th colspan="3" style="width:100%;"><h3> Mid: </h3><th>
						<tr>
							<td id="midLeftImages" style="width: 40%; text-align:right">
								<div ng-hide="midLane1.length > 0"> 
									<p> </p>
								</div>
								<div ng-repeat="champ in midLane1">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
							<td id="midvsDiv" style="padding:10px; vertical-align:middle;">
								<p>vs.</p>
							</td>
							<td id="midRightImages" style="width: 40%; text-align:left">
								<p ng-hide="midLane2.length > 0"> </p>
								<div ng-repeat="champ in midLane2">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
						</tr>
						<tr ng-show="midScore">
							<td colspan="3">
								{{midScore}}
							</td>
						</tr>
						</table>
						<br>
						<table id="botLaneDiv" class="thumbnail" ng-show="botLane1.length > 0 || botLane2.length > 0"
						style="margin:0 auto; text-align:center;">
						<th colspan="3" style="width:100%;"><h3> Bottom: </h3><th>
						<tr>
							<td id="botLeftImages" style="width: 40%; text-align:right">
								<div ng-hide="botLane1.length > 0"> 
									<p> </p>
								</div>
								<div ng-repeat="champ in botLane1">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
							<td id="botvsDiv" style="padding:10px; vertical-align:middle;">
								<p>vs.</p>
							</td>
							<td id="botRightImages" style="width: 40%; text-align:left">
								<p ng-hide="botLane2.length > 0"> </p>
								<div ng-repeat="champ in botLane2">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
						</tr>
						<tr ng-show="botScore">
							<td colspan="3">
								{{botScore}}
							</td>
						</tr>
						</table>
						<br>
						<table id="jungleDiv" class="thumbnail" ng-show="jungle1.length > 0 || jungle2.length > 0"
						style="margin:0 auto; text-align:center;">
						<th colspan="3" style="width:100%;"><h3> Jungle Influence: </h3><th>
						<tr>
							<td id="jungleLeftImages" style="width: 40%; text-align:right">
								<div ng-hide="jungle1.length > 0"> 
									<p> </p>
								</div>
								<div ng-repeat="champ in jungle1">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
							<td id="junglevsDiv" style="padding:10px; vertical-align:middle;">
								<p>vs.</p>
							</td>
							<td id="jungleRightImages" style="width: 40%; text-align:left">
								<p ng-hide="jungle2.length > 0"> </p>
								<div ng-repeat="champ in jungle2">
									<img ng-src="{{champ.ChampionImageLocation}}" style="width: 60px; height:60px;"></img>
								</div>
							</td>
						</tr>
						<tr ng-show="jungleScore">
							<td colspan="3">
								{{jungleScore}}
							</td>
						</tr>
						</table>
						<br>
						<table id="teamDiv" class="thumbnail" ng-show="teamScore"
						style="margin:0 auto; text-align:center;">
						<th colspan="3" style="width:100%;"><h3>Overall Team Score:</h3><th>
						<tr>
						<tr ng-show="teamScore">
							<td colspan="3">
								{{teamScore}}
								<br>
								<br>
								<h3>Prediction:</h3>
							</td>
						</tr>
						<tr ng-show="teamScore > 0">
							<td colspan="3">
								Blue Team Wins!
							</td>
						</tr>
						<tr ng-show="teamScore < 0">
							<td colspan="3">
								Purple Team Wins!
							</td>
						</tr>
						<tr ng-show="teamScore == 0">
							<td colspan="3">
								Could go either way!
							</td>
						</tr>
						</table>
					</div>
				</div>
					{{error}}
			</div>
		</div>
	</div>	
</div>

</html>


