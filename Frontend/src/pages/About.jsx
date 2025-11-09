import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <MoveUpOnRender id="about">
      <div className="px-2 xs:px-4 sm:px-0">
        <div className="text-center text-lg xs:text-xl sm:text-2xl md:text-3xl pt-6 sm:pt-8 md:pt-10 text-gray-600">
          <p>
            {t('about')} <span className="text-gray-700 font-medium">{t('about_us')}</span>
          </p>
        </div>

        {/*  ---------top section---------*/}
        <div className="my-6 sm:my-8 md:my-10 flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <img
            className="w-full md:max-w-[300px] lg:max-w-[360px] xl:max-w-[400px] rounded-lg"
            src={assets.about_image}
            alt=""
          />
          <div className="flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 md:w-2/4 text-xs sm:text-sm md:text-base text-gray-600">
            <p>
              {t('welcome_prescripto')}
            </p>
            <p>
              {t('prescripto_commitment')}
            </p>
            <b className="text-gray-800 text-sm sm:text-base md:text-lg">{t('our_vision')}</b>
            <p>
              {t('vision_text')}
            </p>
          </div>
        </div>

        <div className="text-base sm:text-lg md:text-xl my-3 sm:my-4">
          <p className="font-semibold">
            {t('why_choose_us')}
          </p>

          <div className="flex flex-col md:flex-row mb-12 sm:mb-16 md:mb-20 mt-3 sm:mt-4 gap-0 md:gap-0">
            <div className="border px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm md:text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b className="text-sm sm:text-base md:text-lg">{t('efficiency')}</b>
              <p>
                {t('efficiency_text')}
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm md:text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b className="text-sm sm:text-base md:text-lg">{t('convenience')}</b>
              <p>
                {t('convenience_text')}
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-12 lg:py-16 flex flex-col gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm md:text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b className="text-sm sm:text-base md:text-lg">{t('personalization')}</b>
              <p>
                {t('personalization_text')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default About;
