import urllib2
import sys
import json

#ask user for champion name
#champion = raw_input("Please type the name of the champion you wish to counter:");

champion = sys.argv[1]
#send request to lolcounter
response = urllib2.urlopen('http://www.lolcounter.com/champ/'+champion.replace(" ", ""))
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
	
	
with open('/var/www/PlatTheLeague/app/champion_json/'+champion+'.json', 'w') as file:
	json.dump({"ChampionName":champion, "WeakAgainst":weakAgainst, "StrongAgainst":strongAgainst, "GoodWith":goodWith}, file, indent=4);
#file.write('"]}')
