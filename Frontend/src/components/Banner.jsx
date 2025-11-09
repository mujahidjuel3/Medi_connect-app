import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useTranslation } from 'react-i18next';

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className="flex bg-primary rounded-lg px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 my-10 sm:my-12 md:my-16 lg:my-20 md:mx-4 lg:mx-6 xl:mx-10">
      {/*---------------- left-side ---------------- */}
      <div className="flex-1 py-6 sm:py-8 md:py-10 lg:py-16 xl:py-20 2xl:py-24 lg:pl-5">
        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white">
          <p>{t('book_appointment')}</p>
          <p className="mt-2 sm:mt-3 md:mt-4">{t('with_trusted_doctors')}</p>
        </div>

        {!token && (
          <button
            onClick={() => {
              navigate(`/login`);
              scrollTo: 0, 0;
            }}
            className="bg-white text-xs sm:text-sm md:text-base text-gray-600 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full mt-4 sm:mt-5 md:mt-6 hover:scale-105 transition-all"
          >
            {t('create_account')}
          </button>
        )}
      </div>

      {/*---------------- right-side ---------------- */}
      <div className="hidden md:block md:w-1/2 lg:w-[300px] xl:w-[370px] 2xl:w-[450px] relative">
        <img
          className="w-full absolute bottom-0 right-0 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
