<p align="center">
  <img src="assets/logo.png" alt="SunkCost" width="80">
</p>

<h1 align="center">SunkCost</h1>

<p align="center">
  A screen time tracker that shows you what you're actually spending.
</p>

<p align="center">
  <a href="https://github.com/colingalbraith/SunkCost/releases">
    <img src="https://img.shields.io/github/v/release/colingalbraith/SunkCost?style=flat-square" alt="Release">
  </a>
  <a href="https://github.com/colingalbraith/SunkCost/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/colingalbraith/SunkCost/issues">
    <img src="https://img.shields.io/github/issues/colingalbraith/SunkCost?style=flat-square" alt="Issues">
  </a>
</p>

<p align="center">
  <img src="assets/demo.webp" alt="SunkCost Demo" width="350">
</p>

---

## About

SunkCost is a minimalist desktop app that automatically tracks how much time you spend on your computer. Unlike other screen time apps, it doesn't gamify the experience or reward you with achievements—it simply shows you the data.

The app calculates what percentage of your remaining life you've spent, based on your birth year and life expectancy. It's designed to provide perspective, not judgment.

**Key Features:**
- Automatic tracking when the app is open
- Background tracking (continues when minimized)
- 12-week activity heatmap
- Session history with detailed statistics
- 100% local—no accounts, no cloud, no data collection

---

## Screenshots

<p align="center">
  <img src="assets/screenshot-track.png" alt="Tracking" width="280">
  <img src="assets/screenshot-dashboard.png" alt="Dashboard" width="280">
  <img src="assets/screenshot-history.png" alt="History" width="280">
</p>

---

## Installation

### Download

Download the latest release for macOS from the [Releases](https://github.com/colingalbraith/SunkCost/releases) page.

- **DMG installer** — Standard macOS installer
- **ZIP archive** — Portable version

### Build from Source

```bash
git clone https://github.com/colingalbraith/SunkCost.git
cd SunkCost/app
npm install
npm run electron:build
```

The built app will be in `app/release/`.

---

## Development

```bash
# Install dependencies
cd app && npm install

# Run development server
npm run dev

# Run Electron in development
npm run electron:dev

# Build for production
npm run electron:build
```

### Tech Stack

- React 19
- TypeScript
- Electron
- Vite
- Recharts

---

## Contributing

Contributions are welcome! Here are some ways you can help:

- **Report bugs** — Open an issue describing the problem
- **Suggest features** — Share ideas for improvements
- **Submit PRs** — Fix bugs or implement new features
- **Improve docs** — Help make the documentation clearer

### Roadmap Ideas

- [ ] Windows and Linux builds
- [ ] System tray icon with quick stats
- [ ] Export data to CSV/JSON
- [ ] Daily/weekly usage goals
- [ ] Idle detection
- [ ] App-specific tracking

If you'd like to work on any of these, feel free to open an issue to discuss your approach.

---

## Privacy

SunkCost stores all data locally on your device. There are no accounts, no analytics, and no network requests. Your data never leaves your computer.

---

## License

[MIT](LICENSE) © Colin Galbraith

---

<p align="center">
  <sub>Built with the uncomfortable truth in mind.</sub>
</p>
