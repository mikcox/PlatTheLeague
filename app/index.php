<!DOCTYPE html>
<html lang="en" ng-app="platTheLeagueModule">
    <head>
        <meta charset="utf-8" />
        <title>Plat The League</title>
        <meta name="description" content="" />
        <meta name="author" content="Mik" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- build:css({.tmp,app}) styles/main.min.css -->
        <link rel="stylesheet" href="styles/bootstrap.css">
        <link rel="stylesheet" href="styles/app.css">
		<!-- endbuild -->
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
    </head>

    <body class="no-logo fae">
        <header id="branding" role="banner" style="text-align:center">
        	<div style="width:100%; text-align:center;">
            <a id="logo" href="#/"><img src="images/platinum_logo.png" style="width: 100px; height:100px;"/></a>
            <h1 style="margin-bottom: 0; display:inline;">
            	Team Builder Beta</h1><a id="logo" href="#/">
            <img src="images/platinum_logo.png" style="width: 100px; height:100px;"/></a>
        </div>
        </header>
        <div ng-view>
        </div>
        <footer style="margin: 3% 0% 0% 0%">
            <p> <a href="mailto:suggestions@plattheleague.com?subject=PlatTheLeague Team Builder Suggestion&body=I want to suggest a way to improve your team builder page!  Details:">Suggestions</a>
            <h3 >Powered By</h3>
            <a href="http://angularjs.org/"><img src="images/AngularJS-small.png"/></a>
        </footer>
		<!-- build:js({.tmp,app}) scripts/main.min.js -->
        <script src="components/jquery/dist/jquery.js"></script>
        <script src="components/jquery-ui/ui/minified/jquery-ui.min.js"></script>
        <script src="components/angular/angular.min.js"></script>
        <script src="components/angular-route/angular-route.js"></script>
        <script src="components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
        <script src="components/angular-dragdrop/src/angular-dragdrop.js"></script>
        <script src="components/highcharts-ng/src/highcharts-ng.js"></script>
        <script src="components/highcharts.com/js/highcharts.src.js"></script>
        <script src="scripts/app.js"></script>
        <script src="scripts/controllers/teamBuilderCtrl.js"></script>
		<script src="scripts/controllers/modalInstanceCtrl.js"></script>
        <script src="scripts/services/factories.js"></script>
        <script src="scripts/filters/filters.js"></script>
		<!-- endbuild -->
    </body>
<!-- Google Analytics -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-50126206-1', 'plattheleague.com');
  ga('send', 'pageview');

</script>
</html>
