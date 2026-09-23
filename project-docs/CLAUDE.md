# Project: Interactive Quiz App

## Overview
A 15-question multiple-choice quiz web app for a company audience (under 1,000 expected participants). Collects participant name/office, tracks completion time, scores answers, and shows one of three result pages based on score bracket. Results are written to a Google Sheet.

Build this **incrementally**: propose the architecture and file structure first and wait for confirmation before writing implementation code. Then build one piece at a time in the order listed under "Build Order," with a working, manually-tested result at each step before moving to the next.

---

## Project reference files
This repo includes a `/project-docs` folder with supporting reference material for the build — read these alongside this doc, not instead of it:
- `/project-docs/CLAUDE.md` — this file
- `/project-docs/quiz-translations-EN-ES.xlsx` — all UI copy and question text in both languages, keyed by identifier (see "Translations source file" below)
- `/project-docs/trevo-design-tokens.tokens.json` — the design system's tokens (colors, typography, spacing, etc.) as structured data; use as the source of truth for token values alongside the Figma Design System links

---

## Localization

The quiz is available in **English and Spanish**, each as a **separate link** (e.g. `/en/...` and `/es/...` routes) — not a language switcher within one URL. Requirements:
- All screens (Home, Start, Quiz, Finish/Form, Result) need full text translations for both languages — content is provided in `/project-docs/quiz-translations-EN-ES.xlsx` (see below).
- Question data, answer options, and result-page copy are language-specific — structure the question dataset so it's keyed/duplicated per language rather than translated at render time.
- The submitted row to the Google Sheet should include which language version the participant used (e.g. add a `Language` column: `EN` / `ES`).
- Confirm whether both language versions share the same design layout (only text differs) or if there are any layout differences — assume text-only differences unless Figma shows otherwise.

### Translations source file
All UI copy for both languages lives in **`/project-docs/quiz-translations-EN-ES.xlsx`**, sheet `Translations`:
- **Column A (Key)** — the string's identifier, matching the naming used in this doc (e.g. `home.title`, `q1.question`, `result1.description`). Use these keys as the basis for the question/content data structure.
- **Column B (English)** and **Column C (Spanish)** — the actual copy per language.
- Rows under `result.common.*` are shared text identical across all 3 Result page variants (label, captions, note) — apply the same string to all three rather than duplicating per variant.
- Rows under `result1.* / result2.* / result3.*` are the score-specific Title and Description per Result page variant.
- Quiz question rows (`q1`–`q15`) contain question text and the 4 answer options only — **no correct-answer data**. Correct answers are defined separately below in "Quiz question answer key," not derived from the translations file.
- Company office dropdown options are individual rows (`finish.company_option.*`), intentionally left untranslated (English-only) — only the dropdown's placeholder text (`finish.company_dropdown_placeholder`) is translated.

---

## Functional Requirements

### Pages / Flow
1. **Home page** — intro content + hero video. Entry point, links/buttons through to the Start screen.
2. **Start screen** — short description of the rules, with a "Start" button. On click, start the timer and move to question 1.
3. **Quiz flow** — 15 multiple-choice questions, one at a time, single correct answer per question (single-select, not multi-select).
   - A **Timer block** is visible on every question screen, showing elapsed time since the Start button was pressed, formatted as `0m 0s` (e.g. `4m 34s`). It updates live as the user progresses through the quiz — not just a value captured at the end.
   - A **Submit answer button** is present on each question. It is **disabled by default** (not clickable, distinct visual style from its enabled state) until the participant selects an option. Once an option is selected, the button becomes enabled/clickable (switches to its active visual style).
   - On submitting the selected answer: lock the choice, immediately show whether it was correct or incorrect (highlight the correct answer if the user chose wrong). The **Submit button itself becomes the feedback element**: its text changes to a random message from the matching pool below, its background color changes accordingly, and it becomes non-clickable for the remainder of that question.
     - **Correct answer** — background `#66B11B`, button text picked randomly from: "Correct! 🥳" / "Just wow! 👏" / "Amazing! 🤩" / "Nailed it! 💅" / "You are on fire! 💃"
     - **Wrong answer** — background `#EBEEF5`, button text picked randomly from: "Now you know... 🤷🏻‍♀️" / "So close! 👀" / "We're always learning 🧐" / "Hmmm 🤔" / "Oops 🙈"
   - After the answer is submitted and feedback is shown, the screen **automatically advances to the next question after 2 seconds** — no manual "Next" click required.
   - Score +1 per correct answer, tracked in memory client-side (not sent per-question).
