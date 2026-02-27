# AGENTS.md

## Repository Overview

This is Aki's (@sirakinb) personal brand repository. It contains:

1. **Content Hub** (`content-hub/`) — A React web app for organizing and scheduling content
2. **Content files** — Markdown video scripts, strategy docs, analytics, and session notes
3. **Transcripts** (`transcripts/`) — DOCX meeting and coaching call transcripts

### Repository Structure

- `content-hub/` — React + Vite + Tailwind CSS content management app
- `SCRIPTS*.md` — TikTok/Reels video scripts organized by topic
- `CONTENT_IDEAS.md` — Content ideas extracted from meeting transcripts
- `HOOK_GUIDE.md` — Guide for crafting video hooks
- `TIKTOK_ANALYSIS.md` — TikTok performance analytics
- `vibe-code-pioneers/` — Session notes for the "Vibe Code Pioneers" community/course
- `transcripts/batch-1/` — DOCX meeting and coaching call transcripts

## Cursor Cloud specific instructions

### Content Hub App (`content-hub/`)

- **Dev server:** `npm run dev` (Vite on port 5173)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint)
- **Tech stack:** React 19, Vite 7, Tailwind CSS 4, React Router, Lucide icons, date-fns
- **Data persistence:** localStorage (no backend/database required)
- The update script runs `npm install` in `content-hub/` to refresh dependencies.
