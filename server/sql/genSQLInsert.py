#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import urllib.request
import random
import time
import datetime

logins = {
	"qduchemi" : ["Quentin", "Duchemin"], "dupoalex" : ["Alexis", "Dupont"], "digeonau" : ["Aurélie", "Digeon"], "algilbert" : ["Alexandre-Guillaume", "Gilbert"], "aronadri" : ["Adrien", "Aron"], 
	"mballoua" : ["Melody", "Ballouard"], "odicosca" : ["Oscar", "Odic"], "brunaure" : ["Aurélie", "Brun"], "truongth" : ["Thanh-Thao", "Truong"], "arondele" : ["Antoine", "Rondelet"],
	"briviere" : ["Benjamin", "Rivière"], "passotcl" : ["Clément", "Passot"], "colinajo" : ["Jo", "Colina"], "costejer" : ["Jérémy", "Coste"], "dillymax" : ["Maxime", "Dilly"],
	"qdruault" : ["Quentin", "Drualt-Aubin"], "igerbaux" : ["Irvin", "Gerbeaux"], "khalefra" : ["Rachid", "Khalef"], "konamdav" : ["David", "Konam"], "trouvero" : ["Robin", "Trouve"]
}

branches = ["GI", "GM", "GB", "GM", "GSU", "GP"]

baseEDT = "https://webapplis.utc.fr/Edt_ent_rest/myedt/result?login="
sqlQuery = ""

for k, v in logins.items():
	email = "\"" + v[0].lower() + "." + v[1].lower() + "@etu.utc.fr\""
	sqlQuery += "INSERT INTO etudiant VALUES (" + email + ", \"" + v[1] + "\", \"" + v[0] + "\", \"" + random.choice(branches) + "\");\n"
	with urllib.request.urlopen(baseEDT + k) as url:
		data = json.loads(url.read().decode())
		for insc in data:
			sqlQuery += "INSERT INTO Uv (nom) VALUES (\"" + insc["uv"] + "\") ON DUPLICATE KEY UPDATE nom=nom;\n"
			sqlQuery += "INSERT INTO Salle (nom) VALUES (\"" + insc["room"] + "\") ON DUPLICATE KEY UPDATE nom=nom;\n"	
			beginHour = insc["begin"]
			endHour = insc["end"]
			begin = datetime.datetime.strptime(beginHour, "%H:%M")
			end = datetime.datetime.strptime(endHour, "%H:%M")
			duree = (end - begin).seconds / 3600
			sqlQuery += "INSERT INTO Edt (heure_debut,jour,salle,duree,type,uv) VALUES (\"" + beginHour + "\", \"" + insc["day"] + "\", \"" + insc["room"] + "\", " + str(int(float(duree))) + ", \"" + insc["type"] + "\", \"" + insc["uv"] + "\") ON DUPLICATE KEY UPDATE heure_debut=heure_debut;\n"
			sqlQuery += "INSERT INTO Inscription VALUES (" + email + ", \"" + beginHour + "\", \"" + insc["day"] + "\", \"" + insc["room"] + "\");\n"
print(sqlQuery)