<div style="color:black;">
	<div class="modal-header">
		<img ng-src="{{selectedChamp.ChampionImageLocation}}"></img> <h3> {{selectedChamp.ChampionName.pretty}} Counter Information:</h3>
	</div>
	<div class="modal-body">
			<table ng-table class="table" ng-show="selectedChamp">
				<th><h3>{{selectedChamp.ChampionName.pretty}} is Weak Against:</h3></th>
				<th><h3>{{selectedChamp.ChampionName.pretty}} is Strong Against:</h3></th>
				<th><h3>{{selectedChamp.ChampionName.pretty}} is Good With:</h3></th>
				<tr>
					<td><li ng-repeat="counterChamp in selectedChamp.WeakAgainst | orderBy: 'confidence' : true">
						{{counterChamp.champName}} ({{counterChamp.confidence}})
					</li></td>
					<td><li ng-repeat="badChamp in selectedChamp.StrongAgainst | orderBy: 'confidence' : true"">
						{{badChamp.champName}} ({{badChamp.confidence}})
					</li></td>
					<td><li ng-repeat="goodWith in selectedChamp.GoodWith | orderBy: 'confidence' : true"">
						{{goodWith.champName}} ({{goodWith.confidence}})
					</li></td>
				</tr>
			</table>
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" ng-click="cancel()">Close</button>
	</div>
</div>