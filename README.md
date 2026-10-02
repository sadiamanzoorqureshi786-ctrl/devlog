# /dev/log — Notes from a Programmer's Desk

A single-page developer blog/portfolio with three switchable themes (warm dark, paper light, phosphor cyber), a typewriter hero, hover-raise cards, copy-flash code blocks, a reading progress bar, and live GitHub counters.

**No build step. No dependencies to install.** Tailwind, fonts, and Font Awesome load from CDNs.

## Run locally

Open `index.html` in your browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
Your site will be live at `https://<your-username>.github.io/<your-repo>/`.

## Structure

```
devlog/
├── index.html      # page markup
├── css/style.css   # themes, animations, components
├── js/main.js      # typewriter, theme toggle, copy buttons, GitHub stats
├── README.md
├── LICENSE
└── .gitignore
```

## Customize

- **Your name / text:** edit `index.html` (search for "Alex Rivera").
- **Typewriter lines:** `greetings` array in `js/main.js`.
- **GitHub counters:** change the repo URL in `index.html` (`#ghPill`) and in `loadGitHubStats()` in `js/main.js`.
- **Colors:** edit the CSS variables at the top of `css/style.css`.
- **Shortcut:** press `T` to cycle themes.

## License

MIT
