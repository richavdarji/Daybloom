# DayBloom PWA — beginner setup

## Files
- `index.html`: the complete DayBloom app (HTML, styling and JavaScript).
- `manifest.webmanifest`: app name, colours, launch mode and icons.
- `sw.js`: caches only the static app shell for offline opening.
- `icons/`: home-screen icons for Android and iPhone.

## Important data note
DayBloom uses the browser's localStorage key `daybloom-v1`, matching the key used by the earlier preview version. The exact internal schema of that preview is not guaranteed to match every historical build. This app keeps unknown top-level fields when it loads data and has JSON export/import. Export a backup from the old preview and keep it private. Import only a backup you trust. Import asks for confirmation before replacing current data.

The app stores data only in the browser on the device. It does not sync between devices. Private information is not sent to a server. Offline mode caches the static app shell only; the app's data remains in browser storage, not in the service-worker cache.

## Test locally
A service worker requires HTTPS or localhost. Do not open `index.html` by double-clicking it.
1. Install a simple local web server, or use the GitHub Pages instructions below.
2. If Python 3 is already installed, open a terminal in this folder and run: `python3 -m http.server 8000`
3. Visit `http://localhost:8000` in your browser.
4. Test tasks, habits, notes, goals, export and import.
5. In browser developer tools, inspect Application > Service Workers and Cache Storage. Test offline after the first successful online load.

## Free GitHub Pages hosting
1. Create/sign in to GitHub.
2. Create a **public** repository named `daybloom`. Do not upload personal backups or secrets.
3. Upload the contents of this folder (not the outer folder itself) to the repository root. Keep the `icons` folder.
4. Open repository Settings > Pages.
5. Under Build and deployment, choose Deploy from a branch, select `main` and `/(root)`, then Save.
6. Wait for the deployment to finish. The address will be `https://YOUR-USERNAME.github.io/daybloom/`.
7. Open the HTTPS address and test. GitHub Pages can take a few minutes to publish changes.

## Install
- iPhone: open the published address in Safari > Share > Add to Home Screen. If offered, enable Open as Web App.
- Android: open the published address in Chrome > menu > Install app (or Add to Home screen).

## Offline and update behaviour
The service worker caches the static app shell and icons only. It does not cache API calls or private data. A new service worker waits until you press Install update in Profile & settings. Save edits before accepting an update. Updating the app does not clear localStorage.

## Limitations
This is a local-only static app. There is no account, cloud backup or automatic cross-device sync. Keep JSON backups. Browser/site data deletion can remove the local copy. The daily planning assistant is rule-based demo mode, not a connected generative AI service.
