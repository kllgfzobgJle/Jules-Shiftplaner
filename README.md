# Schichtplaner – Webanwendung für die Schichtplanung

Willkommen zum **Schichtplaner**! Dieses Repository enthält den Quellcode für eine webbasierte Software zur Planung und Verwaltung von Schichteinsätzen in einer Abteilung. Ziel ist es, einen benutzerfreundlichen, flexiblen und später mehrbenutzerfähigen Dienst bereitzustellen, der die tägliche Schichtplanung vereinfacht und digitalisiert. Die Anwendung ersetzt einen älteren Prototyp auf Basis von Next.js und basiert nun auf einer modernen Architektur mit **Django** (Backend) und **React** (Frontend).

## 🔍 Funktionsüberblick

Die wichtigste Grundlage für dieses Projekt sind die Anforderungen und Funktionen des vorherigen Prototyps. Folgende Kernfunktionen sind vorgesehen (siehe auch docs/agent.md für eine detaillierte Aufschlüsselung):

| Bereich | Wichtige Funktionen und Anforderungen |
| --- | --- |
| **Mitarbeiter** | Anlegen, Bearbeiten, Löschen, Duplizieren; Speicherung von Namen, Kürzel, Arbeitsgrad, Teamzuordnung, erlaubten Schichttypen, Eignung, Verfügbarkeit und Schichtregeln; CSV‑Import/Export |
| **Teams** | Verwaltung von Teams mit Name, Ziel‑Schichtanteil und zugehörigen Schichtregeln |
| **Schichttypen** | Definition von Schichtkategorien mit Start‑/Endzeit und Wochenbedarf pro Wochentag |
| **Lernjahr** | Standardverfügbarkeit und qualifizierte Schichttypen pro Ausbildungsjahr (1–4) |
| **Schichtregeln** | Regeln für verbotene/erforderliche Sequenzen und Nachfolge‑Schichten |
| **Schichtplanung** | Algorithmus zur automatischen Zuweisung von Mitarbeitern zu Schichten auf Basis von Teamanteilen, Verfügbarkeit, Qualifikation, Regeln und Auslastung; Erstellung, Speicherung und Laden von Plänen (4‑Wochen‑Raster) |
| **Abwesenheiten** | Verwaltung von Urlaubs‑/Abwesenheitszeiträumen pro Mitarbeiter. |
| **Berichte** | Erzeugung von PDF‑Berichten und Auswertungen (Arbeitsstunden, Auslastung, Konflikte) |
| **Import/Export** | CSV‑Import/Export für Mitarbeiter sowie vollständiger JSON‑Export/Import aller Daten |
| **Google‑Integration** (optional) | Anmeldung via Google‑SSO, Termin‑Erstellung im Google‑Kalender, Rollen und Berechtigungen |

**Hinweis:** Die anfängliche Version konzentriert sich auf die Kernfunktionen ohne Authentifizierung. Die Google‑Integration und das Rollenmodell werden in späteren Schritten ergänzt.

## 🧱 Technischer Überblick

Dieses Projekt verwendet einen **modernen Full‑Stack‑Ansatz** und setzt dabei auf Technologien, die laut aktuellen Quellen (Stand 2025) zu den beliebtesten und wartungsfreundlichsten zählen:

- **Backend – Python 3.11 & Django 4.x**
- Django bietet eine robuste Basis mit integriertem ORM, Admin‑Oberfläche und einem klaren Architekturansatz. Für die REST‑Schnittstelle wird das Django REST Framework (DRF) genutzt.
- Die Daten werden lokal in einer SQLite‑Datenbank gespeichert und können später auf PostgreSQL umgestellt werden.
- **Frontend – React mit TypeScript**
- Für die interaktive Benutzeroberfläche verwenden wir React (z. B. mit Vite oder Next.js). Dies ermöglicht eine übersichtliche Komponentengliederung und einfache Integration von Bibliotheken wie FullCalendar für die Kalenderansicht.
- TypeScript bietet zusätzliche Typsicherheit und erleichtert die Wartung.
- **APIs & Drittanbieter**
- **Google‑Dienste**: Eine spätere Integration umfasst Google‑OAuth für Single‑Sign‑On und die Google‑Calendar‑API zur Erstellung von Schicht‑Terminen. Für die Verwendung werden separate API‑Keys nötig sein (nicht im Repository hinterlegt).

## 🛠️ Projektstruktur

