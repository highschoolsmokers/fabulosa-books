# Fabulosa Books Scheduler - Setup & Deployment Guide

## Project Overview

A complete Next.js 14 scheduling web application for managing employee shifts at Fabulosa Books bookstore. The app features a professional weekly schedule view with drag-and-click shift assignment for 8 employees (6 regular, 2 on-call).

**Build Status**: ✅ Successfully builds with `npm run build`

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

The app uses an in-memory SQLite database (persisted to `data/schedule.db.json`) that auto-initializes with all employees on first run.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
app/
├── app/
│   ├── api/
│   │   ├── employees/route.ts     # GET /api/employees
│   │   └── schedule/route.ts      # GET/PUT /api/schedule
│   ├── page.tsx                    # Main schedule view
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ScheduleGrid.tsx            # Weekly schedule grid + navigation
│   └── ShiftCell.tsx               # Shift assignment dropdown
├── lib/
│   ├── db.ts                       # Database layer (sql.js)
│   └── utils.ts                    # Utilities & constants
├── types/
│   └── index.ts                    # TypeScript interfaces
├── data/                           # Auto-created SQLite database
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind theme (warm bookstore colors)
└── next.config.js
```

## Features Implemented

### Schedule Management
- Weekly view showing 7 days (Sunday–Saturday)
- 3 shifts per day: Opening, Mid, Closing
- Correct hours: Closing 2pm–9pm on Saturday (vs 2pm–8pm weekdays)
- One employee per shift per day
- Week navigation (Previous, This Week, Next Week)

### Employee Management
- 8 employees pre-loaded (Alvin, Melissa, Marcus, Dylan, Joel, Billy, Johnny Ray, Carly)
- Regular vs On-Call distinction with color coding
  - Regular: Amber (#D4A574)
  - On-Call: Brown (#8B6F47)
  - Unassigned: Gray

### UI/UX
- Clean, professional design with bookstore-appropriate warm color palette
- Responsive layout with Tailwind CSS
- Click-to-assign dropdown for each shift slot
- Visual distinction between employee types
- Week info display with dates

### Database
- SQL.js (in-memory SQLite) for local development
- Auto-persists to `data/schedule.db.json`
- Ready for Neon Postgres via DATABASE_URL in production

## API Routes

### GET /api/employees
Returns list of all employees.

**Response:**
```json
[
  { "id": 1, "name": "Alvin", "is_on_call": false },
  { "id": 7, "name": "Johnny Ray", "is_on_call": true }
]
```

### GET /api/schedule?weekStart=YYYY-MM-DD
Returns schedule for given week (0=Sunday, 6=Saturday).

**Response:**
```json
{
  "schedule": [
    {
      "id": 1,
      "day_of_week": 1,
      "shift_type": "opening",
      "employee_name": "Alvin",
      "week_start_date": "2024-03-25"
    }
  ],
  "weekStart": "2024-03-25"
}
```

### PUT /api/schedule
Updates a shift assignment.

**Request Body:**
```json
{
  "weekStart": "2024-03-25",
  "dayOfWeek": 1,
  "shiftType": "opening",
  "employeeName": "Alvin"
}
```

To unassign, pass `null` for `employeeName`.

## Database Schema

Automatically created in `lib/db.ts`:

### employees
```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  is_on_call BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### schedule
```sql
CREATE TABLE schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week INTEGER NOT NULL,
  shift_type TEXT NOT NULL,
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

All shifts are designed for continuous 10am–8pm (or 9pm Sat) coverage:

- **Opening**: 10am–4pm
- **Mid**: 12pm–6pm
- **Closing**: 2pm–8pm (2pm–9pm Saturday)

## Employees

### Regular Staff (6)
1. Alvin
2. Melissa
3. Marcus
4. Dylan
5. Joel
6. Billy

### On-Call / As-Needed (2)
7. Johnny Ray
8. Carly

## Environment Configuration

### .env.example
Shows available options:
- `DATABASE_URL` - Neon Postgres connection (leave blank for SQLite fallback)

### .env.local
Currently set to use SQLite (empty DATABASE_URL).

### Switching to Neon Postgres
1. Create project at https://console.neon.tech/
2. Copy connection string
3. Update `.env.local`:
   ```
   DATABASE_URL=postgresql://user:password@host/database
   ```
4. The app will use Postgres instead of SQLite

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom theme |
| Database | SQL.js (local) / Neon Postgres (prod) |
| Runtime | Node.js 18+ |

## Color Scheme

Warm, bookstore-appropriate palette:
- Primary: Amber (#D4A574)
- Secondary: Brown (#8B6F47)
- Accent: Dark Brown (#3E2723)
- Background: Cream (#FFF8F0)
- Gold: #C9A876

## Files Overview

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main schedule page (client component) |
| `app/layout.tsx` | Root layout with metadata |
| `app/globals.css` | Global styles & Tailwind directives |
| `components/ScheduleGrid.tsx` | Weekly grid + navigation (client) |
| `components/ShiftCell.tsx` | Shift dropdown selector (client) |
| `app/api/employees/route.ts` | Employee list API |
| `app/api/schedule/route.ts` | Schedule CRUD API |
| `lib/db.ts` | Database layer (sql.js/Postgres) |
| `lib/utils.ts` | Utilities (date formatting, shift info) |
| `types/index.ts` | TypeScript interfaces |
| `package.json` | Dependencies (no native modules) |
| `tsconfig.json` | TypeScript + Next.js config |
| `tailwind.config.ts` | Tailwind theme customization |

## Build & Deployment

### Local Build
```bash
npm run build
```

Produces optimized bundle in `.next/` directory. Build includes:
- Static HTML generation for non-API routes
- Dynamic API routes (marked with `export const dynamic = 'force-dynamic'`)
- TypeScript compilation
- CSS optimization

### Vercel Deployment (Recommended)
```bash
# Vercel detects Next.js automatically
vercel deploy
```

Environment variables:
- Set `DATABASE_URL` in Vercel dashboard to use Neon Postgres
- Leave unset to use SQLite (creates `data/` directory)

### Other Platforms
The app runs on any Node.js host that supports Next.js:
- Heroku
- Railway
- Fly.io
- Self-hosted Node.js

## Development Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # TypeScript & ESLint check
```

## Known Limitations

1. **SQLite Persistence**: Data stored in `data/schedule.db.json` (JSON-serialized uint8array). Not suitable for highly concurrent access.
2. **Single Process**: Works on single instance. Multi-instance deployments should use Neon Postgres.
3. **No Authentication**: Anyone with access can modify schedules. Add auth layer in production.

## Future Enhancements

Potential additions:
- User authentication & role-based access
- Email notifications for shift changes
- Shift swap requests between employees
- Schedule conflict detection
- Export to calendar (iCal format)
- Mobile app / PWA
- Schedule templates & recurring patterns

## Support

For issues or questions, refer to:
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- sql.js: https://sql.js.org/
- Neon Docs: https://neon.com/docs

## License

All rights reserved to Fabulosa Books.
