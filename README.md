<p align="center">
  <img src="https://github.com/colingalbraith/SunkCost/blob/main/SunkCostLogo-nobackground.png?raw=true" alt="SunkCost" width="480">
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
  
https://github.com/user-attachments/assets/1dbcc0b2-8080-455e-b2b7-1cf3c8e513d4

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

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/490e2793-0316-40f4-8cb0-73bf60442177" width="420" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/87fe6f67-056a-46a3-bc6c-4848e9e7ff1f" width="420" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5cbc1be6-99e3-48e6-97ac-4554e422a9b6" width="420" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8f7f92ed-e124-49d6-bf3c-6e3b4f95e37f" width="420" />
    </td>
  </tr>
</table>


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
