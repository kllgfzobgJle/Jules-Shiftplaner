# Agent-Anweisungen für den Codex-Shiftplaner

Dieses Dokument dient als Kontext für KI-Entwicklungspartner.

## 1. Projektziel

Das Ziel des Projekts "Codex-Shiftplaner" ist die Entwicklung einer Webanwendung zur automatisierten und manuellen Erstellung von Schichtplänen. Die Software soll Mitarbeiter, Teams, Schichttypen, Qualifikationen und komplexe Regeln berücksichtigen, um faire und konfliktfreie Pläne zu generieren.

## 2. Technologie-Stack

- **Framework:** Next.js (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **UI-Komponenten:** shadcn/ui
- **Datenhaltung:** Client-seitig via `localStorage`. Es gibt kein Server-Backend.

## 3. Kernlogik und wichtige Dateien

Der Fokus bei Code-Analysen, Fehlerbehebungen oder Erweiterungen sollte auf folgenden Dateien liegen:

- **`src/lib/types.ts`**: Definiert alle zentralen Datenmodelle der Anwendung (z.B. `Employee`, `Team`, `ShiftType`). Dies ist die Grundlage für alle Datenstrukturen.
- **`src/lib/dataManager.ts`**: Kapselt die gesamte Logik für den Zugriff auf den `localStorage`. Alle Lese- und Schreibvorgänge für die Kerndaten (Mitarbeiter, Teams etc.) werden hier verwaltet.
- **`src/lib/shiftScheduler.ts`**: Enthält den komplexen Algorithmus zur automatischen Schichtplanung. Dies ist die kritischste und fehleranfälligste Komponente des Systems. Änderungen hier erfordern besondere Sorgfalt.
- **`src/components/ShiftPlanner.tsx`**: Die zentrale UI-Komponente, die den Planungsprozess steuert, den Scheduler aufruft und die Ergebnisse (Kalender, Analyse) darstellt.
- **`src/components/DataProvider.tsx`**: Stellt alle Anwendungsdaten über einen React Context bereit.

## 4. Aktuelle Entwicklungsphase

Die Anwendung befindet sich in einer Phase der Stabilisierung und Refaktorierung. Priorität hat die Verbesserung der Testbarkeit und Nachvollziehbarkeit des Planungsalgorithmus, bevor neue grosse Features hinzugefügt werden.
