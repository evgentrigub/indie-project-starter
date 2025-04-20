# Indie Hacking Project Starter

A complete monorepo template for indie hackers who want to focus on building their product without worrying about technical setup.

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- Swagger API documentation
- User authentication (Email, Google OAuth)
- Stripe subscription integration

### Frontend
- Vue 3 (Nuxt.js)
- Tailwind CSS
- DaisyUI components
- ESLint

## Project Structure

```
indie-project-starter/
├── apps/
│   └── todo-app/        # Main application
├── packages/
│   ├── backend/         # NestJS backend
│   └── frontend/        # Vue 3 frontend
└── pnpm-workspace.yaml  # Workspace configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PNPM package manager (`npm install -g pnpm`)
- PostgreSQL
- Stripe account for payment processing

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/indie-project-starter.git
cd indie-project-starter
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit .env file with your configuration
```

4. Start development servers
```bash
# Start both backend and frontend
pnpm dev

# Start only backend
pnpm dev:backend

# Start only frontend
pnpm dev:frontend
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger docs: http://localhost:3001/api/docs

## Features

- User authentication (signup, login, profile management)
- Social login with Google
- Task management (create, read, update, delete)
- Subscription management with Stripe
- Responsive UI with modern components

## Testing

Run tests with:

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm test:backend

# Run frontend tests
pnpm test:frontend
```

## Deployment

Instructions for deploying to popular platforms will be provided in the deployment guide.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
