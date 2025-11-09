import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="text-xs sm:text-sm hidden sm:inline">{t('language')}:</span>
      <button 
        onClick={() => i18n.changeLanguage('bn')} 
        className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm border rounded transition-colors ${
          i18n.language === 'bn' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        বাংলা
      </button>
      <button 
        onClick={() => i18n.changeLanguage('en')} 
        className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm border rounded transition-colors ${
          i18n.language === 'en' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        English
      </button>
    </div>
  );
}
