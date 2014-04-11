from urllib2 import Request, urlopen, URLError, HTTPError
import sys
import json
import HTMLParser

workingdir = '/var/www/PlatTheLeague/app/champion_json/'

championPrettyName = sys.argv[1]
#format the champ's name for sending to lolcounter
champion = championPrettyName.lower().replace(" ", "").replace("'", "").replace(".", "")


#send request to lolcounter
req = Request('http://www.lolcounter.com/champ/'+champion)

#handle problems, if they arise
try:
    response = urlopen(req)
except HTTPError as e:
	f = open(workingdir+"error.json", 'w')
	f.write('{"ServerError":"The server couldn\'t fulfill the request.  Error code '+str(e.code)+'"}')
	f.close();
	sys.exit(1)
except URLError as e:
	f = open(workingdir+"error.json", 'w')
	f.write('{"ServerError":"We failed to reach a server.  Reason: '+str(e.reason)+'"}')
	f.close();
	sys.exit(1)
else:
	html = response.read()
	#print html

	#find good counter panel
	counterPanelLowIndex = html.find('data-target="#counterPickModal"') 
	counterPanelHighIndex = html.find('data-target="#badPickModal"')
	counterPickHTML = html[counterPanelLowIndex:counterPanelHighIndex]
	
	
	#create a list of champs it is weak against
	weakAgainst = []
	while(counterPickHTML.find('<h4>') != -1):
		champStartIndex = counterPickHTML.find('<h4>')
		champStopIndex = counterPickHTML.find('</h4>')
		i = 1
		champName = ""
		while(counterPickHTML[champStartIndex:].split()[i] != "<div"):
			champName = champName + counterPickHTML[champStartIndex:].split()[i]+ " "
			i = i+1
		champName = champName[:-1]
		#grab up and down votes
		upvotesLowIndex = counterPickHTML[champStartIndex:].find('<i class="icon-chevron-up icon-white"></i> ')+40
		upvotes = counterPickHTML[champStartIndex:][upvotesLowIndex:].split()[1][:-4]
		downvotesLowIndex = counterPickHTML[champStartIndex:].find('<i class="icon-chevron-down icon-white"></i> ')+40
		downvotes = counterPickHTML[champStartIndex:][downvotesLowIndex:].split()[1][:-4]
		weakAgainst.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
		counterPickHTML = counterPickHTML[champStopIndex+5:]
		
	
	#find bad counter panel
	badPanelHighIndex = html.find('data-target="#duoPickModal"');
	badPickHTML = html[counterPanelHighIndex:badPanelHighIndex]
	#create a list of champs it is strong against	
	strongAgainst = []
	while(badPickHTML.find('<h4>') != -1):
		champStartIndex = badPickHTML.find('<h4>')
		champStopIndex = badPickHTML.find('</h4>')
		i = 1
		champName = ""
		while(badPickHTML[champStartIndex:].split()[i] != "<div"):
			champName = champName + badPickHTML[champStartIndex:].split()[i] + " "
			i = i+1
		champName = champName[:-1]
		#grab up and down votes
		upvotesLowIndex = badPickHTML[champStartIndex:].find('<i class="icon-chevron-up icon-white"></i> ')+40
		upvotes = badPickHTML[champStartIndex:][upvotesLowIndex:].split()[1][:-4]
		downvotesLowIndex = badPickHTML[champStartIndex:].find('<i class="icon-chevron-down icon-white"></i> ')+40
		downvotes = badPickHTML[champStartIndex:][downvotesLowIndex:].split()[1][:-4]
		strongAgainst.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
		badPickHTML = badPickHTML[champStopIndex+5:]
	
	#find good duo panel
	goodDuoHighIndex = html.find('id="showDuo"');
	goodDuoHTML = html[badPanelHighIndex:goodDuoHighIndex]
	#create a list of champs it is good with
	goodWith = []
	while(goodDuoHTML.find('<h4>') != -1):
		#find the next champ
		champStartIndex = goodDuoHTML.find('<h4>')
		champStopIndex = goodDuoHTML.find('</h4>')
		i = 1
		champName = ""
		while(goodDuoHTML[champStartIndex:].split()[i] != "<div"):
			champName = champName + goodDuoHTML[champStartIndex:].split()[i] + " "
			i = i+1
		champName = champName[:-1]
		#grab up and down votes
		upvotesLowIndex = goodDuoHTML[champStartIndex:].find('<i class="icon-chevron-up icon-white"></i> ')+40
		upvotes = goodDuoHTML[champStartIndex:][upvotesLowIndex:].split()[1][:-4]
		downvotesLowIndex = goodDuoHTML[champStartIndex:].find('<i class="icon-chevron-down icon-white"></i> ')+40
		downvotes = goodDuoHTML[champStartIndex:][downvotesLowIndex:].split()[1][:-4]
		goodWith.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
		goodDuoHTML = goodDuoHTML[champStopIndex+5:]
		
		
	with open(workingdir+champion+'.json', 'w') as file:
		json.dump({"ChampionName":{"pretty":championPrettyName, "lower":champion}, "WeakAgainst":weakAgainst, "StrongAgainst":strongAgainst, "GoodWith":goodWith, "ChampionImageLocation":"http://www.solomid.net/guide/champ/"+champion+".png"}, file, indent=4);
	sys.exit(0)
