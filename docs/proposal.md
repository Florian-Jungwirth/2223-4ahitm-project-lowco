https://github.com/JRachbauer/LowCo2.git

# Projekt Antrag LowCo2

## Ausgangssituation
In Zukunft wird es aufgrund des hohen Ausstoßes an Treibhausgasen immer wärmer werden. 

### Probleme
Einem Großteil der Bevölkerung fällt es schwer, umweltfreundlicher zu leben und es ist schwierig, die Auswirkungen des Handelns von Menschen darszustellen. Doch manche Personen wissen auch nicht, was sie zu einer "grüneren" Zukunft beitragen können und benötigen eine konkrete Handlungsanleitung.

### Lösungen
Unsere App soll ein Anreiz sein, sein Privatleben zu verändern und möglichst viele Personen auf die Probleme aufmerksam zu machen.
Das Verhalten der Benutzer im Alltag, wie zum Beispiel zurückgelegte Schritte, zurückgelegte Kilometer mit dem Auto, ... beeinflusst den Fortschritt im Spiel. Durch wöchentliche bzw. monatliche Challenges und täglichen Notifications, die dem Benutzer Informationen darüber bieten, wie gut oder schlecht er sich im Vergleich zu anderen Spielern verhält, sollen sie dazu angehalten werden, das Spiel möglichst lange aktiv zu benuzten.

## Technologieeinsatz
- Unity (Erstwahl)
- Unreal Engine

### Unity Vorteile
- meist kleinere Dateigrößen
- aufgrund der Programmiersprache C# eher leichter zum lernen
- in etwa 71% der 1000 besten Spiele, welche sich momentan am Markt befinden sind mit Unity gemacht
- wird für Spiele auf dem Smartphone eher empfohlen als Unreal Engine

##### Fragen
- Starteinstellungen
- Womit soll man beginnen?
-	Datenbank
-	3D-Stile (Cartoon, Handpainted, ...)
-	Verwendung von Assets
-	Zusammenarbeit (GitHub)
-	Trennung von Minispiel, Eingabefeldern und Landschaft

### Unreal Engine Vorteile
- bessere Grafik, trotz weniger Arbeit
- Blueprint (programmieren mit Nodes, anstatt C++) ist etwas besser als das Nodesystem in Unity



## Zeiterfassung
https://docs.google.com/spreadsheets/d/1ciXUxWBHKJaS97QTnzsY2lcP2Up7ShhN_Ap_1lQG9ig/edit#gid=0

## Erfahrung der Teammitglieder
- Milos Kukilo
  - Javascript (Three.js)
  - (Swift)
  - Java
  - Sql
  - Php
  - HTML
- Markus Geigenberger
  - Javascript (Three.js)
  - (Swift)
  - Java
  - Sql
  - Php
  - HTML
- Joshua Rachbauer
  - C#
  - (Swift)
  - Java
  - Sql
  - Php
  - HTML
- Florian Jungwirth
  - Javascript (Vue.js, Three.js)
  - (Swift)
  - Java
  - Sql
  - Php (Laravel)
  - HTML

## Projektinhalt
### Datenerfassung des Benutzers
- Daten, die manuell eingegeben werden müssen
    - Wenn man duschen geht, Timer, desto länger du duscht umso schlimmer (kann alternativ auch in geschätzte Minuten in der Woche eingegeben werden)
    - Raumtemperatur (Heizverhalten)
    - wie viele KM man im Jahr fliegt
    - wie viele KM man in der Woche mit dem Auto zurücklegt
    - wie viele KM man in der Woche mit dem Rad zurücklegt
    - wie viele KM man in der Woche mit Öffis zurücklegt
    - wie oft man Fleisch in der Woche isst
    - zu welchem Anteil man Bio-Produkte kauft
    - zu welchem Anteil man regional einkauft
    - wieviele Kleidungstücke man besitzt
    - wieviele Paar Schuhe man besitzt
    - wie lange man fernsieht
    
