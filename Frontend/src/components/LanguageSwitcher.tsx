import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{t('language')}:</span>
      <button onClick={() => i18n.changeLanguage('bn')} className="px-3 py-1 border rounded">বাংলা</button>
      <button onClick={() => i18n.changeLanguage('en')} className="px-3 py-1 border rounded">English</button>
    </div>
  );
}
