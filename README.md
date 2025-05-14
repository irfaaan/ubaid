
# Samsung Phone Advisor Application

A full-stack application for comparing and getting recommendations for Samsung phones using AI-powered insights.

## Features

- AI-powered phone recommendations
- Phone comparison tool
- Feature guides
- Trade-in value calculator
- Real-time phone specs and pricing

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL (via Neon)
- AI: OpenAI API
- Styling: Tailwind CSS + shadcn/ui

## Prerequisites

- Node.js v20+
- NPM or Yarn
- PostgreSQL database
- OpenAI API key

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Deployment on Replit

1. Fork this repl in Replit
2. Add secrets in the Secrets tab:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `OPENAI_API_KEY`: Your OpenAI API key
3. Click the Run button to start the development server
4. For production deployment:
   - Click the "Deploy" button in the Deployments tab
   - Replit will automatically build and deploy your application
   - You'll get a `.replit.app` URL for your live application

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utility functions
├── server/              # Backend Express server
│   ├── routes.ts       # API routes
│   ├── openai.ts       # OpenAI integration
│   └── db.ts           # Database configuration
└── shared/             # Shared TypeScript types
    └── schema.ts
```

## API Routes

- `GET /api/phones` - Get all phones
- `POST /api/recommendations` - Get AI-powered recommendations
- `GET /api/comparisons` - Get popular comparisons
- `GET /api/guides` - Get feature guides

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
