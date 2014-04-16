<!DOCTYPE html>
<html lang="en" ng-app="platTheLeagueModule">
    <head>
        <meta charset="utf-8" />
        <title>Plat The League</title>
        <meta name="description" content="" />
        <meta name="author" content="Mik" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="styles/bootstrap.css">
        <link rel="stylesheet" href="styles/app.css">
    </head>

    <body class="no-logo fae">
        <header id="branding" role="banner" style="text-align:center">
            <a id="logo" href="#/"><img src="images/platinum_logo.png"/></a>
        </header>
        <div style="width:100%; text-align:center;">
            <h1 style="margin-bottom: 0; color:black;">
            	Team Builder Beta</h1>
        </div>
        <div ng-view>
        </div>
        <footer style="margin: 3% 0% 0% 0%">
            <p> <a href="mailto:suggestions@plattheleague.com?subject=PlatTheLeague Team Builder Suggestion&body=I want to suggest a way to improve your team builder page!  Details:">Suggestions</a>
            <h3 style="color:black">Powered By</h3>
            <a href="http://angularjs.org/"><img src="images/AngularJS-small.png"/></a>
        </footer>
        <script src="components/jquery/dist/jquery.js"></script>
        <script src="components/jquery-ui/ui/minified/jquery-ui.min.js"></script>
        <script src="components/angular/angular.min.js"></script>
        <script src="components/angular-route/angular-route.js"></script>
        <script src="components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
        <script src="components/angular-dragdrop/src/angular-dragdrop.js"></script>
        <script src="components/highcharts-ng/src/highcharts-ng.js"></script>q
        <script src="components/highcharts.com/js/highcharts.src.js"></script>
        <script src="scripts/app.js"></script>
        <script src="scripts/controllers/teamBuilderCtrl.js"></script>
		<script src="scripts/controllers/modalInstanceCtrl.js"></script>
        <script src="scripts/services/factories.js"></script>
        <script src="scripts/filters/filters.js"></script>
    </body>
</html>
