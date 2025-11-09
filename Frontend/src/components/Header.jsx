import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col lg:flex-row bg-primary rounded-lg px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
      {/* left side */}
      <div className="lg:w-1/2 flex flex-col items-start justify-center gap-3 sm:gap-4 py-6 sm:py-8 md:py-10 m-auto lg:py-[10vw] lg:mb-[-30px]">
        <p className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-semibold leading-tight">
          {t('book_title_line1')} <br />
          {t('book_title_line2')}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-white text-xs sm:text-sm md:text-base font-light">
          <img className="w-20 xs:w-24 sm:w-28 md:w-32" src={assets.group_profiles} alt="" />
          <p className="text-center sm:text-left">
            {t('header_subtext')}
          </p>
        </div>
        <Link
          className="flex items-center gap-2 bg-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-gray-600 text-xs sm:text-sm md:text-base m-auto lg:m-0 hover:scale-105 transition-all duration-300"
          to="#speciality"
        >
          {t('book_appointment_btn')}
          <img className="w-2.5 sm:w-3" src={assets.arrow_icon} alt="" />
        </Link>
      </div>

      {/* right side */}
      <div className="lg:w-1/2 relative mt-4 lg:mt-0">
        <img
          className="w-full lg:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