4. **Finish screen + Data form** — after question 15, stop the timer and compute total score and elapsed time. Show a form with:
   - Full Name (text input)
   - Company office (dropdown — options: Latvia, Moldova, India, Egypt, Uzbekistan, Colombia, The Philippines (Cebu), The Philippines (Manila), The UAE, Other)
   - Button: "Check Result"
   - On submit: send one POST request containing `{ fullName, companyOffice, score, completionTime, completionTimeSeconds, timestamp, language }` to the backend, where `completionTime` is a formatted string like `4m 34s` and `completionTimeSeconds` is the same duration as a raw integer (for future sorting/averaging). This is the only write to the data store — no partial/in-progress writes.
5. **Result page** — show one of three variants based on final score:
   - **1–7 points** — Title: "Curious Tourist" — Description: "Every great traveller starts somewhere. Keep exploring, discovering new places, and collecting adventures — next time, you might surprise yourself! ✈️"
   - **8–12 points** — Title: "World Explorer" — Description: "You definitely know your way around the world. Keep traveling, exploring, and discovering — there's always another adventure waiting! 🧭"
   - **13–15 points** — Title: "Travel Legend" — Description: "Wow! Your travel knowledge is impressive. Keep exploring the world and adding even more destinations to your list! 🌎"
   - Each result page variant includes two data blocks: **Completion Time** (the final elapsed time from the Timer, formatted as `0m 0s`, e.g. `4m 34s`) and **Score** (number of correct answers, e.g. "X / 15").
   - Each result page also has a **Cover block** named `result-cover` that uses an `.svg` mask for cropping its content, with different image/video content inside per result variant. The mask shape is shared; the media inside it differs per score bracket. Actual media assets/placement come from the Figma file.
   - Spanish translations for the three titles/descriptions above are provided in `/project-docs/quiz-translations-EN-ES.xlsx` (see "Translations source file" above).

### Quiz question answer key
The correct option for each question (option letters correspond to the order `option_a / option_b / option_c / option_d` in the translations file):

| # | Correct |
|---|---|
| 1 | A |
| 2 | A |
| 3 | B |
| 4 | C |
| 5 | C |
| 6 | B |
| 7 | B |
| 8 | A |
| 9 | B |
| 10 | B |
| 11 | C |
| 12 | C |
| 13 | C |
| 14 | B |
| 15 | C |

### Timer
A visible stopwatch (counts up from Start button press) — not a countdown/time-limit. Displayed live as a Timer block on every Quiz question screen, formatted as `0m 0s` (e.g. `4m 34s`), updating in real time so the participant can see elapsed time throughout. Stops at quiz completion; the final elapsed value is sent to the backend in both the `0m 0s` formatted string and as a raw-seconds integer, so the Sheet stores both a human-readable value and a sortable/averageable one.

### Data storage
Results go to a **Google Sheet**, connected via a **Google Apps Script Web App** (chosen over a service-account API integration for simpler non-technical maintenance). The backend POSTs to the Apps Script web app URL, which appends a row: `Full Name | Company Office | Score | Completion Time (0m 0s format) | Completion Time (seconds) | Language | Timestamp`.
- Target Google Sheet: **Travel Day Quiz. Results** — https://docs.google.com/spreadsheets/d/1MExJRUS0EHaYRjNcbeE5h751coJF5oeg5WMjMoG6ndI/edit?usp=sharing
- Sheet tab: `Results`, with header row matching the column order above.
- The Apps Script URL will be provided as an environment variable — do not hardcode it.

---

## Design

