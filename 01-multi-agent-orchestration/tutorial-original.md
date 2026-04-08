# Building an Online Scheduler for Fabulosa Books with Next.js and Neon

---

## Part 1: Welcome to Fabulosa Books

### A Bookstore with Heart

Walk into Fabulosa Books on any afternoon, and you'll know immediately why it matters. There's a particular kind of stillness here—not the kind of bookstore silence where people shuffle between shelves pretending to browse. This is a living space. The air is warm. Someone's always making coffee. A vintage armchair by the window holds a regular lost in a novel. Staff members greet people by name. There's jazz playing softly in the background, chosen with care.

Fabulosa Books is an LGBTQIA+ bookstore—and that identity shapes everything about it. The shelves hold an extensive selection of queer literature: fiction, poetry, essays, memoirs, history, theory, erotica, graphic novels, children's books for queer kids and queer families. But that's just the beginning. The store also carries ephemera—stickers, postcards, zines, posters—and beyond the LGBTQIA+ titles, there's a huge general collection, too: literary fiction, art books, local history, essays on food and politics and culture. It's the kind of place where you come in looking for one book and leave with three recommendations you didn't know you needed.

Located in San Francisco's Castro neighborhood, Fabulosa Books has become a community institution. People find rare books here. They attend readings and literary events. They come to talk to staff about what they should read next, and they listen because these aren't just employees—they're readers, writers, poets, librarians, curators. They have opinions and taste and genuine passion for literature. The store is a gathering place for writers, artists, students, longtime residents, and travelers passing through who stumbled into the right bookstore by luck.

This is a small, independent business in an age of mega-chains and algorithms. Every detail matters because the team that runs it chooses to make it matter.

### The Store and Its People

Alvin founded Fabulosa Books after managing the location for the previous owner. When the opportunity came to buy it, he did—because the store was worth preserving. Today, he runs it with the same care he brought to curation and customer connections, but now as the owner, making decisions about the store's future, carefully choosing the team that keeps it running.

The team is small but dedicated: eight people total, six who work regular shifts and two who come in on-call. It's the kind of crew where everyone knows the store's inventory by heart, where someone can recommend the perfect book for a customer they've never met, where shift changes feel like transitions between chapters rather than just clocking in and out.

They host readings and events. They put together staff pick displays that actually move inventory—customers trust their recommendations because their picks are personal and thoughtful, not algorithm-driven. Many of them have deep roots in San Francisco's literary and bookselling world. They're woven into the fabric of the neighborhood in ways that big bookstores can't replicate.

But managing all this—especially the scheduling—has been a mess.

### The Problem

For years, Fabulosa Books managed its schedule the old-fashioned way: a handwritten schedule pinned to the breakroom wall, updated with markers and corrections, sometimes with sticky notes covering up conflicting scribbles.

In theory, it worked. In practice? It was chaos.

- Employees couldn't check the schedule from home. They had to come in or call the store.
- Last-minute changes were a nightmare. An erased shift and a hastily scrawled note caused confusion and frustration.
- Swaps and requests were informal—a conversation in the break room, a text message, or a note left on the schedule itself.
- Nobody knew weeks in advance who was working what. Planning personal time was guesswork.
- Management spent an embarrassing amount of time just answering "When am I working?" questions.
- If the schedule got damaged or lost, there was no backup. It was pure anxiety.

The team realized the store needed a digital solution. Not something complicated or enterprise-grade—just something simple, fast, and accessible. Something they could all use on their phones or computers. Something that would work on day one without a weeks-long learning curve.

### What We'll Build

This is where modern web technology comes in. We're going to build a web-based scheduler specifically for Fabulosa Books—and in doing so, you'll learn how to build modern, scalable applications with Next.js, deploy them effortlessly with Vercel, and back them with a serverless database on Neon.

Billy, the newest member of the team and a struggling writer with a passion for literary fiction, volunteered to build this. He wanted to contribute to the bookstore beyond just shelving and staffing shifts, and he saw an opportunity to solve a real problem with code. This tutorial is the result.

