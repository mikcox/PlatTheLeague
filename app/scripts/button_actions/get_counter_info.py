from urllib2 import Request, urlopen, URLError, HTTPError
import sys
import json

workingdir = '/var/www/PlatTheLeague/app/champion_json/'

champion = sys.argv[1]
#send request to lolcounter

req = Request('http://www.lolcounter.com/champ/'+champion)
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
    #print 'We failed to reach a server.'
    #print 'Reason: ', e.reason

#response = urllib2.urlopen('http://www.lolcounter.com/champ/'+champion)
html = response.read()
#print html

#find good counter panel
counterPanelLowIndex = html.find('data-target="#counterPickModal"') 
counterPanelHighIndex = html.find('data-target="#badPickModal"')
counterPickHTML = html[counterPanelLowIndex:counterPanelHighIndex]


#print "\n"+champion+" is weak against:"
weakAgainst = []
#file.write('{"Champion Name":"'+champion+'", "Weak Against":["')
while(counterPickHTML.find('<h4>') != -1):
	champStartIndex = counterPickHTML.find('<h4>')
	champStopIndex = counterPickHTML.find('</h4>')
	i = 1
	champName = ""
	while(counterPickHTML[champStartIndex:].split()[i] != "<div"):
		champName = champName + counterPickHTML[champStartIndex:].split()[i]+ " "
		i = i+1
	champName = champName[:-1]
	#print champName
	weakAgainst.append({"champName": champName, "certainty":0})
	#file.write(champName+'","')
	counterPickHTML = counterPickHTML[champStopIndex+5:]
	

#find bad counter panel
badPanelHighIndex = html.find('data-target="#duoPickModal"');
badPickHTML = html[counterPanelHighIndex:badPanelHighIndex]
strongAgainst = []
#file.write('"], "Strong Against":["')
#print "\n"+champion+" is strong against:"
while(badPickHTML.find('<h4>') != -1):
	champStartIndex = badPickHTML.find('<h4>')
	champStopIndex = badPickHTML.find('</h4>')
	i = 1
	champName = ""
	while(badPickHTML[champStartIndex:].split()[i] != "<div"):
		champName = champName + badPickHTML[champStartIndex:].split()[i] + " "
		i = i+1
	champName = champName[:-1]
	#print champName
	strongAgainst.append({"champName": champName, "certainty":0})
	#print str(champStartIndex)+' - '+str(champStopIndex)
	badPickHTML = badPickHTML[champStopIndex+5:]

#find good duo panel
goodDuoHighIndex = html.find('id="showDuo"');
goodDuoHTML = html[badPanelHighIndex:goodDuoHighIndex]
goodWith = []
#file.write('"], "Good With":["')
#print "\n"+champion+" is good with:"
while(goodDuoHTML.find('<h4>') != -1):
	champStartIndex = goodDuoHTML.find('<h4>')
	champStopIndex = goodDuoHTML.find('</h4>')
	i = 1
	champName = ""
	while(goodDuoHTML[champStartIndex:].split()[i] != "<div"):
		champName = champName + goodDuoHTML[champStartIndex:].split()[i] + " "
		i = i+1
	champName = champName[:-1]
	goodWith.append({"champName": champName, "certainty":0})
	#file.write(champName+'","')
	#print champName
	#print str(champStartIndex)+' - '+str(champStopIndex)
	goodDuoHTML = goodDuoHTML[champStopIndex+5:]
	
	
with open(workingdir+champion+'.json', 'w') as file:
	json.dump({"ChampionName":champion, "WeakAgainst":weakAgainst, "StrongAgainst":strongAgainst, "GoodWith":goodWith}, file, indent=4);
#file.write('"]}')
sys.exit(0)