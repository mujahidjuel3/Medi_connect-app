import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* --------------left section-------------- */}
        <div>
          <Link to="/">
            <img className="mb-5 w-40" src={assets.logo} alt="" />
          </Link>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            {t('footer_description')}
          </p>
        </div>

        {/* --------------center section-------------- */}
        <div>
          <p className="text-xl font-medium mb-5">{t('company')}</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                {t('about_us')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                {t('contact_us')}
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                {t('privacy_policy')}
              </Link>
            </li>
          </ul>
        </div>

        {/* --------------right section-------------- */}
        <div>
          <p className="text-xl font-medium mb-5">{t('get_in_touch')}</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li> Tel: 01727983686 </li>
            <li>help@mediconnect.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/* -----------copy right text--------- */}
        <hr />
        <p className="py-5 text-sm text-center">
          {t('copyright')}
        </p>
      </div>
    </div>
  );
};

export default Footer;