**The Stack:**

- **Frontend:** A clean, responsive web interface built with React
- **Backend:** Next.js API routes for managing employees, shifts, and assignments
- **Database:** Neon (serverless Postgres) to store all data
- **Hosting:** Vercel for zero-friction deployments and automatic scaling

**The Schedule:**

The store hours are fixed: 10am–8pm daily (10am–9pm on Saturdays). Shifts are divided into three slots per day:

- **Opening Shift:** 10am–4pm
- **Mid Shift:** 12pm–6pm
- **Closing Shift:** 2pm–8pm (or 2pm–9pm Saturdays)

Each shift gets assigned to one employee. Everyone can view the schedule from anywhere. The manager can easily create, update, or swap shifts. And the whole thing is mobile-friendly—perfect for checking your shift while grabbing coffee.

By the end of these tutorials, you'll have a fully functional scheduling app that the team at Fabulosa Books can use starting tomorrow.

Ready to dive in? Let's go.

---

## Part 2: From Paper Schedule to Web App

### What Is a Web App?

Let's start with a simple question: what exactly is a web app?

You've probably used web apps without thinking about it. Google Docs. Your online banking website. Gmail. Spotify on the web. These aren't regular websites—they're applications. You open them in your browser, and you can click buttons, type things, save information, and see changes happen instantly.

Here's the key difference: a regular website shows you information. A web app lets you *do* things—and those things actually matter. When you edit a Google Doc, your changes are saved. When you transfer money in your bank app, the transfer actually happens. When you add a song to a Spotify playlist, it stays added.

You might be wondering: isn't that just a regular app on my phone? It looks similar, doesn't it? The difference is about installation and access. A phone app sits on your phone, and you have to install it first. A web app? You just open a link in your browser—on your phone, your laptop, your work computer, or any device with an internet connection. No installation. No waiting for updates. You always see the latest version. And because it's the same app everywhere, everything stays in sync: you open the schedule on your phone, you open it on your laptop, and you see the exact same information.

That's what we're building for Fabulosa Books: a web app for scheduling. Not a paper schedule you have to walk to the breakroom to see. Not a complicated system that needs an IT expert to maintain. Just a link everyone can click, on whatever device they're holding.

### Why a Web App for Our Schedule?

Remember the problems with the paper schedule on Fabulosa's breakroom wall? A web app fixes every single one.

Right now, if you want to know your schedule, you have to come to the store or call. With a web app, you check it from home on your phone. While you're having your morning coffee, you can see who's working today. You can plan around your shift. You can check in on your days off without wondering whether you're needed.

Last-minute changes? Right now, that means erasing part of the paper schedule and writing something new—and half the team never sees it. With a web app, Alvin or Melissa updates the schedule once, and it's live for everyone immediately. No more miscommunication. No more showing up for a shift that got canceled three hours ago.

Shift swaps and requests? With the paper schedule, it's a conversation in the break room or a text message—and nobody really knows who said yes to what. With a web app, requests are recorded. Everyone can see the current state. Disputes disappear.

Planning ahead? With the paper schedule, you don't know what's happening next week or next month until it's posted. With a web app, you can see two months of scheduling in advance. You can request time off. You can actually plan your life.

And here's the thing: the store doesn't need an IT department. Billy's building this, and everyone can start using it tomorrow. No complexity. No confusion. Just a working tool that makes everyone's life easier.

### How We Got Here (You Can Skip This)

You do not need to read this section. Seriously. If you just want to get to building the scheduler, skip ahead to "Our Tools" below and you won't miss a thing. But if you're the kind of person who likes to know why things are the way they are—why we're using these particular tools and not others—this is a quick detour through how web development got to where it is today.

For most of the internet's history, JavaScript was a browser-only language. It made buttons clickable, menus drop down, forms validate. In 2009, someone figured out how to run JavaScript outside the browser—on a server, handling real work. That opened up possibilities. Suddenly, developers could write the same language for both the part of the app that users see (the browser) and the part that runs behind the scenes (the server). This simplified things enormously.

