import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets";
import { useTranslation } from 'react-i18next';
const SpecialityMenu = () => {
  const { t } = useTranslation();
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-3 sm:gap-4 py-8 sm:py-12 md:py-16 text-gray-800 px-2 xs:px-4"
    >
      <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-medium text-center px-2">{t('find_by_speciality')}</h1>
      <p className="w-full xs:w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-xs sm:text-sm md:text-base px-4">
        {t('find_by_speciality_desc')}
      </p>
      <div className="flex sm:justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 pt-4 sm:pt-5 w-full overflow-x-auto pb-2 px-2 sm:px-4">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-[10px] xs:text-xs sm:text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 min-w-[60px] xs:min-w-[70px] sm:min-w-[80px]"
            key={index}
            to={`/doctors/${item.speciality}`}
          >
            <img className="w-12 xs:w-14 sm:w-16 md:w-20 lg:w-24 mb-1 sm:mb-2" src={item.image} alt="" />
            <p className="text-center px-1">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
