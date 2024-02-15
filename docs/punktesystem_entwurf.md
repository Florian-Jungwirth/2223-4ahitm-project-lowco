# Punktesystem

## Mögliche Punkte
- Hängt von der Anzahl der vom Benutzer eingegebenen Daten ab
- Werden mit jeder neuen Abfrage erhöht
- Abfragen, bei denen der Benutzer noch keinen neuen Wert eingegeben hat werden nicht berücksichtigt
- Für jede Abfrage werden maximale Punkte zwischen 1 und 10 vom Anleger definiert (so werden die Abfragen verschieden gewichtet aufgrund ihres unterschiedlichen CO2-Ausstoßs)
- Bei Umfragen, die gut fürs Klima sind wird bei 60% der möglichen Punkte gestartet, damit sie keine negativen Auswirkungen haben

## Inselveränderung berechnen
- Je nach Prozent der erreichten Punkte verändert sich die 3D-Map positiv oder negativ
- Zustand verbessert sich, wenn über 60 % der Punkte erreicht wurden

## Punkteraster
- Muss beim anlegen der Abfragen definiert werden
- z.B. Auto
    - 0km: 10 Punkte
    - 1-10km: 9 Punkte
    - ...

## Benötigte Felder
- maxPoints
- isPositiveForEnvironment
    - false: Start bei 0%
    - true: Start bei 60%
- Punkteraster