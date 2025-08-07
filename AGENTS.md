# Schichtplaner Web‑App – Agent‑Konfiguration

Diese Datei dient als **Leitfaden für Jules**, den KI‑basierten Coding‑Assistenten von Google. Sie beschreibt Ziel, Umfang, Datenmodelle, Technologien und Arbeitsweisen des Projekts „Schichtplaner“. Die Informationen stammen aus der vorherigen Next.js‑Implementierung des Projekts und wurden auf die aktuelle strategische Planung angepasst.

## 🎯 Ziel des Projekts

Das Hauptziel ist die Entwicklung einer benutzerfreundlichen Webanwendung zur **Erstellung, Verwaltung und Optimierung von Schichtplänen** für eine Abteilung. Die Anwendung soll langfristig mehrbenutzerfähig sein, die planungsrelevanten Daten zentral speichern und eine Anbindung an Google‑Dienste (Single‑Sign‑On und Kalender‑Integration) ermöglichen. In der ersten Phase konzentriert sich die Entwicklung auf die Kernfunktionen der Schichtplanung ohne Authentifizierung, basierend auf den Anforderungen des vorhandenen Prototyps.

## 🧩 Kernfunktionen (abgeleitet aus dem alten Projekt)

Die folgenden Funktionen müssen durch die neue Software abgedeckt werden. Sie spiegeln die Fähigkeiten des alten Next.js‑Prototyps wider und dienen als Mindestanforderungen für die erste Iteration:

1. **Mitarbeiterverwaltung**
2. **Felder**: Vorname, Nachname, Kürzel, Typ (ausgelernt oder Auszubildender), Lernjahr, Arbeitsgrad (Prozent), zugewiesenes Team, optional abweichende Schichtquote, erlaubte Schichttypen, Eignungsbewertung pro Schichttyp (0–5), Verfügbarkeit pro Wochentag (AM/PM), zugeordnete Schichtregeln.
3. **Aktionen**: Anlegen, Bearbeiten, Löschen, Duplizieren und CSV‑Import/Export. Beim Duplizieren soll die Verfügbarkeit und Schichtzuordnung übernommen werden.
4. **Teamverwaltung**
5. **Felder**: Name, Gesamt‑Schichtanteil (0–100 %), optional Teamleiter (Mitarbeiter‑ID), zugehörige Schichtregeln.
6. **Aktionen**: Anlegen, Bearbeiten und Löschen.
7. **Schichttypen**
8. **Felder**: Name (z. B. „1. VM“), Beginn‑ und Endzeit („HH:MM“), wöchentlicher Bedarf pro Wochentag (z. B. Montag → 2).
9. **Aktionen**: Anlegen, Bearbeiten und Löschen.
10. **Lernjahr‑Qualifikationen**
11. Für jede Ausbildungsstufe (1–4) definierbar: zugelassene Schichttypen und Standardverfügbarkeit.
12. **Aktionen**: Bearbeiten und Abrufen (automatisch vier Lernjahre bereitstellen).
13. **Schichtregeln**
14. **Arten**: „forbidden_sequence“ (verbotene Abfolge), „required_sequence“ (erforderliche Abfolge), „mandatory_follow_up“ (Pflicht‑Folge) u. a.
15. **Felder**: Start‑Schichttyp, Ziel‑Schichttyp oder Liste von Ziel‑Schichttypen, optional gleiche Tagesvorgabe, Name und Beschreibung.
16. **Aktionen**: Anlegen, Bearbeiten und Löschen.
17. **Schichtplanung und –algorithmus**
18. Implementiere einen **Planungsalgorithmus**, der für einen ausgewählten Zeitraum (Standard: 4 Wochen) die verfügbaren Schichten mit den Mitarbeitern füllt. Folgende Kriterien müssen berücksichtigt werden:
    - Teamanteile: Jedes Team hat einen Zielanteil an der Gesamtzahl der Schichteinsätze. Mitarbeiter können optional eine abweichende persönliche Schichtquote haben.
    - Verfügbarkeit der Mitarbeiter (AM/PM pro Tag) und Abwesenheiten.
    - Lernjahr‑Qualifikation der Auszubildenden (nur zugelassene Schichttypen).
    - Schichtregeln (verbotene oder erforderliche Sequenzen, Nachfolgeschichten).
    - Eignungsbewertung pro Schichttyp (0–5), um passendere Zuweisungen zu priorisieren.
    - Gleichmäßige Verteilung der Arbeitsstunden gemäß dem Arbeitsgrad und fairer Auslastung aller Mitarbeiter.
