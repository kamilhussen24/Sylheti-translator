# Sylheti Words — Community Translator & Word Book

A community-driven platform for preserving and bridging the **Sylheti regional dialect** and **standard Bengali**. Users contribute word pairs, and together we build a growing linguistic database that anyone can search and use.

[![Live Website](https://img.shields.io/badge/Live-sylheti.kamildex.com-4361ee?style=flat-square)](https://sylheti.kamildex.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## What Is This?

This is **not** a traditional AI translator. Machine learning models are not trained on Sylheti, and building one requires a large dataset that doesn't exist yet.

Instead, this project takes a community-first approach:

1. **You submit** a Sylheti word and its Bengali equivalent
2. **We store it** in a shared database
3. **Everyone searches** that database when they need a translation
4. Over time, the database grows into a proper linguistic resource that could eventually be used to train a real Sylheti language model

> Every word pair you contribute directly improves results for the next person who searches.

---

## Live Demo

**[https://sylheti.kamildex.com](https://sylheti.kamildex.com)**

Also available as an **Android app** on Google Play.

---

## Screenshot

![Website Screenshot](https://raw.githubusercontent.com/kamilhussen24/sylheti-translator/refs/heads/main/image/all-devices-black.png)

---

## Features

- **Word-by-word translation** — searches the community database for each word in a sentence
- **Vote system** — the most upvoted translation for a word appears first
- **Submit new words** — add Sylheti ↔ Bengali pairs directly from the translator page
- **Correction system** — flag a wrong result and suggest the correct one
- **Sylheti Nagri script** — dedicated converter between Bengali and the historical Sylheti Nagri script
- **Blog** — articles about Sylheti language, history, and culture
- **Works as an Android app** — built with the Median framework (WebView wrapper)

---

## How the Translation Works

```
User types a sentence
        ↓
Each word is looked up individually in Firebase
        ↓
All matching translations are retrieved
        ↓
Results are ranked by vote count (most voted = shown first)
        ↓
Words with no match are shown as-is
```

There is no AI involved. If a word is missing from the database, it won't translate — which is exactly why contributions matter.

---

## How to Contribute Words

You don't need to touch any code. Just visit the website:

1. Go to **[sylheti.kamildex.com](https://sylheti.kamildex.com)**
2. Scroll down to the input boxes below the translator
3. Enter the Sylheti word in the **Sylheti box**
4. Enter its Bengali equivalent in the **Bengali box**
5. Submit — it's instantly available for everyone

**Rules for good submissions:**
- Both boxes must have the same number of words
- No English characters
- No punctuation or special characters (`,` `-` `!` `।` `?`)
- Submit one word at a time, including variations (e.g., submit `ফুয়া` and `ফুয়ার` as separate entries)

See the [How to Add](https://sylheti.kamildex.com/how-to-add) page for examples with screenshots.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Database | Firebase Realtime Database (v8 compat SDK) |
| Hosting | Vercel (with serverless API routes) |
| Analytics | Google Analytics 4 (gtag) |
| Android App | Median framework (WebView wrapper) |
| Nagri Font | Surma.ttf (Sylheti Nagri Unicode) |
| Blog API | GitHub API via Vercel serverless functions |

---

## Project Structure

```
sylheti-translator/
│
├── index.html                       # Main translator page
├── about.html                       # About the project
├── contact.html                     # Contact page
├── how-to-add.html                  # Guide for submitting words
├── privacy-policy.html              # Privacy policy
├── 404.html                         # Custom 404 page
│
├── sylheti-nagri-to-bangla.html     # Sylheti Nagri → Bengali converter
├── bangla-to-sylheti-nagri.html     # Bengali → Sylheti Nagri converter
│
├── blog/
│   ├── index.html                   # Blog listing (loads post list from GitHub API)
│   ├── sylheti-vasha-popular-word.html
│   ├── barlekha-moulvibazar-tour-spot.html
│   └── sylheti-history-popularity-prodcast.html
│
├── assets/
│   ├── css/
│   │   ├── styles.css               # Global styles (shared across all pages)
│   │   └── app.css                  # Translator-specific styles
│   ├── js/
│   │   ├── app.js                   # Core translator logic (Firebase, votes, corrections)
│   │   ├── utilities.js             # Shared utilities (copy, clear text)
│   │   ├── bangla-nagri.js          # Bengali → Sylheti Nagri glyph converter
│   │   └── nagri-bangla.js          # Sylheti Nagri → Bengali glyph converter
│   ├── loader.js                    # Page loader animation
│   └── analytics-loader.js          # GA4 analytics initialization
│
├── api/
│   ├── posts.js                     # Serverless: lists blog HTML files from GitHub
│   └── commits.js                   # Serverless: fetches last commit date per blog post
│
├── .github/
│   ├── workflows/                   # GitHub Actions (sitemap generation, etc.)
│   └── scripts/
│       └── generate_sitemap.py      # Auto-generates sitemap.xml from HTML files
│
├── image/                           # Favicons, screenshots, og images
├── sitemap.xml                      # Auto-generated — do not edit manually
├── robots.txt
├── vercel.json                      # URL rewrites (removes .html extensions)
└── site.webmanifest                 # PWA manifest
```

---

## Developer Setup

No build step is required. This is a fully static site.

```bash
git clone https://github.com/kamilhussen24/sylheti-translator.git
cd sylheti-translator
```

Serve it locally:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

> **Note:** Firebase reads work from any origin in development. The blog API routes (`/api/posts`, `/api/commits`) require the Vercel environment and won't work from a plain local server.

---

## Sitemap Generation

The sitemap is automatically regenerated by a GitHub Actions workflow on every push to `main`.

To run it manually:

```bash
python .github/scripts/generate_sitemap.py
```

The script scans all public `.html` files, skips internal directories (`assets`, `api`, `image`, etc.), assigns priorities based on page type (homepage → 1.0, blog index → 0.9, blog posts → 0.7, other pages → 0.8), and writes `sitemap.xml` with last-modified dates pulled from Git history.

---

## Roadmap

- [x] Community word submission
- [x] Vote-based ranking
- [x] Correction system
- [x] Sylheti Nagri script converter
- [x] Android app (Median WebView)
- [x] Blog section
- [ ] Word history and edit log
- [ ] User accounts
- [ ] Sylheti language model training (when dataset is large enough)

---

## License

This project is open source under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## Contact

Developed by **[Kamil Hussen](https://kamilhussen24.github.io/)**

- Email: kamil.chat24@icloud.com
- Facebook: [facebook.com/kamilhussen24](https://facebook.com/kamilhussen24)
- Twitter/X: [@kamilhussen24](https://x.com/kamilhussen24)
- Telegram: [t.me/kamilhussen24](https://t.me/kamilhussen24)
