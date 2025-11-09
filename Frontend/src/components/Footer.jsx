import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="px-2 xs:px-4 sm:px-6 md:mx-4 lg:mx-6 xl:mx-10">
      <div className="flex flex-col sm:flex-row lg:grid lg:grid-cols-[3fr_1fr_1fr] gap-8 sm:gap-10 lg:gap-14 my-8 sm:my-10 mt-20 sm:mt-32 md:mt-40 text-xs sm:text-sm md:text-base">
        {/* --------------left section-------------- */}
        <div className="sm:flex-1 lg:flex-none">
          <Link to="/">
            <img className="mb-3 sm:mb-4 md:mb-5 w-28 sm:w-32 md:w-36 lg:w-40" src={assets.logo} alt="" />
          </Link>
          <p className="w-full sm:w-4/5 md:w-2/3 text-gray-600 leading-5 sm:leading-6 text-xs sm:text-sm">
            {t('footer_description')}
          </p>
        </div>

        {/* --------------center section-------------- */}
        <div className="sm:flex-1 lg:flex-none">
          <p className="text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 md:mb-5">{t('company')}</p>
          <ul className="flex flex-col gap-1.5 sm:gap-2 text-gray-600 text-xs sm:text-sm">
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
        <div className="sm:flex-1 lg:flex-none">
          <p className="text-base sm:text-lg md:text-xl font-medium mb-3 sm:mb-4 md:mb-5">{t('get_in_touch')}</p>
          <ul className="flex flex-col gap-1.5 sm:gap-2 text-gray-600 text-xs sm:text-sm">
            <li> Tel: 01727983686 </li>
            <li className="break-all">help@mediconnect.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/* -----------copy right text--------- */}
        <hr />
        <p className="py-3 sm:py-4 md:py-5 text-xs sm:text-sm text-center">
          {t('copyright')}
        </p>
      </div>
    </div>
  );
};

export default Footer;
