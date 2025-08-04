# Codex Shift Planner

This repository contains the new, from-scratch implementation of the Codex Shift Planner application. The goal is to build a modern, robust, and maintainable web application for automated and manual shift planning.

The development of the core scheduling logic is being done using a Test-Driven Development (TDD) approach to ensure correctness and stability.

## Technology Stack

-   **Framework:** Next.js (with App Router)
-   **Language:** TypeScript
-   **Package Manager:** Bun
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Testing:** `bun:test`

## Current Status & Roadmap

The project is currently in the initial development phase. The core data structures, data manager, and a foundational, test-driven version of the shift scheduling algorithm have been implemented.

For a detailed plan of upcoming features and the project's long-term vision, please see the [ROADMAP.md](./ROADMAP.md) file.

## Getting Started

### Prerequisites

-   Node.js
-   Bun (https://bun.sh/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  Install the dependencies using Bun:
    ```bash
    bun install
    ```

### Running the Tests

The core logic of the `ShiftScheduler` is validated through unit tests. To run the test suite, use the following command:

```bash
bun test
```

### Running the Development Server

**Note:** The development server is currently not functional due to a persistent issue within the development sandbox environment (`next: command not found`). The core logic is being developed and verified via the test suite.

Once the environment is resolved, you can start the development server with:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.