Over the next decade, frameworks emerged to make building these web apps even easier. Instead of stitching together a dozen different tools, frameworks like Next.js said, "Follow our conventions, and we'll handle all the plumbing for you." That's where we are today. The tools are powerful, the setup is simple, and the result is fast, reliable web apps. That's why we're using them for Fabulosa Books.

### Our Tools: Next.js, Vercel, and Neon

The schedule app we're building uses three key tools. Let's talk about what each one does.

**Next.js: The Framework**

Next.js is the toolkit we'll use to build the schedule app. Think of it as a set of instructions and conveniences that makes building web apps faster and easier.

In a web app, there are two sides: the side users see in their browser (pretty buttons, forms, the schedule display itself) and the side that runs behind the scenes (storing the schedule in a database, handling updates, making sure everyone sees the latest version). Next.js handles both. When you write code with Next.js, you're writing the entire application in one place. It figures out which parts run in the browser and which parts run on the server. You don't have to think about it.

**Vercel: Where Your App Lives**

Vercel is where the app will live on the internet. It's a hosting platform—think of it as a house where your web app rents space.

Instead of buying a server and keeping it running twenty-four hours a day in someone's basement (which would be expensive and complicated), Vercel hosts the app for you. When someone opens the schedule on their phone, Vercel delivers it. When Alvin or Melissa makes a change, Vercel processes it. When nobody's using the app, nothing's running.

Here's the best part: for a small app like the Fabulosa Books scheduler, Vercel is free. No monthly bill. No complications. You push your code, and it's live. That's the entire process.

**Neon: The Database**

Neon is where the actual schedule data lives. It's the database—a secure, reliable place to store information.

Neon uses a tool called Postgres, which is one of the most trusted ways to store data in the world. Thousands of companies use it. Universities use it. Banks use it. It's reliable and proven.

Why Neon specifically? Because Neon is "serverless," which just means we don't have to manage anything. We don't have to keep a computer running to store the data. Neon handles that. When someone checks the schedule, the database wakes up, serves the information, and goes back to sleep. You only pay for what you use. For a bookstore schedule, that's nearly free.

### Why This Combo for Fabulosa?

These three tools work together beautifully, and they're the right choice for Fabulosa Books for one simple reason: they let us build something that actually works without needing a team of specialists.

Billy can build this alone. Everyone at the store can start using it immediately. There's no complicated setup, no ongoing IT work, and no mysterious bills every month. It's simple, it's reliable, and it's affordable. That's exactly what Fabulosa Books needs.

Let's build it.

---

## Part 3: Setting Up Shop

### Before We Write a Single Line of Code

Building a web app is a bit like opening a bookstore. Before you arrange the shelves or order inventory, you need a space. You need keys. You need a plan for how things will be organized.

In web development, that space is your "development environment"—the set of tools and accounts that let you write code, test it, and eventually put it online for everyone to see. This part walks you through setting all of that up. It's the least glamorous part of the process, but it's also the part that makes everything else possible.

If you've never done anything like this before, don't worry. We're going step by step, and none of it is as intimidating as it looks.

### What You'll Need

You need three things on your computer before we start:

**Node.js** is the engine that runs JavaScript outside of a web browser. Remember how we talked about JavaScript being a browser-only language until 2009? Node.js is what changed that. When we write our Next.js app, Node.js is what actually runs it on your machine while you're building and testing.

