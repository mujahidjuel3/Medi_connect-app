import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5 py-8 sm:py-12 md:py-16 text-gray-900 px-2 xs:px-4 md:mx-4 lg:mx-6 xl:mx-10">
      <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-medium text-center px-2">{t('top_doctors_to_book')}</h1>
      <p className="w-full xs:w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-xs sm:text-sm md:text-base px-4">
        {t('top_doctors_desc')}
      </p>

      <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-5 md:gap-6 pt-4 sm:pt-5 px-2 xs:px-3 sm:px-4 md:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-105 sm:hover:scale-110 transition-all duration-500"
            key={index}
          >
            <img className="bg-blue-50 w-full h-auto" src={item.image} alt="" />
            <div className="p-2 sm:p-3 md:p-4">
              <div
                className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-center ${
                  item.available ? " text-green-500" : "text-gray-500"
                } `}
              >
                <p
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${
                    item?.available ? " bg-green-500" : "bg-gray-500"
                  }  rounded-full`}
                ></p>
                <p>{item.available ? t('available') : t('not_available')}</p>
              </div>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-medium mt-1 sm:mt-2">
                {i18n.language === 'bn' && item.nameBn ? item.nameBn : item.name}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">
                {i18n.language === 'bn' && item.specialityBn ? item.specialityBn : item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-2.5 md:py-3 rounded-full mt-6 sm:mt-8 md:mt-10 text-xs sm:text-sm md:text-base"
      >
        {t('more')}
      </button>
    </div>
  );
};

export default TopDoctors;
