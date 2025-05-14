
# Samsung Phone Advisor Application

A full-stack application for comparing and getting recommendations for Samsung phones using AI-powered insights.

## Features

- AI-powered phone recommendations
- Phone comparison tool
- Feature guides
- Trade-in value calculator
- Real-time phone specs and pricing

## Prerequisites

- Node.js v20+
- OpenAI API key
- Replit account

## Complete Setup Guide

1. **Fork the Repository**
   - Fork this repl in Replit

2. **Install Dependencies**
```bash
npm install
```

3. **Set up Environment Variables**
   - Open the Secrets tab (lock icon)
   - Add the following secrets:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

4. **Database Setup**
   - Open the "Database" tab in Replit
   - Click "Create a database"
   - Wait for the database to be provisioned
   - The `DATABASE_URL` will be automatically added to your secrets

5. **Push Database Schema**
```bash
npm run db:push
```

6. **Start Development Server**
```bash
npm run dev
```

The application will be available at the URL shown in the Replit webview.

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

## Deployment

1. Click the "Deploy" button in the Deployments tab
2. Replit will automatically:
   - Build the project
   - Deploy your application
   - Provide a `.replit.app` URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
