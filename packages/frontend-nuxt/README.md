# Indie Project Frontend (Nuxt.js)

A modern, type-safe frontend for the Indie Project built with Nuxt.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 Modern Vue.js 3 with Nuxt.js
- 📝 TypeScript support
- 🎨 Tailwind CSS with DaisyUI
- 🔐 Authentication with JWT
- 📱 Responsive design
- 📊 Task management
- 💳 Subscription management
- 🔄 Real-time updates

## Prerequisites

- Node.js 18+
- pnpm 8+

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root directory:
   ```
   NUXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

5. Preview production build:
   ```bash
   pnpm preview
   ```

## Project Structure

```
frontend-nuxt/
├── components/     # Reusable Vue components
├── composables/   # Vue composables
├── layouts/       # Layout components
├── middleware/    # Route middleware
├── pages/         # Page components
├── plugins/       # Nuxt plugins
├── public/        # Static files
├── server/        # Server-side code
├── stores/        # Pinia stores
├── assets/        # Assets (CSS, images, etc.)
├── .env           # Environment variables
├── nuxt.config.ts # Nuxt configuration
├── package.json   # Project dependencies
├── README.md      # Project documentation
└── tsconfig.json  # TypeScript configuration
```

## Development

### Code Style

- Use TypeScript for type safety
- Follow Vue.js style guide
- Use composition API with `<script setup>`
- Use Tailwind CSS for styling
- Use Pinia for state management

### Testing

Run tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Generate test coverage:
```bash
pnpm test:coverage
```

### Linting

Run linter:
```bash
pnpm lint
```

## Deployment

The project can be deployed to any static hosting service that supports Node.js applications, such as:

- Vercel
- Netlify
- Cloudflare Pages
- AWS Amplify

## License

MIT
