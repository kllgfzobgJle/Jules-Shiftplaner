# Anforderungsdokument: Codex-Shiftplaner

Dieses Dokument beschreibt die funktionalen und nicht-funktionalen Anforderungen an die Schichtplaner-Software.

## 1. Funktionale Anforderungen

### FR-01: Mitarbeiterverwaltung
- **Beschreibung:** Ein Planer muss Mitarbeiter anlegen, bearbeiten und löschen können.
- **Akzeptanzkriterien:**
  - Mitarbeiterdaten umfassen Vorname, Nachname, Kürzel, Mitarbeitertyp (Azubi/Ausgelernt), Lehrjahr (für Azubis), Anstellungsgrad und Teamzugehörigkeit.
  - Pro Mitarbeiter können individuelle Schicht-Qualifikationen, Eignungen und Verfügbarkeiten (wochentags- und tageszeitspezifisch) hinterlegt werden.
  - Der Import und Export von Mitarbeiterdaten via CSV muss möglich sein.

### FR-02: Teamverwaltung
- **Beschreibung:** Ein Planer muss Teams definieren und verwalten können.
- **Akzeptanzkriterien:**
  - Jedes Team hat einen Namen und einen prozentualen Anteil an der Gesamtschichtlast.
  - Teams können team-spezifische Regeln zugewiesen bekommen.
  - Teamdaten können als CSV importiert und exportiert werden.

### FR-03: Schichttypen- und Regelverwaltung
- **Beschreibung:** Ein Planer muss Schichttypen und Regeln für die Planung definieren können.
- **Akzeptanzkriterien:**
  - Schichttypen haben einen Namen, eine Start- und Endzeit sowie einen täglichen Personalbedarf.
  - Es können Regeln für Schichtfolgen definiert werden (z.B. verbotene oder verpflichtende Kombinationen).
  - Für Azubis können je nach Lehrjahr Standard-Qualifikationen und -Verfügbarkeiten hinterlegt werden.

### FR-04: Schichtplanung
- **Beschreibung:** Ein Planer muss einen Schichtplan für einen definierten Zeitraum erstellen können.
- **Akzeptanzkriterien:**
  - Der Planungszeitraum ist auf 4 Wochen festgelegt und startet immer an einem Montag.
  - Die Software generiert automatisch einen Planvorschlag basierend auf allen hinterlegten Daten (Mitarbeiter, Teams, Regeln, Abwesenheiten).
  - Der generierte Plan wird in einer Kalenderansicht dargestellt.
  - Zuweisungen im Kalender können manuell geändert, hinzugefügt oder entfernt werden.
  - Erstellte Pläne können benannt, gespeichert und wieder geladen werden.

### FR-05: Analyse und Reporting
- **Beschreibung:** Ein Planer muss die generierten Pläne auswerten können.
- **Akzeptanzkriterien:**
  - Ein Dashboard zeigt Statistiken zur Schichtabdeckung, Mitarbeiter- und Team-Auslastung.
  - Vom Algorithmus erkannte Konflikte werden aufgelistet.
  - Ein detaillierter Bericht kann als PDF exportiert werden.

## 2. Nicht-Funktionale Anforderungen

### NFR-01: Benutzerschnittstelle (UI)
- Die Anwendung muss eine saubere, moderne und intuitive Benutzeroberfläche haben.
- Das Design muss responsiv sein und auf gängigen Desktop-Browsern korrekt dargestellt werden.

### NFR-02: Datenhaltung
- Alle Anwendungsdaten werden client-seitig im `localStorage` des Browsers gespeichert. Es gibt keine Server-Komponente.
- Ein globaler Im- und Export aller Daten als JSON-Datei muss möglich sein, um Backups und den Datentransfer zwischen Geräten zu ermöglichen.

### NFR-03: Technologie
- Die Anwendung wird als Single Page Application (SPA) mit dem Next.js App Router umgesetzt.
