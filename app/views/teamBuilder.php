<div class="container-fluid">
	<div id="circle">&nbsp;</div>
		<div class="row-fluid" style="color:black">
			<input type="text" class="input-large search-query" id="championSearchBox" data-ng-model="championNameQuery" placeholder="Search for a Champion"/>
			<button class="btn btn-success" ng-click="ajaxGetChampInfo(championNameQuery)" >Search</button>
			{{unalteredData}}
			<div>
				<img src="{{selectedChamp.ChampionImageLocation}}"></img>
				<table ng-table class="table" ng-show="selectedChamp">
					<th>{{selectedChamp.ChampionName.pretty}} is Weak Against:</th>
					<th>{{selectedChamp.ChampionName.pretty}} is Strong Against:</th>
					<th>{{selectedChamp.ChampionName.pretty}} is Good With:</th>
					<tr>
						<td><li ng-repeat="counterChamp in selectedChamp.WeakAgainst">
							{{counterChamp.champName}} ({{counterChamp.upvotes}} up, {{counterChamp.downvotes}} down)
						</li></td>
						<td><li ng-repeat="badChamp in selectedChamp.StrongAgainst">
							{{badChamp.champName}} ({{badChamp.upvotes}} up, {{badChamp.downvotes}} down)
						</li></td>
						<td><li ng-repeat="goodWith in selectedChamp.GoodWith">
							{{goodWith.champName}} ({{goodWith.upvotes}} up, {{goodWith.downvotes}} down)
						</li></td>
					</tr>
				</table
			</div>
			
			{{error}}
		</div>
	</div>	
</div>