To install it, go to [nodejs.org](https://nodejs.org) and download the version labeled "LTS" (Long Term Support). That's the stable, well-tested version. Install it like any other program. When it's done, open your terminal—that's Terminal on Mac, or Command Prompt on Windows—and type `node --version`. If you see a version number, you're good.

**A code editor** is where you'll actually write and edit files. You can technically use Notepad, but that's like writing a novel in crayon. We recommend Visual Studio Code (VS Code)—it's free, it's what most developers use, and it has helpful features like color-coding your code so you can see what's what. Download it from [code.visualstudio.com](https://code.visualstudio.com).

**A GitHub account** is how we'll store our code online and connect it to Vercel for deployment. GitHub is like a cloud backup for code, but smarter—it tracks every change you make, so you can always go back if something breaks. It's free. Sign up at [github.com](https://github.com).

### Git: Your Safety Net

Before we go further, let's talk about Git—because it's going to come up a lot, and it's one of those things that sounds complicated but is actually just common sense once you understand what it does.

Git is a tool that tracks changes to your files. That's it. Every time you make a meaningful change to your code, you tell Git, "Hey, save this version." Git remembers. If you break something tomorrow, you can go back to today's version. If you want to try something experimental without risking your working code, Git lets you do that too.

Think of it like the "undo" button, but for your entire project, and it goes back as far as you need.

GitHub is where your Git history lives online. Your computer has a copy. GitHub has a copy. They stay in sync. If your laptop catches fire (knock on wood), your code is safe on GitHub. And when we connect GitHub to Vercel later, every time you push new code to GitHub, Vercel will automatically update your live website. That's the magic of this setup.

### Creating the Project

Open your terminal and navigate to where you want your project to live. Then run this command:

```bash
npx create-next-app@latest fabulosa-scheduler
```

This is like ordering a starter kit. `npx` runs a tool without installing it permanently. `create-next-app` is Next.js's official project generator. It'll ask you some questions:

- **Would you like to use TypeScript?** Yes. TypeScript is JavaScript with extra guardrails—it catches mistakes before they become bugs. Trust us on this one.
- **Would you like to use ESLint?** Yes. It's a grammar checker for your code.
- **Would you like to use Tailwind CSS?** Yes. Tailwind makes styling your app much easier than writing CSS from scratch.
- **Would you like to use `src/` directory?** No. Keeps things simpler.
- **Would you like to use App Router?** Yes. This is the modern way Next.js organizes pages.
- **Would you like to customize the default import alias?** No. The default is fine.

When it finishes, you'll have a folder called `fabulosa-scheduler` with everything you need to start building. Move into it:

```bash
cd fabulosa-scheduler
```

And start the development server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`. You should see a Next.js welcome page. Congratulations—your app exists. It doesn't do anything useful yet, but it exists. That's step one.

### Putting It on GitHub

Now let's get this code backed up and online. In your terminal (stop the dev server first with Ctrl+C), run:

```bash
git init
git add -A
git commit -m "Initial commit: Fabulosa Books scheduler"
```

That creates a Git history and saves your first snapshot. Now go to [github.com](https://github.com), click the "+" button in the top-right corner, and choose "New repository." Name it `fabulosa-scheduler`, leave everything else as default, and click "Create repository."

GitHub will show you some commands. Run the ones that look like this:

```bash
git remote add origin https://github.com/YOUR-USERNAME/fabulosa-scheduler.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username. If GitHub asks for authentication, you may need to set up an SSH key or a personal access token—GitHub's documentation walks you through it.

Once you've pushed, refresh your GitHub page. Your code is there, safe and sound.

### Connecting to Vercel

This is the part where everything clicks together.

Go to [vercel.com](https://vercel.com) and sign up with your GitHub account. Vercel will ask permission to access your repositories—that's normal and expected.

Once you're in, click "Add New Project." Vercel will show you a list of your GitHub repositories. Find `fabulosa-scheduler` and click "Import."

Vercel will detect that it's a Next.js project and configure everything automatically. You don't need to change any settings. Just click "Deploy."

Wait about a minute. Vercel is building your app—installing dependencies, compiling your code, and putting it on the internet. When it's done, you'll see a celebration screen with confetti and a link to your live site. Click it.

That Next.js welcome page you saw on localhost? It's now live on the internet. Anyone with the link can see it. You just deployed a web application.

Here's the beautiful part: from now on, every time you push code to GitHub, Vercel automatically rebuilds and redeploys your app. Write code, push it, and it's live. No manual deployment. No server management. No FTP uploads. Just push and it's there.

### Adding the Database

The last piece of our setup is Neon—where the schedule data will actually live.

From your Vercel project dashboard, go to the "Storage" tab. Click "Create Database" and choose Neon. Vercel will walk you through creating a free Postgres database. When it asks you to connect it to your project, make sure all three environments are selected (Development, Preview, and Production).

The important thing that happens here is that Vercel creates an environment variable called `DATABASE_URL`. This is like a secret address that tells your app where to find its database. You don't need to copy it or paste it anywhere—Vercel handles that connection automatically when your app is deployed.

For local development on your own computer, the app uses a lightweight stand-in database so you don't need the internet connection. When it's running on Vercel, it uses the real Neon database. The code handles this switch automatically—you don't have to think about it.

### What We've Done

Take a moment to appreciate what just happened. You now have:

- A Next.js project on your computer where you can write and test code
- A GitHub repository backing up every change you make
- A Vercel deployment that automatically publishes your app whenever you push code
- A Neon database ready to store schedule data

That's a complete, professional development pipeline. Companies with dedicated engineering teams use this exact setup. You just built it in twenty minutes.

The scaffolding is up. Now let's build the actual scheduler.

---

## Part 4: Building the Schedule

### The Plan

We're going to build the scheduler in layers. First, we'll set up the data types—defining what an "employee" and a "schedule entry" actually look like in code. Then we'll build the database layer that stores and retrieves that data. Then the API routes that let the browser talk to the database. And finally, the visual interface that you and the rest of the team will actually use.

It sounds like a lot, but each piece is small and understandable on its own. By the end of this part, you'll have a working scheduler that looks and feels like the real thing—because it is the real thing.

### Defining the Data

Before we write any logic, we need to tell our app what kind of data it's working with. Create a folder called `types` in your project root, and inside it, a file called `index.ts`:

```typescript
// types/index.ts

export interface Employee {
  id: number
  name: string
  is_on_call: number
}

export interface ScheduleEntry {
  id: number
  day_of_week: number
  shift_type: string
  employee_name: string | null
  week_start_date: string
}

export interface ShiftSlot {
  dayOfWeek: number
  shiftType: string
  employeeName: string | null
}
```

This is TypeScript doing its thing. We're saying: an `Employee` has an id, a name, and a flag for whether they're on-call. A `ScheduleEntry` records who's working which shift on which day of which week. The `string | null` part means the employee name can be empty—because sometimes a shift hasn't been assigned yet.

### The Utility Belt

Next, let's create some helper functions that we'll use throughout the app. These handle dates, days of the week, and shift definitions. Create a `lib` folder and add `utils.ts`:

```typescript
// lib/utils.ts

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
]

export const SHIFTS = [
  { type: 'opening', label: 'Opening', start: '10am', end: '4pm' },
  { type: 'mid', label: 'Mid', start: '12pm', end: '6pm' },
  { type: 'closing', label: 'Closing', start: '2pm', end: '8pm' },
]

export const SHIFTS_SATURDAY = [
  { type: 'opening', label: 'Opening', start: '10am', end: '4pm' },
  { type: 'mid', label: 'Mid', start: '12pm', end: '6pm' },
  { type: 'closing', label: 'Closing', start: '2pm', end: '9pm' },
]

export function getShiftsForDay(dayOfWeek: number) {
  return dayOfWeek === 6 ? SHIFTS_SATURDAY : SHIFTS
}

export function getWeekStartDate(date?: Date): string {
  const d = date ? new Date(date) : new Date()
  const day = d.getDay()
  const diff = d.getDate() - day
  const weekStart = new Date(d.setDate(diff))
  return weekStart.toISOString().split('T')[0]
}

export function getDateFromDayOfWeek(
  weekStart: string,
  dayOfWeek: number
): Date {
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayOfWeek)
  return date
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
```

Nothing dramatic here—just useful tools. `getWeekStartDate` figures out what Sunday starts the current week. `getShiftsForDay` returns the right shift times, accounting for Saturday's later closing. These are the kind of small, reliable functions that keep the rest of your code clean.

### The Database Layer

This is where things get interesting. We need our app to talk to a database—but we also want it to work on your local machine without needing an internet connection. So we're going to build a database layer that uses Neon (the real database) when the app is deployed on Vercel, and a lightweight local database when you're developing on your own computer.

Create `lib/db.ts`. This file is the longest in the project, but it breaks down into two halves: the Neon half and the local half.

The Neon half connects to your Postgres database using the `@neondatabase/serverless` package:

```typescript
import { neon } from '@neondatabase/serverless'

function getSQL() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}
```

The `process.env.DATABASE_URL` is that secret address Vercel set up for us. The `neon()` function gives us a way to run SQL queries against the database. SQL is the language databases speak—it's how you ask questions like "give me all the employees" or "update Marcus's shift on Tuesday."

The schema initialization creates our two tables—employees and schedule—and seeds the employee list:

```sql
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_on_call BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  shift_type TEXT NOT NULL,
  employee_name TEXT,
  week_start_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_start_date, day_of_week, shift_type)
);
```

That `UNIQUE` constraint on the schedule table is important—it means you can't accidentally assign two people to the same shift on the same day. The database itself enforces the rules.

The public API that the rest of the app uses is straightforward: `getAllEmployees()` returns the employee list, `getWeekSchedule(weekStart)` returns a week's worth of assignments, and `updateSchedule(...)` assigns or unassigns someone from a shift. Whether those functions talk to Neon or the local database depends on whether `DATABASE_URL` exists. The rest of the app doesn't know or care which one is being used. It just works.

### The API Routes

API routes are how the browser side of your app communicates with the database side. When someone clicks on the schedule, the browser sends a request to an API route, which talks to the database and sends back the answer.

Create `app/api/employees/route.ts`:

```typescript
// app/api/employees/route.ts

import { getAllEmployees } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const employees = await getAllEmployees()
    return NextResponse.json(
      employees.map((emp: any) => ({
        ...emp,
        is_on_call: Boolean(emp.is_on_call),
      }))
    )
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}
```

And `app/api/schedule/route.ts`:

```typescript
// app/api/schedule/route.ts

import { getWeekSchedule, updateSchedule } from '@/lib/db'
import { getWeekStartDate } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('weekStart') || getWeekStartDate()
    const schedule = await getWeekSchedule(weekStart)
    return NextResponse.json({ schedule, weekStart })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { weekStart, dayOfWeek, shiftType, employeeName } = body

    if (!weekStart || dayOfWeek === undefined || !shiftType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await updateSchedule(weekStart, dayOfWeek, shiftType, employeeName || null)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}
```

Notice the pattern: each route imports what it needs from the database layer, handles the request, and returns a response. The `GET` routes fetch data. The `PUT` route updates it. Errors are caught and returned as proper error responses instead of crashing the whole app. That `force-dynamic` export tells Next.js to always fetch fresh data instead of caching it—because a schedule that's even a few minutes stale is useless.

### The Interface: ScheduleGrid

Now for the part everyone actually sees. The schedule is a table—days of the week across the top, shifts down the side, and clickable cells where you assign employees.

Create `components/ScheduleGrid.tsx`. This component manages the weekly view and handles navigation between weeks:

```tsx
<div className="flex items-center justify-between
     bg-fab-dark text-white rounded-lg p-4">
  <button onClick={goToPreviousWeek}
    className="px-4 py-2 bg-fab-purple text-white rounded">
    ← Previous Week
  </button>
  <div className="text-center">
    <h2 className="text-xl font-semibold">
      Week of {formatDate(new Date(weekStart))}
    </h2>
  </div>
  <button onClick={goToNextWeek}
    className="px-4 py-2 bg-fab-purple text-white rounded">
    Next Week →
  </button>
</div>
```

Those `bg-fab-dark` and `bg-fab-purple` classes are our custom Fabulosa colors—the same orchid pinks, deep purples, and warm charcoals you see on fabulosabooks.com. We defined them in `tailwind.config.ts` so they're available everywhere in the app. The schedule should feel like Fabulosa, not like a generic corporate tool.

The table itself maps through the days and shifts, rendering a `ShiftCell` for each combination:

```tsx
{['opening', 'mid', 'closing'].map((shiftType) => (
  <tr key={shiftType}>
    <td className="p-4 font-semibold bg-fab-pink-light">
      {shiftType === 'opening' ? 'Opening (10am–4pm)'
        : shiftType === 'mid' ? 'Mid (12pm–6pm)'
        : 'Closing'}
    </td>
    {DAYS_OF_WEEK.map((_, dayIndex) => (
      <td key={dayIndex} className="p-2 text-center">
        <ShiftCell
          dayOfWeek={dayIndex}
          shiftType={shiftType}
          currentEmployee={getEmployeeForShift(dayIndex, shiftType)}
          employees={employees}
          onUpdate={handleShiftUpdate}
          isSaturday={dayIndex === 6}
        />
      </td>
    ))}
  </tr>
))}
```

Three rows, seven columns, twenty-one shift cells. Each one knows which day and which shift it represents, who's currently assigned, and what to do when someone clicks it.

### The Interface: ShiftCell

Each cell in the schedule grid is its own little component. When you click it, a dropdown appears showing all the employees. Pick one, and the schedule updates.

```tsx
const bgColor = currentEmployee
  ? currentEmployeeData?.is_on_call
    ? 'bg-fab-crimson text-white'
    : 'bg-fab-purple text-white'
  : 'bg-fab-pink-light text-fab-dark'
```

That's the color logic: purple for regular employees, crimson for on-call, and light pink for unassigned. At a glance, anyone looking at the schedule can see where the gaps are.

The dropdown groups employees into "Regular" and "On-Call" sections, making it easy to find the right person. When you select someone, the component sends the update to the API, the database saves it, and the grid refreshes—all in about half a second. The old paper schedule could never.

### The Fabulosa Look

One last thing: the colors. We didn't just pick random colors—we matched the actual fabulosabooks.com website. That orchid pink, the deep purple, the charcoal header. To set these up, we defined custom colors in `tailwind.config.ts`:

```typescript
colors: {
  'fab-pink': '#EFA8EE',
  'fab-dark': '#222222',
  'fab-purple': '#5040AE',
  'fab-crimson': '#8D2424',
  'fab-cream': '#FAF9F5',
  'fab-purple-light': '#6B5CE7',
  'fab-pink-light': '#F5C6F5',
  'fab-pink-deep': '#D580D4',
}
```

Tailwind CSS lets you use these anywhere in your app as class names: `bg-fab-pink`, `text-fab-purple`, `border-fab-crimson`. It's like having a paint palette that's always consistent. The scheduler doesn't just work like Fabulosa—it looks like Fabulosa.

### Run It

Start your dev server:

```bash
npm run dev
```

Open `http://localhost:3000`. You should see the Fabulosa Books header, a weekly schedule grid with navigation buttons, and twenty-one "Unassigned" cells waiting to be filled. Click any cell, pick an employee from the dropdown, and watch the schedule come to life.

Push it to GitHub, and Vercel deploys it automatically:

```bash
git add -A
git commit -m "Add schedule interface and database"
git push
```

Give it a minute, then visit your Vercel URL. The scheduler is live. Alvin can open it on his phone. Melissa can check it from home. Marcus can see next week's schedule while he's doing tarot readings. Joel can swap shifts without a sticky note. The paper schedule on the breakroom wall? It can finally retire.

### What's Next

You've built a functional, deployed web application backed by a real database. The Fabulosa Books team can start using it today. But there's more to do—authentication so only staff can edit the schedule, notifications for shift changes, the ability to request time off. Those are stories for future parts.

For now, go assign some shifts. The schedule isn't going to fill itself.

---

*Next up: adding authentication and user roles so only managers can edit the schedule.*
