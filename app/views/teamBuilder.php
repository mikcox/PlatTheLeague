<div class="container-fluid">
	<div id="circle">&nbsp;</div>
		<div class="row-fluid" style="color:black">
			<input type="text" class="input-large search-query" id="championSearchBox" data-ng-model="championNameQuery" placeholder="Search for a Champion"/>
			<button class="btn btn-success" ng-click="ajaxGetChampInfo(championNameQuery)" >Search</button>
			
			<div>
				<table ng-table class="table" ng-show="selectedChamp">
					<th>{{selectedChamp.ChampionName}} is Weak Against:</th>
					<th>{{selectedChamp.ChampionName}} is Strong Against:</th>
					<th>{{selectedChamp.ChampionName}} is Good With:</th>
					<tr>
						<td><li ng-repeat="counterChamp in selectedChamp.WeakAgainst">{{counterChamp.champName}} ({{counterChamp.certainty}})</li></td>
						<td><li ng-repeat="badChamp in selectedChamp.StrongAgainst">{{badChamp.champName}} ({{badChamp.certainty}})</li></td>
						<td><li ng-repeat="goodWith in selectedChamp.GoodWith">{{goodWith.champName}} ({{goodWith.certainty}})</li></td>
					</tr>
				</table
			</div>
			
			{{error}}
		</div>
	</div>	
</div>