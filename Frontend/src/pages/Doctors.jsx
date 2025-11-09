import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);
  return (
    <div className="px-2 xs:px-4 sm:px-0">
      <p className="text-gray-600 text-xs sm:text-sm md:text-base">{t('browse_doctors')}</p>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5 mt-3 sm:mt-5">
          <button
            className={`py-1.5 sm:py-2 px-3 sm:px-4 border rounded text-xs sm:text-sm transition-all md:hidden ${
              showFilter ? " bg-primary text-white " : ""
            }`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            {t('filter')}
          </button>
          <div
            className={`flex-col gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 w-full sm:w-auto ${
              showFilter ? "flex" : "hidden md:flex"
            }`}
          >
            <p
              onClick={() =>
                speciality === "General physician"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/General physician")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "General physician"
                  ? "bg-indigo-100 text-black"
                  : ""
              }`}
            >
              {t('general_physician')}
            </p>
            <p
              onClick={() =>
                speciality === "Gynecologist"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/Gynecologist")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {t('gynecologist')}
            </p>
            <p
              onClick={() =>
                speciality === "Dermatologist"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/Dermatologist")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {t('dermatologist')}
            </p>
            <p
              onClick={() =>
                speciality === "Pediatricians"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/Pediatricians")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {t('pediatricians')}
            </p>
            <p
              onClick={() =>
                speciality === "Neurologist"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/Neurologist")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {t('neurologist')}
            </p>
            <p
              onClick={() =>
                speciality === "Gastroenterologist"
                  ? navigate(`/doctors`)
                  : navigate("/doctors/Gastroenterologist")
              }
              className={`w-full sm:w-auto pl-3 sm:pl-4 py-2 sm:py-2.5 pr-12 sm:pr-16 border border-gray-300 rounded transition-all cursor-pointer text-xs sm:text-sm ${
                speciality === "Gastroenterologist"
                  ? "bg-indigo-100 text-black"
                  : ""
              }`}
            >
              {t('gastroenterologist')}
            </p>
          </div>
        </div>

        <div className="w-full sm:m-2 md:m-4">
          <MoveUpOnRender>
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
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
          </MoveUpOnRender>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
