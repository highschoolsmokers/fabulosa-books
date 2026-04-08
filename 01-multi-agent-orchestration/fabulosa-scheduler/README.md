# Fabulosa Books Scheduling App

A professional employee shift scheduling web application built for Fabulosa Books bookstore.

## Features

- Weekly schedule view with 7 days
- 3 shift types per day: Opening, Mid, Closing
- Drag-and-click employee assignment
- Distinction between regular and on-call employees
- Bookstore-themed warm color scheme
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ (preferably 20+)
- npm or yarn

### Installation

1. Clone the repository and navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

For local development, the app uses SQLite by default. To use Neon Postgres:
- Create a Neon project at https://console.neon.tech/
- Copy your connection string
- Update `DATABASE_URL` in `.env.local`

### Running the App

Development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

Build for production:
```bash
npm run build
npm run start
```

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  is_on_call BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Schedule Table
```sql
CREATE TABLE schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL (0-6, Sunday-Saturday),
  shift_type TEXT NOT NULL (opening, mid, closing),
  employee_name TEXT,
  week_start_date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(week_start_date, day_of_week, shift_type)
)
```

## Store Hours

- **Monday–Friday**: 10am–8pm
- **Saturday**: 10am–9pm
- **Sunday**: 10am–8pm

## Shift Times

- **Opening**: 10am–4pm
- **Mid**: 12pm–6pm
- **Closing**: 2pm–8pm (or 2pm–9pm on Saturday)

## Employees

### Regular Staff (6)
- Alvin
- Melissa
- Marcus
- Dylan
- Joel
- Billy

### On-Call / As-Needed (2)
- Johnny Ray
- Carly

## API Routes

### GET /api/employees
Returns list of all employees with their details.

### GET /api/schedule?weekStart=YYYY-MM-DD
Returns schedule for a given week.

### PUT /api/schedule
Updates a shift assignment.
```json
{
  "weekStart": "2024-03-25",
  "dayOfWeek": 1,
  "shiftType": "opening",
  "employeeName": "Alvin"
}
```

## Tech Stack

- **Framework**: Next.js 14.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (local) / Neon Postgres (production)
- **UI Library**: React 18

## File Structure

```
app/
├── app/
│   ├── api/
│   │   ├── employees/route.ts
│   │   └── schedule/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ScheduleGrid.tsx
│   └── ShiftCell.tsx
├── lib/
│   ├── db.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── data/              # SQLite database (auto-created)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Development Notes

- The app automatically initializes the SQLite database on first run
- Employees are seeded into the database automatically
- The UI uses a warm, bookstore-appropriate color scheme:
  - Amber (#D4A574) - Primary accent
  - Brown (#8B6F47) - Secondary accent
  - Dark Brown (#3E2723) - Text/Headers
  - Cream (#FFF8F0) - Background

## License

All rights reserved to Fabulosa Books.