- Daten, die von Hardware ausgelesen werden
    - wie oft lädt man sein Handy (Nutzungsdauer des Handys)
    - Schritte Zähler (eventuell mit API zu einer Fitness-App)
    - Nice to have
    - Es wird ausgerechnet wie viele Kilometer zu Fuß zurückgelegt wurden (Allgemeine Kilometer minus Schritte) und wie viel sonstige

- Maßeinheit für die eingegebenen Daten
    - CO2–Äquivalenz (da sich damit der CO2 Ausstoß von allen Bereichen erfassen lässt)
    - Eingabe aller Daten innerhalb der ersten Woche
    - CO2-Ausstoß wird aus den Eingaben berechnet

### Funktionen
- Tipps bei der Anmeldung der App
- es können Ziele gesetzt werden (z.B. bis Ende des Monats nur 100 km mit Auto, wird von User definiert)
- Event (wöchentliche/monatliche Challenges, wird von der App generiert)
- Leaderboard (eventuell Vergleich mit Freunden) 
- ### Nice to have
  - Bus Karte einscannen
  - Gruppenevents und Challenges (mit Freunden ein bestimmtes Ziel erreichen)
  - News Seite (akutelle Umweltthemen)

### 3d Welt
#### Game Engine
- Unity

 - Punktesystem:
    - CO2-Ausstoß wird in Spielwährung umgewandelt (dabei wird hauptsächlich der Durchschnittswert als Referenz hergenommen, allerdings auch       Verbesserungen/Verschlechterungen im Vergleich zur vorherigen Woche)
    - Sobald der CO2-Ausstoß einen gewissen Wert übersteigt erhält man keine Punkte mehr
    - Punkte erhält man auch durch das Erreichen von Zielen
    - Bei Abfragen die nur einmal pro Jahr stattfinden (zurückgelegte KM mit Flugzeug) können Bonuspunkte erlangt werden
 - Gebäude/Dekoration kaufen und platzieren
    - Gebäude sind Minispiele (je nach Gebäudelevel wird Schwierigkeit erhöht)
        - Bei Abschluss von Minispiel erhält man XP (wenn man genügend XP gesammelt hat, erreicht man ein neues Level, wobei neue Gebäude und Dekorationen freigeschaltet werden)
    - freigeschaltete Gebäude können wiederum durch Punkte erworben werden
 - Umwelt (Bäume, Gras, Wetter) verändert sich bei nicht erreichten Zielen
 - Spielfläche vergrößern
    - ein Teil der Welt ist von Wolken verdeckt
    - die Bereiche kann man ab gewissen Leveln erwerben
 - Naturkatastrophen
    - zufällig oder Wahrscheinlichkeit hängt von Verhalten ab

### Backend
Daten sollen in einer Datenbank gespeichert werden.

### Admin Page
Es soll eine Admin Page geben, bei der neue Abfragen bzw. Kategorien zur Datenerfassung hinzugefügt werden können.

## Stakeholder
### Benutzer bzw. Spieler
- positiv: wir als Entwickler können so Feedback erhalten
- negativ: haben Erwartungen

### Konkurrenz
- positiv: eventuell eine Zusammenarbeit, regen Kreativität von Mitarbeitern an
- negativ: haben eventuell bessere Ideen und die Benutzer unserer Applikation könnten zur Konkurrenz wechseln

### Investoren
- positiv: Unterstützung durch Geld
- negativ: haben ebenfalls Erwartungen

### Projektauftraggeber
- negativ: Erwartungen

## Meilensteine

| Meilensteine                  | Soll-Termin | Ist-Termin |
| ------------------------------| ----------- | ---------- |
| Start erfolgt                 | 03.11.2022  | 03.11.2022 |
| Projektumgebung eingerichtet  | 01.12.2022  |     -      |
| Click-Dummy erstellt          | 08.12.2022  |     -      |
| 3d Objekte erstellt           | 16.02.2023  |     -      |
| Oberfläche in Unity erstellt  | 01.06.2023  |     -      |
| Test durchgeführt             | 30.06.2023  |     -      |
