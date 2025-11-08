import { useTranslation } from 'react-i18next';
import MoveUpOnRender from '../components/MoveUpOnRender';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <MoveUpOnRender id="privacy-policy">
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {t('privacy_policy_title')}
        </h1>
        
        <div className="prose max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_intro_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_intro_text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_data_collection_title')}
            </h2>
            <p className="leading-relaxed mb-3">
              {t('privacy_data_collection_text')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('privacy_data_item1')}</li>
              <li>{t('privacy_data_item2')}</li>
              <li>{t('privacy_data_item3')}</li>
              <li>{t('privacy_data_item4')}</li>
              <li>{t('privacy_data_item5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_data_use_title')}
            </h2>
            <p className="leading-relaxed mb-3">
              {t('privacy_data_use_text')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('privacy_use_item1')}</li>
              <li>{t('privacy_use_item2')}</li>
              <li>{t('privacy_use_item3')}</li>
              <li>{t('privacy_use_item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_data_protection_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_data_protection_text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_data_sharing_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_data_sharing_text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_user_rights_title')}
            </h2>
            <p className="leading-relaxed mb-3">
              {t('privacy_user_rights_text')}
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('privacy_rights_item1')}</li>
              <li>{t('privacy_rights_item2')}</li>
              <li>{t('privacy_rights_item3')}</li>
              <li>{t('privacy_rights_item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_cookies_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_cookies_text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_changes_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_changes_text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('privacy_contact_title')}
            </h2>
            <p className="leading-relaxed">
              {t('privacy_contact_text')}
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-500">
              {t('privacy_last_updated')}
            </p>
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default PrivacyPolicy;

