from urllib2 import Request, urlopen, URLError, HTTPError
from subprocess import call
import sys
import json
import HTMLParser

workingdir = './'
champJSONdir = '../../champion_json/'

#send request to lolcounter

req = Request('https://prod.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=1307d9e7-3353-4720-bda4-13baf7ba200b')
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
else:
    returnString = response.read()
    champjson = json.loads(returnString)
    allChamps = []
    for i in champjson["data"]:
        print champjson["data"][i]["name"]
        prettyName = champjson["data"][i]["name"]
        lowerName = champjson["data"][i]["name"].lower().replace(" ", "").replace("'", "").replace(".", "")
        allChamps.append({"ChampionName":{"pretty":prettyName, "lower":lowerName}})
        call(["python", workingdir+"get_counter_info.py", prettyName])
    #read all the counter information into a variable
    for i in range(0, len(allChamps)):
        champName = allChamps[i]["ChampionName"]["lower"]
        counterJSON = ''
        with open(champJSONdir+champName+'.json', 'r') as file:
            counterJSON = json.load(file);
            allChamps[i] = counterJSON;
    #and dump the variable into an all_champs.json file
    with open(champJSONdir+'all_champs.json', 'w') as file:
        json.dump({"Champions":allChamps}, file, indent=4, sort_keys=True);
	

sys.exit(0)