- Figma file: **https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=2088-13406&t=NBLumTZqzUbsX5jU-1**

### Page design sources (Figma)
Direct links to each page's design source, within the same Figma file above:
- **Home page**: https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4145-46401&t=NBLumTZqzUbsX5jU-1
- **Start page**: https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4145-47546&t=NBLumTZqzUbsX5jU-1
- **Question page**: https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4145-47653&t=NBLumTZqzUbsX5jU-1
- **Finish page**: https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4175-49135&t=NBLumTZqzUbsX5jU-1
- **Result page**: https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4145-47753&t=NBLumTZqzUbsX5jU-1

Frame naming reflects the device/screen size each frame targets: `[Page Name] / [Device] / [Width]`. For example:
```
Quiz-Home / Desktop / 1920
Quiz-Home / Desktop / 1440
Quiz-Home / Mobile / 1024
Quiz-Home / Mobile / 390
```
Use this pattern to identify which frame corresponds to which breakpoint for every page above — the same naming convention applies across Home, Start, Question, Finish, and Result frames.

- Frames are organized as `Desktop / [Screen Name]` and `Mobile / [Screen Name]` pairs — same screen names across both, so each pair represents one responsive page. Expected screens: Home, Start, Quiz Question, Answer Feedback, Finish + Form, Result (Low/Mid/High).
- Breakpoint: **Desktop** is screen width **1025px and above**; **Mobile** is **1024px and below** (1024 included in mobile).
- Main content container (Figma layer named `content`): full-bleed wrapper with these constraints —
  - Desktop: `width: 100%`, `max-width: 1280px`, left/right padding `42px`
  - Mobile: `width: 100%`, `max-width: 580px`, left/right padding `24px`
- Design tokens (colors, type scale, spacing) are defined in Figma Variables and also provided as structured data in `/project-docs/trevo-design-tokens.tokens.json` — use the JSON file as the primary source when parsing token values programmatically, and Figma Dev Mode / the Design System links below to visually confirm.
- Interactive component states to match exactly from Figma (not inferred):
  - Answer option: Default, Hover, Selected, Correct, Incorrect, Disabled
  - Submit answer button: Disabled (default, before selection), Enabled/Clickable (after selection), Hover, Feedback-Correct (`#66B11B` bg), Feedback-Wrong (`#EBEEF5` bg, non-clickable)
  - Full Name input: Default, Focused, Error, Filled
  - Company office dropdown: Default, Open, Selected, Error
  - Start / "Check Result" button: Default, Hover, Disabled/Loading

### Question page item — UI states
- Link to the UI states design in Figma: **https://www.figma.com/design/RWPLFFvtvIZ4qJNxVnn6CU/Trevolution.-Travel-Day-Quiz?node-id=4203-4064&t=NBLumTZqzUbsX5jU-1**
- Use the Figma **frame names as the state guide** — each state is its own frame, named `Question / [State Name]` (e.g. `Question / Default state`, `Question / Active or Hover state`, and so on for every state shown in that section). Match each frame's styling to the corresponding UI state in code exactly as named, rather than inferring states from the general Question screen alone.

### Images / Assets
- Use the Figma link above to collect all UI images.
- Images are grouped into sections by usage context: **Home page**, **Result page**, **Other**, **Opengraph image**, **Favicon image**.
- For each image, follow the **export settings already defined in the Figma file** (format/size per image) rather than assuming a default.
- **Home page** images have separate Desktop and Mobile versions — file naming: `-desk` and `-mob` suffixes (e.g. `home-hero-desk`, `home-hero-mob`).
- **Opengraph images**: two locale-specific versions — `travel-day-quiz-og-en` and `travel-day-quiz-og-es`, used on the `/en` and `/es` pages respectively.
- **Favicon**: use the image provided in the Favicon section of the Figma file.
- After exporting from Figma, **compress `.jpg` and `.png` images to `.webp`** without visible quality loss. Do **not** convert `.svg` files — leave those as-is.

