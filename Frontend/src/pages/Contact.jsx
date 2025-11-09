import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <MoveUpOnRender id="contact">
      <div className="px-2 xs:px-4 sm:px-0">
        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-center pt-6 sm:pt-8 md:pt-10 text-gray-500">
          <p>
            {t('contact_us')}
          </p>
        </div>

        <div className="my-6 sm:my-8 md:my-10 flex flex-col justify-center md:flex-row gap-6 sm:gap-8 md:gap-10 mb-16 sm:mb-20 md:mb-28 text-xs sm:text-sm md:text-base">
          <img
            className="w-full md:max-w-[300px] lg:max-w-[360px] xl:max-w-[400px] rounded-lg"
            src={assets.contact_image}
            alt=""
          />
          <div className="flex flex-col justify-center items-start gap-4 sm:gap-5 md:gap-6">
            <p className="font-semibold text-base sm:text-lg md:text-xl text-gray-600">{t('our_office')}</p>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              DIT Project, Merul Badda <br /> Road No-10, Dhaka, Bangladesh
            </p>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Tel: 01727983686 <br /> Email: help@mediconnect.com
            </p>
            <p className="font-semibold text-base sm:text-lg md:text-xl text-gray-600 mt-2 sm:mt-4">
              {t('careers_at_mediconnect')}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              {t('careers_text')}
            </p>
            <button className="border border-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-500 rounded">
              {t('explore_jobs')}
            </button>
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default Contact;
