<!doctype html>
<div class="container-fluid">
	<div id="circle">&nbsp;</div>
		<div class="row-fluid" style="color:black">
			<div id="allChampsTable | orderBy:champ.ChampionName.pretty" style="float:left; width:20%;">
				<table ng-table class="table">
					<th>
						<input type="text" class="input-large search-query" data-ng-model="allChampFilterQuery" placeholder="Search"/>
						<br>
						All Champions: 
					</th>
					<tr ng-repeat="champ in allChamps.Champions | filter:allChampFilterQuery 
									| orderBy : 'ChampionName.pretty'">
						<td>
							<div class="btn btn-draggable" data-drag="true" data-jqyoui-options="{revert: 'invalid'}" ng-model="allChamps.Champions" 
							jqyoui-draggable="{animate: true}" ng-click="ajaxGetChampInfo(champ.ChampionName.lower)">
								<img src="{{champ.ChampionImageLocation}}" style="width: 20px; height:20px;"></img> {{champ.ChampionName.pretty}}
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div id = "restOfPage" style= "float:left; width:80%">
				
				<div>
					<img src="{{selectedChamp.ChampionImageLocation}}"></img>
					<table ng-table class="table" ng-show="selectedChamp">
						<th>{{selectedChamp.ChampionName.pretty}} is Weak Against:</th>
						<th>{{selectedChamp.ChampionName.pretty}} is Strong Against:</th>
						<th>{{selectedChamp.ChampionName.pretty}} is Good With:</th>
						<tr>
							<td><li ng-repeat="counterChamp in selectedChamp.WeakAgainst">
								{{counterChamp.champName}} (Confidence: {{counterChamp.confidence}}, from {{counterChamp.upvotes + counterChamp.downvotes}} votes)
							</li></td>
							<td><li ng-repeat="badChamp in selectedChamp.StrongAgainst">
								{{badChamp.champName}} (Confidence: {{badChamp.confidence}}, from {{badChamp.upvotes + badChamp.downvotes}} votes)
							</li></td>
							<td><li ng-repeat="goodWith in selectedChamp.GoodWith">
								{{goodWith.champName}} (Confidence: {{goodWith.confidence}}, from {{goodWith.upvotes + goodWith.downvotes}} votes)
							</li></td>
						</tr>
					</table>
				</div>
				
				{{error}}
			</div>
		</div>
	</div>	
</div>
</html>