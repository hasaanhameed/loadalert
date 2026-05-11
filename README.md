# NustPulse: Academic Workload and Stress Analytics System

NustPulse is a comprehensive full-stack application designed to aggregate academic deadlines, visualize workload distribution, and provide analytical insights into student stress levels. By integrating directly with university Learning Management Systems (LMS), the platform transforms fragmented assignment data into a cohesive, actionable dashboard that facilitates better time management and mental health awareness.

## Core Features

### 1. Automated LMS Synchronization
The system features a robust synchronization engine that interfaces with Moodle-based university portals. It securely fetches assignment schedules, quiz deadlines, and project timelines, eliminating the need for manual data entry and ensuring the dashboard is always up-to-date with current academic requirements.

### 2. Universal Pulse Feed
A centralized global stream that displays all academic activities retrieved from the LMS. This feed allows users to browse upcoming tasks across all enrolled modules, offering a high-level overview of the academic horizon before items are committed to the personal dashboard.

### 3. Precision Workload Analytics
The dashboard implements sophisticated visualization tools to quantify workload:
- **Weekly Load Distribution**: A graphical representation of deadline density over a rolling 7-day window.
- **Module Impact Analysis**: A breakdown of workload concentration by course, identifying which subjects are driving the highest stress levels.
- **Daily Agenda System**: A granular view of tasks scheduled for specific dates, including precise timing and course metadata.

### 4. Personal Task Orchestration
Beyond automated syncing, users can manually manage their academic commitments. Features include the ability to "pin" critical LMS items to the main dashboard, create custom personal deadlines, and categorize tasks by priority and course module.

### 5. Secure Credential Management
Security is prioritized through a multi-layered approach:
- **Encrypted Storage**: LMS credentials are encrypted at rest using industry-standard cryptographic protocols.
- **Session Isolation**: Each synchronization request is handled in an isolated session to prevent cookie leakage and session hijacking.
- **JWT Authentication**: User sessions are managed via JSON Web Tokens (JWT) for secure, stateless communication between the frontend and backend.

## Technical Architecture

NustPulse follows a modern, decoupled architecture designed for scalability and performance:

### Frontend
- **Framework**: React 18 with TypeScript for type-safe development.
- **Tooling**: Vite for optimized builds and rapid development.
- **Styling**: Tailwind CSS utilizing a custom design system focused on high-contrast, professional aesthetics.
- **UI Components**: Built on top of Radix UI (via shadcn/ui) for accessibility and consistent behavior.
- **State Management**: Context-driven architecture for authentication and global application state.

### Backend
- **Framework**: FastAPI (Python 3.11) for high-performance, asynchronous API execution.
- **Database**: PostgreSQL interfaced via SQLAlchemy ORM for reliable structured data storage.
- **Migrations**: Alembic for version-controlled database schema evolution.
- **Caching**: Redis integration for dashboard state caching and performance optimization.
- **LMS Integration**: Custom HTTP session management for Moodle/LMS interaction.

### Infrastructure
- **Containerization**: Docker and Docker Compose orchestration for unified environment parity.
- **Reverse Proxy**: Nginx acting as a high-performance entry point for both services.
- **Deployment**: Configured for Vercel (Frontend) and Render (Backend).

## Future Roadmap: Notifications & Background Sync

The system is designed to evolve from a manual synchronization tool into a proactive academic assistant. The following infrastructure is planned for the next phase of development:

### 1. Distributed Task Queue (Celery & Redis)
To handle resource-intensive LMS synchronization without impacting API performance, a background worker system will be implemented:
- **Celery Workers**: Will handle the decryption of LMS credentials and the subsequent data fetching in isolated background processes.
- **Celery Beat**: A scheduler to trigger global LMS synchronization at regular intervals (e.g., every 6 hours), ensuring the "Universal Pulse" feed remains current without user intervention.

### 2. Automated Notification Service
A dual-channel email notification system designed to keep users informed via `nustpulse@gmail.com`:
- **New Deadline Alerts**: Real-time notifications sent when the background sync engine discovers a previously unknown assignment or quiz.
- **Proximity Reminders**: Automated daily checks that notify users of "pinned" deadlines approaching within a 72-hour window.

### 3. Schema Enhancements
Database models will be extended to track notification states (`notified_new`) and reminder timestamps (`last_reminder_sent_at`) to ensure precise communication and prevent redundant alerts.

## Project Structure

```text
NustPulse/
├── loadalert_backend/      # FastAPI application logic and database models
├── loadalert_frontend/     # React/Vite source code and UI components
├── nginx/                  # Reverse proxy configuration
├── docker-compose.yml      # Service orchestration for local development
└── README.md               # System documentation
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for manual frontend development)
- Python 3.11+ (for manual backend development)

### Containerized Deployment (Recommended)
1. Clone the repository and navigate to the root directory.
2. Configure environment variables in `.env` files within `loadalert_backend/` and `loadalert_frontend/`.
3. Execute the orchestration command:
   ```bash
   docker-compose up --build
   ```
4. Access the application at `http://localhost`.

### Manual Development Setup
#### Backend
1. Navigate to `loadalert_backend/`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the development server: `uvicorn app.main:app --reload`.

#### Frontend
1. Navigate to `loadalert_frontend/`.
2. Install dependencies: `npm install`.
3. Start the Vite development server: `npm run dev`.

## License

Copyright (c) 2026 NustPulse. All Rights Reserved.

This software is proprietary and confidential. It is NOT made for public use, distribution, or reproduction. Access to this codebase is restricted to authorized individuals only. Unauthorized copying of this file, via any medium, is strictly prohibited.

## Disclaimer

NustPulse is an independent academic tool and is not officially affiliated with or endorsed by any university or Learning Management System provider.
