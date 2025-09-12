
# Language Toggle (English ↔ বাংলা) — Setup Done

I added a **LanguageSwitcher** to your navbar and wired up i18next to translate key UI text.
Your project already had `/locales/en/common.json` and `/locales/bn/common.json` and an `i18n.ts` initializer, so we just used those.

## What changed
- `components/LanguageSwitcher.tsx` (already present) — used in Navbar.
- `components/Navbar.jsx` — now uses `t('...')` for menu labels and shows the language buttons.
- `components/Header.jsx` — title + subtext now come from translations.
- `/locales/en/common.json` and `/locales/bn/common.json` — added new keys (home, about, etc.).

## How to translate more text
1. Wrap any string with the translation hook:
   ```jsx
   import { useTranslation } from 'react-i18next';
   const { t } = useTranslation();
   <span>{t('some_key')}</span>
   ```
2. Add the same key to both files:
   - `/locales/en/common.json`
   - `/locales/bn/common.json`

Example:
```json
// en/common.json
{
  "greeting": "Welcome"
}
// bn/common.json
{
  "greeting": "স্বাগতম"
}
```

## Where the language is saved
i18next stores the selected language in **localStorage** (`i18nextLng`), so your choice persists on refresh.

## Keys added
- `home`, `all_doctors`, `about`, `contact`
- `my_profile`, `my_appointments`, `logout_btn`
- `book_title_line1`, `book_title_line2`, `header_subtext`

If anything still shows in English, just convert it to `t('...')` and add matching entries in the JSON files.