### Design System (separate Figma file)
Use **only** the following as the source of truth for these design system elements — do not infer styling from the quiz-specific Figma file where it overlaps with this system. Also see `/project-docs/trevo-design-tokens.tokens.json` for these same tokens as structured data.
- **Typography**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9535-543&t=fqPO0Duc3sfPk1qp-1
- **Color variants**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9501-1798&t=fqPO0Duc3sfPk1qp-1
- **Size variants**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9501-1799&t=fqPO0Duc3sfPk1qp-1
- **Button states**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9635-144&t=fqPO0Duc3sfPk1qp-1 — with two overrides to the Figma file: use the **Active/Hover color as the default background color**, and set the **Hover state background to `#F2C124`**.
- **Dropdown states and behavior**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9846-1472&t=fqPO0Duc3sfPk1qp-1
- **Form input states**: https://www.figma.com/design/Rdqs9RBihCLBcfpXjF5GUQ/Trevolution.-Web-Design-System?node-id=9769-507&t=fqPO0Duc3sfPk1qp-1

**Relationship to the Quiz Figma file**: the Quiz Figma file is linked to this Design System file and uses its components, tokens, and UI states as instances. The Design System file (and its token export, `/project-docs/trevo-design-tokens.tokens.json`) is the **source of truth** — when a Quiz file element is an instance of a Design System component, pull its actual values (color, typography, spacing, states) from the Design System file/links or the tokens file, not from how it visually appears in the Quiz file alone. If a discrepancy appears between sources, flag it rather than silently picking one.

### Animation & Interaction
- **Interactive elements** (Button, Dropdown, Input): on any state change, use `cursor: pointer`, easing `ease-out`, transition duration `300ms`.
- **Page load**: page elements use a slight staggered fade-in animation after the page loads — duration `600ms`, easing `ease-out`.
- **Home page — cursor parallax (Desktop only)**: add a slight horizontal parallax effect tied to the user's cursor movement, applied to two elements: the background image `bg-img-map` (max offset `5px` each direction) and the Hero cover element `hero-cover-desk` (max offset `10px` each direction). Desktop-only — no parallax on Mobile.

---

## Tech Stack

- Frontend: [React / plain HTML-JS — confirm which]
- Backend: Node.js + Express (single endpoint: `POST /api/submit`)
- Data store: Google Sheet via Apps Script Web App (URL in env var)
- Hosting: Vercel, connected to this GitHub repo for auto-deploy on push/PR
- Custom domain: to be connected in Vercel once build is stable

---

## Build Order

1. Propose folder/architecture — no code yet, wait for confirmation. Include the routing approach for `/en` and `/es` as part of this proposal.
2. Core quiz engine: question data structure (keyed per language), scoring logic, state machine (home → start → quiz → finish/form → result) — no styling yet, just correctness
3. Home page (intro + hero video), styled to Figma, desktop + mobile — build for one language first, then confirm the language-duplication pattern before replicating
4. Start screen (rules description + Start button), styled, desktop + mobile
5. Quiz question + answer-feedback screen (styled, desktop + mobile)
6. Timer block: live UI component on the quiz question screen (styled to Figma) plus the underlying elapsed-time state logic
7. Finish screen + data form (Full Name, Company office dropdown, "Check Result" button), styled, desktop + mobile
8. Result page — all 3 score-bracket variants (styled, desktop + mobile)
9. Google Sheets submission via Apps Script Web App, including the language field
10. Full responsive pass / cross-check against Figma at both breakpoints
11. Apply Spanish content across all screens using the confirmed language pattern from step 3
12. End-to-end manual test: complete the full flow start to finish in both languages, confirm the Sheet receives correct rows with the right language value

Commit after each numbered step once it's manually tested and working. Do not proceed to the next step on top of unverified code.

---

## Constraints / Notes
- No commercial-use restrictions to worry about on hosting — deploying on Vercel Pro (not Hobby), since this is a company project.
- Keep the Apps Script URL and any other credentials out of source control — use `.env` (already in `.gitignore`).
- Fewer than 1,000 expected participants — no need to over-engineer for scale; prioritize correctness and design fidelity over performance optimization.