19. Der Algorithmus soll eine **Liste von Schichtzuweisungen** (Mitarbeiter‑ID, Schichttyp‑ID, Datum, Kennzeichen für Folge‑Schicht, Sperrstatus) und **Statistiken** (Arbeitsstunden, Schichten, Auslastung pro Mitarbeiter/Team) ausgeben. Konﬂikte (z. B. Regelverletzungen oder unbesetzte Schichten) sind zu protokollieren.
20. **Schichtplan‑Management**
21. **Plan erzeugen**: Auswahl von Start‑ und Enddatum; automatische Berechnung eines 4‑Wochen‑Enddatums; Generierung von Zuweisungen durch den Algorithmus.
22. **Plan speichern/laden**: Schichtpläne sollen unter einem Namen gespeichert werden und später erneut abrufbar sein. Ein Plan enthält Zeitraum, Zuweisungen und optionale Bezeichnung. Es sollen mehrere Pläne parallel existieren können.
23. **Plan teilen**: Schichtpläne können öffentlich oder privat gespeichert werden. Öffentliche Pläne sind für alle sicht- und lesbar; sie dürfen nur vom Ersteller oder Admin gelöscht werden. Private Pläne sind nur für den Ersteller sichtbar.
24. **Plan löschen/aktualisieren**: Pläne können gelöscht oder überschrieben werden (nur vom Ersteller/Admin).
25. **Abwesenheiten**
26. **Felder**: Mitarbeiter, Startdatum, Enddatum, Grund (optional).
27. **Aktionen**: Anlegen, Bearbeiten und Löschen.
28. **Auswertungen & Berichte**
29. Berechnung von Auslastung und Arbeitsstunden pro Mitarbeiter/Team sowie Übersicht über Anzahl der Zuweisungen, Konflikte usw.
30. Generierung von PDF‑Berichten mit Tabellen und Kennzahlen (ähnlich dem alten ReportGenerator).
31. **Import/Export**
32. **CSV‑Import/Export** für Mitarbeiterdaten.
33. **JSON‑Export/Import** aller Projekt‑Daten (Mitarbeiter, Teams, Schichttypen, Qualifikationen, Regeln, Pläne, Abwesenheiten).
34. **Google‑Integration (zukünftige Phase)**
35. **Google‑Kalender**: Möglichkeit, einen Hauptkalender auszuwählen und Schichtzuweisungen als Termine zu erstellen; Einladungen an die zugewiesenen Mitarbeiter (E‑Mail‑Gäste) senden; Unterstützung für 4‑wöchige Wiederholungen.
36. **Google‑SSO**: Anmeldung via Google‑Konto zur rollenbasierten Berechtigungssteuerung (Admin, Abteilungsleiter, Teamleiter, Mitarbeiter). Solange die Authentifizierung noch nicht implementiert ist, sind alle Funktionen ohne Login möglich.

## 🛠️ Technologie‑Entscheidungen

Nach Recherche zu aktuellen Web‑Frameworks und bewährten Praktiken (z. B. häufige Verwendung, Community‑Unterstützung, Lernkurve und Erweiterbarkeit) wird folgende Technologie vorgeschlagen:

- **Backend: Python 3.11 mit Django 4.x**
- Django ist ein etabliertes High‑Level‑Framework („batteries‑included“) mit integrierter Admin‑Oberfläche, ORM und ausgereifter Dokumentation. Es eignet sich gut für Datenmodelle mit relationalen Beziehungen (Mitarbeiter, Teams, Schichten etc.), und bietet eine geringe Einstiegshürde für Einsteiger.
- Für API‑Endpunkte wird **Django REST Framework (DRF)** verwendet, um eine saubere Trennung zwischen Backend und Frontend zu ermöglichen und die spätere Anbindung an eine React‑ oder Mobile‑App zu erleichtern.
- **SQLite** dient als Standarddatenbank für die lokale Entwicklung; sie kann später problemlos durch PostgreSQL ersetzt werden.
- **Google‑OAuth und Kalender‑API** lassen sich über bestehende Python‑Bibliotheken (z. B. google-auth, google-api-python-client) integrieren.
- **Frontend: React (18+) mit TypeScript**
- Für die interaktive Darstellung des Schichtplans wird eine React‑Anwendung vorgeschlagen (z. B. mit Vite oder Next.js), da die drag‑&‑drop‑Funktionalität und das dynamische Aktualisieren von Daten leichter zu implementieren sind als mit klassischen Server‑Rendered‑Templates.
- React hat eine große Community, viele UI‑Bibliotheken (z. B. Material UI, FullCalendar) und lässt sich gut mit dem DRF‑Backend verbinden.
- Für die erste Iteration kann die Benutzeroberfläche minimal gehalten werden (Formulare und Tabellen). Komplexere Komponenten wie Kalendergitter oder Diagramme können Schritt für Schritt ergänzt werden.

