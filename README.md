# Email Scheduler API

This project is an Express.js-based API for scheduling and managing emails. It uses Prisma as an ORM, PostgreSQL as the database, and node-cron for scheduling tasks.

## Features

- Schedule emails to be sent at a specific date and time
- Support for recurring emails (daily, weekly, monthly, quarterly)
- Retrieve details of scheduled emails
- List all scheduled emails
- Delete scheduled emails

## Prerequisites

- Node.js (v14 or later recommended)
- PostgreSQL database
- Gmail account (for sending emails)

## Installation

1. Clone the repository:
   git clone https://github.com/your-username/email-scheduler-api.git
   cd email-scheduler-api
   Copy
2. Install dependencies:
   npm install
   Copy
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   DIRECT_URL="postgresql://username:password@localhost:5432/your_database"
   GOOGLE_MAIL="your-gmail@gmail.com"
   GOOGLE_APP_PASSWORD="your-app-password"
   Copy
4. Generate Prisma client:
   npm run prisma:generate
   Copy
5. Run database migrations:
   npm run prisma:migrate
   Copy

## Running the Application

- For development:
  npm run dev
  Copy
- For production:
  npm run build
  npm start
  Copy

## API Endpoints

- `POST /schedule-email`: Schedule a new email
- `GET /scheduled-emails/:id`: Get details of a specific scheduled email
- `GET /scheduled-emails`: Get all scheduled emails
- `DELETE /scheduled-emails/:id`: Delete a scheduled email
