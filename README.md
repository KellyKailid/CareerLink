# CareerLink

A job posting and experience sharing platform built with React and JavaScript.

## Features

- **Job Listings**: Browse and search for job opportunities
- **Experience Sharing**: Share and discover career experiences from others
- **Save for Later**: Save jobs and experiences to review later
- **Post Content**: Add your own job listings or experiences (requires login)
- **Filtering**: Filter jobs by employment type, job type, location, and tech stack
- **Search**: Search jobs and experiences by title, company, skills, etc.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
CareerLink/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── card.jsx
│   │   │   ├── checkbox.jsx
│   │   │   ├── label.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── select.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── utils.js
│   │   ├── AddExperiencePage.jsx
│   │   ├── AddJobsPage.jsx
│   │   ├── ExperienceCard.jsx
│   │   ├── ExperienceCardGrid.jsx
│   │   ├── ExperienceDetailModal.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── JobCard.jsx
│   │   ├── JobCardGrid.jsx
│   │   ├── JobDetailModal.jsx
│   │   ├── LoginModal.jsx
│   │   ├── PostExperienceForm.jsx
│   │   └── PostJobForm.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## License

MIT

