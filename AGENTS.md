# RUNES — Agent Instructions

## Project Overview
Duolingo-style app for learning Elder Futhark runes. Spanish (Argentine voseo). Firebase Hosting + Auth + Firestore.

**Live:** https://runes-90d8b.web.app
**GitHub:** https://github.com/Ehr051/RUNES.git

## Quick Commands

```bash
# Deploy hosting
cd /Users/mac/Desktop/nova_runas_vikingas
firebase deploy --only hosting

# Verify JS syntax
node -c script.js

# Minify JS (after edits)
terser script.js -c -m -o script.min.js

# Check git status
git status
git add -A && git commit -m "type: description" && git push origin main
```

## Architecture

Single-page app, no build system, vanilla JS.

- `index.html` — 10 screens + 4 modals (all inline)
- `script.js` — all logic (~1900 lines)
- `script.min.js` — minified version (use this in HTML)
- `styles.css` — norse theme (~3000 lines)
- `sw.js` — service worker (v3, excludes Firestore APIs)
- `audio/` — 3 MP3 files (~25MB total)

**Firebase:** project `runes-90d8b`, compat mode (not modular SDK)
**Auth:** Google redirect + email/password
**Firestore:** `users` collection, `diarios` collection

## Key Conventions

- **Language:** Spanish with Argentine voseo ("tuteo" not "ustedeo")
- **App name:** RUNES (not "Nova Runas")
- **Premium:** first 3 lessons free, rest require Pro ($3.99 Gumroad)
- **Audio:** lazy-loaded, only after first user interaction (browser policy)
- **Script tag:** always reference `script.min.js` in HTML, not `script.js`

## Critical Files to Check Before Editing

1. `script.js` — RUNAS data (line 22-47), LECCIONES (line 95-169), SPREADS (line 50-92)
2. `index.html` — all screens are here, Firebase scripts at bottom (line 547-551)
3. `styles.css` — responsive breakpoints: 380px, 768px, 1024px, 1400px

## Known Gotchas

- Service worker MUST exclude `firestore.googleapis.com` or app breaks offline
- Audio files are 25MB total — don't add more without compressing
- Firebase uses compat mode (`firebase.initializeApp()`, not modular)
- `script.min.js` must be regenerated after every `script.js` edit
- Loading screen hidden at 400ms (not 800ms) — don't increase
- Auth init is deferred via `requestIdleCallback` — don't block initial render

## Exercise Types

`identificar-runa`, `significado-runa`, `clase-runa`, `verdadero-falso`, `multiple-choice`, `completar-frase`, `asociar-simbolo`, `ordenar`, `emparejar-runas`, `memoria-nordica`, `quiz-rapido`

## Deployment Flow

1. Edit `script.js`
2. Run `node -c script.js` (verify syntax)
3. Run `terser script.js -c -m -o script.min.js`
4. Run `firebase deploy --only hosting`
5. Test at https://runes-90d8b.web.app