schichtplaner/  
├── backend/ # Django‑Projekt (manage.py, Einstellungen, Apps)  
│ ├── core/ # Django‑App für Datenmodelle und Geschäftslogik  
│ ├── api/ # DRF‑App für REST‑Endpunkte  
│ ├── requirements.txt # Python‑Abhängigkeiten  
│ └── ...  
├── frontend/ # React‑Anwendung (Vite/Next.js)  
│ ├── src/  
│ │ ├── components/ # Wiederverwendbare React‑Komponenten  
│ │ ├── pages/ # Seiten (falls Next.js)  
│ │ └── ...  
│ ├── package.json # NPM‑Abhängigkeiten  
│ └── ...  
└── docs/  
├── agent.md # Projektanforderungen und Agent‑Konfiguration  
└── template-prompt.md # Vorlage für Prompts an Jules

## 🚀 Lokales Setup (Skelett)

Da der Code schrittweise mit Jules erstellt wird, existieren viele Dateien zu Beginn noch nicht. Die folgenden Schritte geben einen groben Rahmen für das lokale Setup:

1. **Repository klonen**

- git clone &lt;REPOSITORY-URL&gt;  
    cd schichtplaner

1. **Backend einrichten**

- cd backend  
    python3 -m venv venv  
    source venv/bin/activate  
    pip install -r requirements.txt  
    \# Bei Bedarf Beispiel‑Datenbank vorbereiten  
    python manage.py migrate  
    python manage.py runserver
- Hierbei werden Django‑Konfigurationsdateien und Apps noch von Jules generiert.

1. **Frontend einrichten**

- cd ../frontend  
    npm install  
    npm run dev
- Auch hier werden die React‑Komponenten schrittweise erstellt. „npm run dev“ startet einen lokalen Entwicklungsserver.

## 📄 Dateibeschreibungen

- **docs/agent.md**: Enthält eine ausführliche Beschreibung der Anforderungen, Technologieentscheidungen, der Datenmodelle und des Entwicklungsablaufs. Diese Datei ist die zentrale Referenz für Jules.
- **docs/template-prompt.md**: Vorlage für strukturierte Anfragen an Jules; sie hilft, klare und konsistente Prompts zu formulieren.

## 🤝 Mitwirken & Pull‑Requests

Die Zusammenarbeit mit dem KI‑Assistenten erfolgt über strukturierte Prompts, die sich an der Vorlage in docs/template-prompt.md orientieren. Beim Review von Pull‑Requests (PRs), die Jules erstellt, sollten folgende Punkte beachtet werden:

1. **Verständlichkeit**: Versteht man anhand des PR‑Titels und der Beschreibung, welche Aufgabe umgesetzt wurde?
2. **Anforderungserfüllung**: Entspricht der Code der gestellten Aufgabe und den Vorgaben aus agent.md?
3. **Testbarkeit**: Gibt es bei komplexer Logik Unit‑Tests? Funktioniert der Code lokal ohne Fehler?
4. **Code‑Qualität**: Ist der Code gut strukturiert, ausreichend kommentiert und folgt den Konventionen? Werden sensible Daten ausgelagert?
5. **Projektverlauf**: Fügen sich die Änderungen logisch in den bisherigen Projektverlauf ein und werden keine bestehenden Funktionen unbeabsichtigt überschrieben?

Nur wenn diese Kriterien erfüllt sind, sollte ein PR gemergt werden. Feedback an Jules erfolgt ebenfalls über die Pull‑Request‑Kommentare oder mit neuen Prompts gemäß der Vorlage.

## 📅 Roadmap & Ausblick

Die Entwicklung geschieht iterativ. Der aktuelle Fokus liegt auf dem Aufbau der Datenmodelle, API‑Schnittstellen und einfachen Benutzeroberflächen. In späteren Meilensteinen folgen:

1. **Kalenderansicht & Drag‑and‑Drop**: Entwicklung einer interaktiven Schichtplan‑Ansicht für 4‑Wochen‑Rastern (z. B. mittels FullCalendar).
2. **Rollen & Berechtigungen**: Umsetzung eines Benutzer‑ und Rechtekonzepts (Admin, Abteilungsleiter, Teamleiter, Mitarbeiter) sowie Anbindung an Google‑SSO.
3. **Google‑Calendar‑Sync**: Automatische Terminerstellung und Einladungen für Schichten im Google‑Kalender.
4. **Optimierung des Algorithmus**: Feintuning des Planungsalgorithmus und erweiterte Konflikterkennung (z. B. Pausenregelung, gesetzliche Vorgaben).
5. **Barrierefreiheit & Mehrsprachigkeit**: Responsive Design, mobile Unterstützung und optionale Übersetzungen.
