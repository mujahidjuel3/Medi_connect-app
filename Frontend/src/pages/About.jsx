import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <MoveUpOnRender id="about">
      <div>
        <div className="text-center text-2xl pt-10 text-gray-600">
          <p>
            {t('about')} <span className="text-gray-700 font-medium">{t('about_us')}</span>
          </p>
        </div>

        {/*  ---------top section---------*/}
        <div className="my-10 flex flex-col md:flex-row gap-12">
          <img
            className="w-full md:max-w-[360px]"
            src={assets.about_image}
            alt=""
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
            <p>
              {t('welcome_prescripto')}
            </p>
            <p>
              {t('prescripto_commitment')}
            </p>
            <b className="text-gray-800">{t('our_vision')}</b>
            <p>
              {t('vision_text')}
            </p>
          </div>
        </div>

        <div className="text-xl my-4 ">
          <p>
            {t('why_choose_us')}
          </p>

          <div className="flex flex-col md:flex-row mb-20 mt-4">
            <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b>{t('efficiency')}</b>
              <p>
                {t('efficiency_text')}
              </p>
            </div>
            <div className="border px-10 md:px-15 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b>{t('convenience')}</b>
              <p>
                {t('convenience_text')}
              </p>
            </div>
            <div className="border px-10 md:px-15 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
              <b>{t('personalization')}</b>
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
