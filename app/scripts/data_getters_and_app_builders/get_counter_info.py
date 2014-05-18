from urllib2 import Request, urlopen, URLError, HTTPError
import sys
import json
import HTMLParser
import smtplib

workingdir = '../../champion_json/'

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
    counterPanelLowIndex = html.find("<div class='weak'>") 
    counterPanelHighIndex = html.find("<div class='strong'>")
    counterPickHTML = html[counterPanelLowIndex:counterPanelHighIndex]
	#print counterPickHTML
	
	#create a list of champs it is weak against
    weakAgainst = []
    while(counterPickHTML.find("<div class='champ-block'>") != -1):
        champStartIndex = counterPickHTML.find("<div class='name'>")+18
        champNameStopIndex = counterPickHTML[champStartIndex:].find("</div></a>")
        champStopIndex = counterPickHTML[champStartIndex:].find("<div class='countertips'>")
        champName = counterPickHTML[champStartIndex:champStartIndex+champNameStopIndex].strip()
        #print champName
		#grab up and down votes
        upvotesLowIndex = counterPickHTML[champStartIndex:].find('<img src="/resources/img/up.png" />')+35
        upvotesHighIndex = counterPickHTML[champStartIndex:][upvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        upvotesStr = counterPickHTML[champStartIndex:][upvotesLowIndex:upvotesLowIndex+upvotesHighIndex].strip()
        upvotes = int(upvotesStr.replace(',', ''));
        
        downvotesLowIndex = counterPickHTML[champStartIndex:].find('<img src="/resources/img/down.png" />')+37
        downvotesHighIndex = counterPickHTML[champStartIndex:][downvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        downvotesStr = counterPickHTML[champStartIndex:][downvotesLowIndex:downvotesLowIndex+downvotesHighIndex].strip()
        downvotes = int(downvotesStr.replace(',', ''));
        weakAgainst.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
        counterPickHTML = counterPickHTML[champStartIndex:][champStopIndex:]
	#print weakAgainst	
    
	#find strong against panel
    badPanelHighIndex = html.find("<div class='even'>")
    badPickHTML = html[counterPanelHighIndex:badPanelHighIndex]
    #print counterPickHTML
    
    #create a list of champs it is strong against
    strongAgainst = []
    while(badPickHTML.find("<div class='champ-block'>") != -1):
        champStartIndex = badPickHTML.find("<div class='name'>")+18
        champNameStopIndex = badPickHTML[champStartIndex:].find("</div></a>")
        champStopIndex = badPickHTML[champStartIndex:].find("<div class='countertips'>")
        champName = badPickHTML[champStartIndex:champStartIndex+champNameStopIndex].strip()
        #print champName
        #grab up and down votes
        upvotesLowIndex = badPickHTML[champStartIndex:].find('<img src="/resources/img/up.png" />')+35
        upvotesHighIndex = badPickHTML[champStartIndex:][upvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        upvotesStr = badPickHTML[champStartIndex:][upvotesLowIndex:upvotesLowIndex+upvotesHighIndex].strip()
        upvotes = int(upvotesStr.replace(',', ''));
        
        downvotesLowIndex = badPickHTML[champStartIndex:].find('<img src="/resources/img/down.png" />')+37
        downvotesHighIndex = badPickHTML[champStartIndex:][downvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        downvotesStr = badPickHTML[champStartIndex:][downvotesLowIndex:downvotesLowIndex+downvotesHighIndex].strip()
        downvotes = int(downvotesStr.replace(',', ''));
        strongAgainst.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
        badPickHTML = badPickHTML[champStartIndex:][champStopIndex:]
    #print strongAgainst    
    
    #find good with panel
    goodWithPanelLowIndex = html.find("<div class='good'>") 
    goodWithPanelHighIndex = html[goodWithPanelLowIndex:].find("<div class='weak-strong'>")
    goodWithPickHTML = html[goodWithPanelLowIndex:+goodWithPanelLowIndex+goodWithPanelHighIndex]
    #print goodWithPickHTML
    
    #create a list of champs it is good with
    goodWith = []
    while(goodWithPickHTML.find("<div class='champ-block'>") != -1):
        champStartIndex = goodWithPickHTML.find("<div class='name'>")+18
        champNameStopIndex = goodWithPickHTML[champStartIndex:].find("</div></a>")
        champStopIndex = goodWithPickHTML[champStartIndex:].find("<div class='tag_blue'>")
        champName = goodWithPickHTML[champStartIndex:champStartIndex+champNameStopIndex].strip()
        #print champName
        #grab up and down votes
        upvotesLowIndex = goodWithPickHTML[champStartIndex:].find('<img src="/resources/img/up.png" />')+35
        upvotesHighIndex = goodWithPickHTML[champStartIndex:][upvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        upvotesStr = goodWithPickHTML[champStartIndex:][upvotesLowIndex:upvotesLowIndex+upvotesHighIndex].strip()
        upvotes = int(upvotesStr.replace(',', ''));
        
        downvotesLowIndex = goodWithPickHTML[champStartIndex:].find('<img src="/resources/img/down.png" />')+37
        downvotesHighIndex = goodWithPickHTML[champStartIndex:][downvotesLowIndex:].find('</div>')
        #print str(upvotesLowIndex)+', '+str(upvotesHighIndex)
        downvotesStr = goodWithPickHTML[champStartIndex:][downvotesLowIndex:downvotesLowIndex+downvotesHighIndex].strip()
        downvotes = int(downvotesStr.replace(',', ''));
        goodWith.append({"champName":champName, "upvotes":upvotes, "downvotes":downvotes})
        goodWithPickHTML = goodWithPickHTML[champStartIndex:][champStopIndex:]
    #print goodWith    
    
    #look through the arrays for problems
    foundProblem = 0	
    for i in range(0, len(weakAgainst)):
        if(not (isinstance(weakAgainst[i]["upvotes"], int) and weakAgainst[i]["upvotes"] >= 0 and isinstance(weakAgainst[i]["downvotes"], int) and weakAgainst[i]["downvotes"])):
            foundProblem = 1
            #print 'we found a problem.'
    for i in range(0, len(strongAgainst)):
        if(not (isinstance(strongAgainst[i]["upvotes"], int) and strongAgainst[i]["upvotes"] >= 0 and isinstance(strongAgainst[i]["downvotes"], int) and strongAgainst[i]["downvotes"])):
            foundProblem = 1
            #print 'we found a problem.'
    for i in range(0, len(goodWith)):
        if(not (isinstance(goodWith[i]["upvotes"], long) and goodWith[i]["upvotes"] >= 0 and isinstance(goodWith[i]["downvotes"], int) and goodWith[i]["downvotes"])):
            foundProblem = 1
            #print 'we found a problem.'
    if(foundProblem == 0):
        with open(workingdir+champion+'.json', 'w') as file:
            json.dump({"ChampionName":{"pretty":championPrettyName, "lower":champion}, "WeakAgainst":weakAgainst, "StrongAgainst":strongAgainst, "GoodWith":goodWith, "ChampionImageLocation":"http://www.solomid.net/guide/champ/"+champion+".png"}, file, indent=4);
    if(foundProblem == 1):
        SERVER = 'localhost'
        SUBJECT = 'Failed to create champion JSON'
        FROM = 'mico2178@plattheleague.com'
        TO = 'mico2178@plattheleague.com'
        TEXT = 'failed to create champ JSON!'
        # Prepare actual message
        message = """\
        From: %s
        To: %s
        Subject: %s
        
        %s
        """ % (FROM, ", ".join(TO), SUBJECT, TEXT)
        # Send the mail
        server = smtplib.SMTP(SERVER)
        server.sendmail(FROM, TO, message)
        server.quit()
    sys.exit(0)
