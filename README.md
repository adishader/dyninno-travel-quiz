# Dyninno Travel Day Quiz

A bilingual (EN/ES) 15-question interactive travel quiz. Full spec: [project-docs/CLAUDE.md](project-docs/CLAUDE.md).

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`; Spanish is served at `/es`).

## Regenerating translations

UI copy and question text are sourced from `project-docs/quiz-translations-EN-ES.xlsx`. After editing that sheet, regenerate the dictionaries:

```bash
npm run gen:translations
```

This writes `lib/i18n/dictionaries/en.json` and `es.json`.
