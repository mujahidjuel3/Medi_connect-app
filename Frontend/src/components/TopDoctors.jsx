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
    <div className="flex flex-col items-center gap-4 mp-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">{t('top_doctors_to_book')}</h1>
      <p className="sm:w-1/3 text-center text-sm">
        {t('top_doctors_desc')}
      </p>
      {/* gridTemplateColumns */}

      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 ">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:scale-110 transition-all duration-500"
            key={index}
          >
            <img className="bg-blue-50" src={item.image} alt="" />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  item.available ? " text-green-500" : "text-gray-500"
                } `}
              >
                <p
                  className={`w-2 h-2 ${
                    item?.available ? " bg-green-500" : "bg-gray-500"
                  }  rounded-full`}
                ></p>{" "}
                <p>{item.available ? t('available') : t('not_available')}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium ">
                {i18n.language === 'bn' && item.nameBn ? item.nameBn : item.name}
              </p>
              <p className="text-gray-600 text-sm">
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
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        {t('more')}
      </button>
    </div>
  );
};

export default TopDoctors;
