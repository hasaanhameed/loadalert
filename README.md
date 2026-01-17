# LoadAlert

LoadAlert is a full-stack web application designed to help users monitor deadlines, understand workload distribution, and anticipate stress before it becomes overwhelming. Instead of treating deadlines as isolated events, LoadAlert models workload holistically and presents it in a way that supports better planning and decision-making.

The core idea behind LoadAlert is simple: deadlines do not cause stress in isolation — poor distribution of effort over time does. This application provides visibility into that distribution and helps users stay ahead.

## Live Demo

Frontend: https://loadalert.vercel.app

## What LoadAlert Does

LoadAlert allows users to:
- Create and manage deadlines with associated effort estimates
- View prioritized tasks based on urgency and workload
- Monitor workload concentration over time
- Analyze stress indicators derived from deadline density and effort overlap
- Manage user profiles and authentication securely

The application focuses on clarity and usability rather than raw task tracking, making it especially suitable for students and knowledge workers managing multiple concurrent responsibilities.

## Tech Stack

### Frontend
- React with TypeScript
- Vite for development and build tooling
- Tailwind CSS for styling
- Client-side routing and state management using modern React patterns
- API-driven architecture with a clear separation of concerns

### Backend
- Python with FastAPI
- RESTful API design
- JWT-based authentication
- SQLAlchemy for ORM and database interactions
- Alembic for database migrations
- Redis for caching and performance optimization
- Structured routing for dashboards, deadlines, stress analysis, and user management

### Infrastructure & Deployment
- Frontend deployed on Vercel
- Backend deployed on Render
- Redis used as a caching layer to reduce database load and improve response times
- Docker and Docker Compose for local development and service orchestration
- Environment-based configuration for secure secret management

## Architecture Highlights

- Clear separation between frontend and backend concerns
- Stateless backend with Redis used for cache-aware performance optimization
- Authentication handled server-side with secure token validation
- No hard-coded values or secrets in the codebase
- Designed to scale from a single-user setup to multi-user usage without architectural changes

## License

This project is provided for educational and demonstration purposes. You are free to explore, learn from, and adapt the codebase as needed.
