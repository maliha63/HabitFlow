# HabitFlow 🌱

A smart web app / PWA that helps you track habits, maintain streaks, and build a consistent daily routine.

<img width="1366" height="768" alt="HabitFlow Spalsh screen" src="https://github.com/user-attachments/assets/60f6ca04-b36b-4604-b876-40cdec5a29c7" />

<img src="https://github.com/user-attachments/assets/e5d46aa5-73fd-485b-bf89-dfbf79d6c731"
     alt="Mobile Mockup"
     width="300" />



![HabitFlow Mobile Preview](https://github.com/user-attachments/assets/ae8db635-254a-46f3-85ce-533cd0654852)

---

## Table of Contents

* [Demo](#demo)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [Scripts](#scripts)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Demo

Live version: [HabitFlow](https://habit-flow.vercel.app/)

---

## Features

* **Daily Habit Tracking**: Add, complete, edit and remove habits
* **Streak System**: Auto-calculated streaks based on daily activity
* **Progress Charts**: Visual graphs using Recharts
* **Dark Mode**: Smooth theme switching with persistence
* **PWA Ready**: Installable app with manifest + service worker
* **Local Storage**: Saves habits and streaks automatically
* **Responsive UI**: Works perfectly on mobile and desktop
* **Favicon**: Clean app icon for browser and PWA

---

## Tech Stack

* **Vite** — Modern build tool
* **React / TypeScript** — User interface
* **Recharts** — Progress visualization
* **Tailwind CSS** — Styling
* **Lucide Icons** — Icons
* **Vercel** — Deployment

---

## Project Structure

```
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icon.svg             # App icon / favicon
├── src/
│   ├── main.tsx             # Entry point
│   ├── App.tsx              # Main App component
│   ├── index.css            # Global styles
│   ├── components/          # Reusable components
│   ├── screens/             # Screens (Today, Stats, etc.)
│   ├── context/             # Habit context provider
│   └── utils/               # Helper functions
└── .env.local               # Environment variables (if needed)
```

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/maliha63/habitflow.git
cd habitflow
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

---

## Usage

1. Open the app in your browser (`http://localhost:5173`)
2. Add your daily habits
3. Mark habits as done
4. Track streaks and view charts
5. Switch themes when needed
6. Install as a PWA if desired

---

## Scripts

* `npm run dev` — Start development server
* `npm run build` — Build production-ready app
* `npm run preview` — Preview production build

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make changes and test locally
4. Commit (`git commit -m "Add feature"`)
5. Push (`git push origin feature/my-feature`)
6. Open a Pull Request

**Tips:**

* Follow existing code style
* Test changes before submitting
* Document new features / changes in the README

---

## License

This project is licensed under the MIT License.

---

## Contact

* **Author**: Maliha Bathool C — [malihabathoolc@gmail.com](mailto:malihabathoolc@gmail.com)
* **GitHub**: [https://github.com/maliha63](https://github.com/maliha63)
* **Live App**: [https://habit-flow.vercel.app/](https://habit-flow-rust.vercel.app/)

---

Built with ❤️ using Vite, React, and TypeScript