Die Wahl dieser Technologien beruht auf aktuellen Rankings und Praxisberichten: Django und React zählen 2025 laut mehreren Quellen zu den beliebtesten und nachhaltig unterstützten Frameworks für Web‑Anwendungen. Sie kombinieren hohe Produktivität, gute Dokumentation und eine große Entwickler‑Community, was insbesondere für Anfänger und KI‑gestützte Entwicklung vorteilhaft ist.

## 📁 Projektstruktur (Vorschlag)

schichtplaner/  
├── backend/ # Django‑Projekt  
│ ├── schichtplaner/ # Django‑Projektordner (settings, urls, wsgi)  
│ ├── core/ # Django‑App für Basislogik (Mitarbeiter, Teams, Schichten, Regeln, Abwesenheiten, Pläne)  
│ ├── api/ # DRF‑App für REST‑Endpunkte  
│ ├── requirements.txt # Python‑Abhängigkeiten  
│ └── manage.py  
├── frontend/ # React‑Anwendung  
│ ├── package.json  
│ ├── src/  
│ │ ├── components/  
│ │ ├── pages/  
│ │ └── ...  
│ └── vite.config.ts or next.config.js  
└── docs/  
└── agent.md # Diese Datei

## 🔍 Entwicklungsworkflow mit Jules

Um das Projekt schrittweise aufzubauen, sollte Jules immer **in kleinen, klar abgegrenzten Aufgaben** arbeiten. Verwende das Template aus template-prompt.md für jede Anfrage. Der typische Workflow sieht wie folgt aus:

1. **Planung**: Lege mit Jules die Datenmodelle (Django‑Models) fest (z. B. Employee, Team, ShiftType, ShiftRule, ShiftPlan, Absence). Anschließend generiert Jules die zugehörigen Migrationen.
2. **REST‑API**: Erstelle DRF‑Serializers und ViewSets für CRUD‑Operationen der Modelle. Definiere sinnvolle Endpunkte (z. B. /api/employees/, /api/teams/, /api/shift-plans/).
3. **Geschäftslogik**: Implementiere in Python Funktionen/Klassen für den Planungsalgorithmus. Orientiere dich am alten shiftScheduler.ts und beachte die Anforderungen oben. Schreibe Unit‑Tests, um die Logik zu überprüfen.
4. **Frontend**: Baue eine React‑UI, die die API verwendet. Beginne mit einfachen Formularen/Tabellen für Mitarbeiter, Teams und Schichten. In späteren Schritten kann Jules ein Kalender‑Grid (z. B. FullCalendar) integrieren.
5. **Berichte & Exporte**: Implementiere eine PDF‑Reportfunktion (z. B. mit jspdf im Frontend oder Python‑Bibliotheken im Backend) sowie CSV‑Import/Export im Backend.
6. **Google‑Integration** (optional): Ergänze OAuth‑Authentifizierung und Google‑Kalender‑Sync anhand der bereitgestellten Anforderungen. Nutze für vertrauliche Informationen Umgebungsvariablen.
7. **Rollen und Berechtigungen**: Implementiere ein Rollenmodell (Admin, Abteilungsleiter, Teamleiter, Mitarbeiter) über Django‑Permissions. Aktiviere erst nach Abschluss der Kernfunktionen.

## ✅ Best Practices

- **Kleine Schritte**: Teile komplexe Aufgaben in kleine Storys. Beispielsweise erstelle zuerst nur das Employee‑Modell, danach erstelle die API, dann die UI.
- **Dokumentation**: Jede neu erzeugte Datei sollte einen kurzen Kommentar enthalten, der Zweck und Funktionsweise erklärt. Nutze docstrings in Python.
- **Tests**: Verwende Django‑ und DRF‑Testfälle, um Geschäftsregeln (z. B. Verfügbarkeit, Teamanteile, Schichtregeln) zu prüfen. Automatisierte Tests vereinfachen späteres Refactoring.
- **Liesbarkeit**: Halte dich an PEP 8 (Python) und gängige React‑Konventionen. Benenne Funktionen und Variablen verständlich.
- **Umgebungsvariablen**: API‑Schlüssel und sensible Daten dürfen nicht in den Quellcode. Verwende .env‑Dateien für Entwicklung.
- **Kontrolliertes Mergen**: Überprüfe die Pull Requests von Jules sorgfältig (siehe README.md). Achte darauf, dass jede Änderung einer konkreten Aufgabe aus dem Template entspricht.
