# NustPulse: Academic Workload and Stress Analytics System

NustPulse is a comprehensive full-stack application designed to aggregate academic deadlines, visualize workload distribution, and provide analytical insights into student stress levels. By integrating directly with university Learning Management Systems (LMS), the platform transforms fragmented assignment data into a cohesive, actionable dashboard that facilitates better time management and mental health awareness.

## Core Features

### 1. Automated LMS Synchronization & Pruning
The system features a robust synchronization engine that interfaces with Moodle-based university portals. 
- **Auto-Sync**: Securely fetches assignment schedules, quiz deadlines, and project timelines.
- **Smart Pruning**: Automatically detects when a student has submitted an assignment on the LMS and removes it from the NustPulse dashboard to keep the workspace clutter-free.

### 2. Proactive Gmail Notifications
A background notification engine keeps students ahead of their workload via `nustpulse@gmail.com`:
- **Real-Time Alerts**: Instant emails sent when new assignments are detected in the LMS feed.
- **Deadline Reminders**: Automated warnings sent for critical tasks approaching their 3-day window.
- **Gmail Nudge**: An intelligent UI component that prompts students to connect their accounts for real-time updates if they haven't already done so.

### 3. Universal Pulse Feed
A centralized global stream that displays all academic activities retrieved from the LMS. This feed allows users to browse upcoming tasks across all enrolled modules, offering a high-level overview of the academic horizon before items are committed to the personal dashboard.

### 4. Precision Workload Analytics
The dashboard implements sophisticated visualization tools to quantify workload:
- **Weekly Load Distribution**: A graphical representation of deadline density over a rolling 7-day window.
- **Module Impact Analysis**: A breakdown of workload concentration by course, identifying which subjects are driving the highest stress levels.
- **Daily Agenda System**: A granular view of tasks scheduled for specific dates, including precise timing and course metadata.

### 5. Personal Task Orchestration
Beyond automated syncing, users can manually manage their academic commitments. Features include the ability to "pin" critical LMS items to the main dashboard, create custom personal deadlines, and categorize tasks by priority and course module.

## Technical Architecture

NustPulse follows a modern, decoupled architecture designed for scalability and performance:

### Frontend
- **Framework**: React 18 with TypeScript for type-safe development.
- **Tooling**: Vite for optimized builds and rapid development.
- **Styling**: Vanilla CSS utilizing a custom design system focused on high-contrast, professional aesthetics ("Obsidian Blood" & "Pure Snow").
- **UI Components**: Built on top of Radix UI (via shadcn/ui) for accessibility and consistent behavior.
- **State Management**: Context-driven architecture for authentication and global application state.

### Backend
- **Framework**: FastAPI (Python 3.11) for high-performance, asynchronous API execution.
- **Database**: PostgreSQL (Supabase) interfaced via SQLAlchemy ORM.
- **Task Queue**: **Celery** with **Redis** for background synchronization and notification scheduling.
- **Email Engine**: **FastAPI-Mail** with SMTP integration for automated student alerts.
- **Security**: **Fernet (Cryptography)** for encrypting LMS credentials and **JWT** for secure user sessions.

### Infrastructure
- **Containerization**: Docker and Docker Compose orchestration for unified environment parity.
- **Reverse Proxy**: Nginx acting as a high-performance entry point for both services.
- **Scheduler**: Celery Beat for periodic system-wide LMS health checks and data refreshes.

## Project Structure

```text
NustPulse/
├── nustpulse_backend/       # FastAPI application logic, Celery tasks, and models
├── nustpulse_frontend/      # React/Vite source code and UI components
├── nginx/                   # Reverse proxy configuration
├── docker-compose.yml       # Service orchestration for local development
└── README.md                # System documentation
```

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for manual frontend development)
- Python 3.11+ (for manual backend development)
- A Redis instance (included in Docker setup)

### Containerized Deployment (Recommended)
1. Clone the repository and navigate to the root directory.
2. Configure environment variables in `.env` files within `nustpulse_backend/` and `nustpulse_frontend/`.
3. Execute the orchestration command:
   ```bash
   docker-compose up --build
   ```
4. Access the application at `http://localhost`.

### Manual Development Setup
#### Backend
1. Navigate to `nustpulse_backend/`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Ensure Redis is running locally.
4. Run the development server: `uvicorn app.main:app --reload`.
5. Start Celery worker: `celery -A app.core.celery_app worker --loglevel=info`.

#### Frontend
1. Navigate to `nustpulse_frontend/`.
2. Install dependencies: `npm install`.
3. Start the Vite development server: `npm run dev`.

## License

Copyright (c) 2026 NustPulse. All Rights Reserved.

This software is proprietary and confidential. Access to this codebase is restricted to authorized individuals only. Unauthorized copying of this file, via any medium, is strictly prohibited.

## Disclaimer

NustPulse is an independent academic tool and is not officially affiliated with or endorsed by any university or Learning Management System provider.
