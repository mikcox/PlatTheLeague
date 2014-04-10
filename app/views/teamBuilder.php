<div class="container-fluid">
	<div id="circle">&nbsp;</div>
		<div class="row-fluid" style="color:black">
			<input type="text" class="input-large search-query" data-ng-model="championNameQuery" placeholder="Search for a Champion"/>
			<button class="addButton" ng-click="ajaxGetChampInfo(championNameQuery)" >Search</button>
			
			{{results}}
			
			{{error}}
		</div>
	</div>	
</div>