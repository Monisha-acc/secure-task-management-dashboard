# TaskFlow — Secure Task Management Dashboard

A full-stack task management application with JWT authentication, built as a technical assessment for Vitasoft.

## Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Frontend      | React 18 + Vite + TypeScript   |
| Styling       | Tailwind CSS                   |
| Data Fetching | TanStack Query (react-query)   |
| Animations    | Framer Motion                  |
| Dates         | date-fns                       |
| Backend       | Node.js + Express + TypeScript |
| Database      | SQLite (better-sqlite3)        |
| Auth          | JWT (jsonwebtoken + bcryptjs)  |
| API Docs      | Swagger (swagger-ui-express)   |
| HTTP Client   | Axios                          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/Monisha-acc/secure-task-management-dashboard.git
cd secure-task-management-dashboard
```

### 2. Setup Backend

```bash
cd backend
```

Create a `.env` file inside the `backend` folder:

```
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Then install dependencies and start the server:

```bash
npm install
npm run dev
```

> **Note:** The following packages are already included in `package.json` and will be installed automatically with `npm install`:
>
> - `swagger-ui-express` — serves the Swagger UI
> - `swagger-jsdoc` — generates API docs from JSDoc comments
> - `@types/swagger-ui-express` — TypeScript types
> - `@types/swagger-jsdoc` — TypeScript types

Backend runs at `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

> All dependencies including Tailwind CSS, Framer Motion, React Query, date-fns, and Axios are pre-configured in `package.json` and installed automatically with `npm install`.

Frontend runs at `http://localhost:5173`

### 4. View API Documentation (Swagger)

Once backend is running, open:

http://localhost:5000/api-docs

---

## Features

- JWT authentication — register and login with secure password hashing
- Full CRUD for tasks — create, read, update, delete
- Click status badge on any card to cycle through todo → in-progress → done
- Filter tasks by status and priority
- Search tasks by title or description
- Overdue task highlighting with warning indicator
- Delete confirmation dialog to prevent accidental deletion
- Toast notifications for all actions
- Task completion progress bar
- Skeleton loading states
- Responsive design — works on mobile and desktop
- Completed tasks remain visible with strikethrough styling

---

## Third-Party Package Choices

### @tanstack/react-query

Chosen for its powerful data fetching capabilities including automatic caching, background refetching, and built-in loading and error states. It eliminates the need for manual `useEffect` + `useState` combinations for API calls, making the code cleaner and more maintainable.

### framer-motion

Provides smooth, physics-based animations for modals, task cards entering and exiting, and micro-interactions. It significantly improves the user experience without complex CSS animations.

### date-fns

A lightweight, tree-shakeable date utility library used for formatting due dates and computing overdue status. Chosen over alternatives like `moment.js` because it is modular and does not bloat the bundle size.

### better-sqlite3

A synchronous SQLite driver that is simple and reliable for local development. No connection pooling overhead, easy setup, and zero configuration required — ideal for this assessment.

### bcryptjs

Used for secure password hashing before storing in the database. Ensures passwords are never stored as plain text, protecting users even if the database is compromised.

### axios

Used as the HTTP client for all frontend API calls. Chosen over the native `fetch` API because it provides request and response interceptors, automatic JSON parsing, and better error handling — all of which are used in the `apiClient.ts` configuration.

### swagger-ui-express + swagger-jsdoc

Provides automatic API documentation with an interactive UI. Allows developers to visualise and test all API endpoints directly from the browser without any additional tools.

---

## Project Structure

```
secure-task-management-dashboard/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── database.ts       # SQLite connection and schema
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT authentication middleware
│   │   │   └── errorHandler.ts   # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.ts           # Register and login routes
│   │   │   └── tasks.ts          # CRUD task routes
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── swagger.ts            # Swagger configuration
│   │   └── index.ts              # Express app entry point
│   ├── data/
│   │   └── tasks.db              # SQLite database file
│   └── .env                      # Environment variables (not committed)
│
└── frontend/
    └── src/
        ├── components/           # Reusable UI components
        ├── context/              # Auth context and provider
        ├── hooks/                # Custom React hooks
        ├── lib/                  # Axios client configuration
        ├── pages/                # Page components
        ├── services/             # API service functions
        └── types/                # TypeScript interfaces
```

---

## Viewing the SQLite Database (Optional)
The project uses a local SQLite database stored at:
`backend/data/tasks.db`

If you would like to inspect the database manually in VS Code:
1. Press `Ctrl + Shift + X`
2. Search for **SQLite Viewer**
3. Install the extension
4. Open `tasks.db`
5. View tables and records directly

Alternatively, you may use any SQLite-compatible database browser.

## API Endpoints

| Method | Endpoint             | Auth | Description               |
| ------ | -------------------- | ---- | ------------------------- |
| POST   | `/api/auth/register` | No   | Register new user         |
| POST   | `/api/auth/login`    | No   | Login and get JWT token   |
| GET    | `/api/tasks`         | Yes  | Get all tasks for user    |
| POST   | `/api/tasks`         | Yes  | Create a new task         |
| PUT    | `/api/tasks/:id`     | Yes  | Update a task             |
| DELETE | `/api/tasks/:id`     | Yes  | Delete a task             |
| GET    | `/api/health`        | No   | Health check              |
| GET    | `/api-docs`          | No   | Swagger API documentation |

---

## Known Limitations / If I Had More Time

### Security Improvements

- **Refresh token rotation** — replace long-lived JWTs with short-lived access tokens and refresh tokens for improved security
- **Account management** — allow users to change password, update profile, or delete their account

### Scalability & Performance

- **Pagination** — implement pagination or infinite scroll for large task datasets
- **Database indexing** — add indexes for frequently queried fields (e.g., `user_id`, `status`)

### User Experience Enhancements

- **Drag and drop Kanban board** — allow users to move tasks between status columns interactively
- **Task categories / tags** — enable custom tags for better task organisation
- **Due date reminders** — browser notifications or email reminders for upcoming deadlines
- **Dark/light mode toggle** — allow users to switch themes

### Quality & Maintainability

- **Unit & integration tests** — add Jest + React Testing Library for frontend, Supertest for backend APIs
- **Improved error logging** — integrate structured logging (e.g., Winston)

### DevOps & Deployment

- **Dockerisation** — containerise frontend and backend using Docker Compose
- **CI/CD pipeline** — automate testing and deployment using GitHub Actions

---

## Password Requirements

When registering, passwords must meet the following criteria:

- Minimum 6 characters
- At least one number
- At least one special character (`!@#$%^&*`)

---

## Security Features

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- All task routes protected by JWT middleware
- Ownership verification before any task update or delete
- Vague error messages on login to prevent username enumeration attacks
- CORS restricted to frontend origin only
