import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <MoveUpOnRender id="contact">
      <div className="text-2xl text-center pt-10 text-gray-500">
        <p>
          {t('contact_us')}
        </p>
      </div>

      <div className=" my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm ">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600 ">{t('our_office')}</p>
          <p className="text-gray-500">
            DIT Project, Merul Badda <br /> Road No-10, Dhaka, Bangladesh
          </p>
          <p className="text-gray-500">
            Tel: 01727983686 <br /> Email: help@mediconnect.com
          </p>
          <p className="font-semibold text-lg text-gray-600 ">
            {t('careers_at_mediconnect')}
          </p>
          <p className="text-gray-500">
            {t('careers_text')}
          </p>
          <button className=" border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            {t('explore_jobs')}
          </button>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default Contact;
