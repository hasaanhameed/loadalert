# NustPulse: High-Precision Academic Monitoring System

**PROPRIETARY AND CONFIDENTIAL**  
*This repository and its contents are the sole property of the author. Unauthorized copying, distribution, or use of this codebase is strictly prohibited.*

---

## System Overview
**Live Production URL**: [nustpulse.com](https://nustpulse.com)

NustPulse is a high-fidelity academic management platform engineered for NUST students. The system centralizes fragmented data from university Learning Management Systems (LMS), transforming it into a cohesive dashboard for workload management and stress reduction. It utilizes an asynchronous background engine to monitor deadlines and automate student notifications via Gmail.

## Implementation Details

### Backend Architecture (FastAPI & Celery)
The backend is built using FastAPI, leveraging asynchronous programming for high concurrency.
- **Data Persistence**: Utilizes PostgreSQL hosted on Supabase, interfaced via SQLAlchemy ORM for type-safe database operations.
- **Asynchronous Task Queue**: Implements Celery with Upstash Redis as the message broker. This handles long-running LMS synchronization tasks and notification scheduling without blocking the main API thread.
- **Scheduled Synchronization**: Celery Beat is configured to trigger a system-wide LMS refresh daily at 10:00 PM PKT, ensuring data remains current.
- **Security & Encryption**: Sensitive LMS credentials are never stored in plaintext. The system uses Fernet symmetric encryption (cryptography library) to secure credentials at rest.
- **Authentication**: Implements OAuth2 with JWT (JSON Web Tokens) for secure session management and Google OAuth for secondary notification account linkage.

### Frontend Architecture (React & Vite)
The frontend is a modern Single Page Application (SPA) built with React 18 and Vite.
- **Design System**: A custom-engineered "Obsidian Blood" and "Pure Snow" aesthetic. It prioritizes high-contrast typography and minimalist layout to reduce cognitive load during intense academic periods.
- **State Management**: Implements a Context-driven architecture for global user state and authentication persistence.
- **Routing**: Client-side routing via React Router, with a custom `vercel.json` configuration to handle SPA routing in the production environment.
- **Component Library**: Utilizes Radix UI and Lucide-React for accessible, high-fidelity interactive elements.

### Deployment & Infrastructure
- **Containerization**: Multi-stage Docker builds are used to minimize image size and maximize security for both frontend and backend services.
- **Cloud Hosting**: Backend services (API, Worker, Beat) are hosted on Railway as independent containerized services.
- **Edge Delivery**: The frontend is deployed to Vercel, ensuring low-latency delivery of the application assets.
- **Managed Services**: Leverages Supabase for database management and Upstash for serverless Redis, ensuring high availability without manual infrastructure maintenance.

## Feature Set

### 1. LMS Pulse Sync
Direct synchronization with university portal accounts. The system performs secure scraping of the Moodle-based LMS to retrieve assignment titles, course metadata, and precise due dates.

### 2. Smart Pruning Engine
An intelligent data management layer that cross-references user submissions. Once a task is marked as submitted on the LMS, the pruning engine automatically removes it from the NustPulse dashboard, maintaining a high-signal, zero-noise workspace.

### 3. Proactive Gmail Notifications
A dual-layer notification system:
- **Instant Alerts**: Users receive immediate Gmail notifications when a new assignment is detected in the global stream.
- **Proximity Reminders**: Automated alerts are triggered 3 days before any deadline to ensure sufficient preparation time.

### 4. Universal Pulse (Global Stream)
A discovery feed that displays academic activity across all monitored sections. Users can browse assignments and "pin" relevant items to their personal dashboard, facilitating collaboration and early awareness.

### 5. Workload Analytics Dashboard
Provides quantifiable insights into academic stress:
- **Daily Agenda**: A granular breakdown of tasks for the current 24-hour cycle.
- **Weekly Load Intensity**: A visual distribution of deadlines over a 7-day rolling window, allowing students to identify upcoming peak stress periods.

## Project Structure
```text
NustPulse/
├── nustpulse_backend/       # FastAPI Core, Celery Tasks, Encryption logic, and Models
│   ├── app/                 # Application source code
│   └── docker/              # Production-grade Dockerfile
├── nustpulse_frontend/      # React/Vite source code and UI components
│   ├── src/                 # React components and pages
│   └── vercel.json          # SPA routing configuration for Vercel
├── docker-compose.yml       # Local orchestration for development parity
└── README.md                # System documentation
```

## Legal and Licensing

**Copyright (c) 2026 NustPulse. All Rights Reserved.**

This software is proprietary and confidential. Access to this codebase is restricted to authorized individuals only.
- **No Redistribution**: You may not distribute or sell this software.
- **No Modification**: You may not create derivative works from this codebase.
- **No Reverse Engineering**: Decompilation or analysis for the purpose of replication is strictly prohibited.

NustPulse is an independent academic tool and is not officially affiliated with or endorsed by NUST or any LMS provider.
