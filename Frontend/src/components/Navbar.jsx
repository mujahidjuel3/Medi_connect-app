import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { AppContext } from "../context/AppContext";
import { User } from "lucide-react";
const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const { t } = useTranslation();

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };
  return (
    <div className="flex sticky top-0 bg-white/90 z-10 items-center justify-between text-xs sm:text-sm py-2 sm:py-3 md:py-4 mb-3 sm:mb-4 md:mb-5 border-b border-b-gray-400 px-2 sm:px-4">
      <img
        onClick={() => navigate("/")}
        className="w-28 xs:w-32 sm:w-36 md:w-44 lg:w-48 xl:w-52 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden lg:flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 font-medium text-xs lg:text-xs xl:text-sm">
        <NavLink to="/" className="hover:text-primary transition-colors">
          <li className="py-1 whitespace-nowrap">{t('home')}</li>
        </NavLink>
        <NavLink to="/doctors" className="hover:text-primary transition-colors">
          <li className="py-1 whitespace-nowrap">{t('all_doctors')}</li>
        </NavLink>
        <NavLink to="/about" className="hover:text-primary transition-colors">
          <li className="py-1 whitespace-nowrap">{t('about')}</li>
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary transition-colors">
          <li className="py-1 whitespace-nowrap">{t('contact')}</li>
        </NavLink>
        {/* Chat and Prescription buttons - visible when logged in */}
        {token && userData && (
          <>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-1 xl:gap-2 py-1 hover:text-primary transition-colors"
              title={t('chat_with_doctor')}
            >
              <img src={assets.chats_icon} className="w-4 h-4 lg:w-5 lg:h-5" alt="Chat" />
              <span className="hidden xl:inline text-xs lg:text-sm">{t('chat')}</span>
            </button>
            <button
              onClick={() => navigate("/prescription")}
              className="flex items-center gap-1 xl:gap-2 py-1 hover:text-primary transition-colors"
              title={t('upload_prescription')}
            >
              <img src={assets.upload_icon} className="w-4 h-4 lg:w-5 lg:h-5" alt="Prescription" />
              <span className="hidden xl:inline text-xs lg:text-sm">{t('prescription')}</span>
            </button>
          </>
        )}
      </ul>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
        <LanguageSwitcher />
        {token && userData ? (
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 cursor-pointer group relative">
            <img className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex-shrink-0" src={userData.image} alt="" />
            <img className="w-2 sm:w-2.5 flex-shrink-0" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-full right-0 mt-2 text-xs sm:text-sm md:text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-36 xs:min-w-40 sm:min-w-44 md:min-w-48 bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col gap-1 sm:gap-2 p-2 sm:p-3">
                <p
                  onClick={() => navigate("/my-profile")}
                  className=" hover:bg-gray-100 cursor-pointer px-3 py-2 rounded"
                >
                  {t('my_profile')}
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className=" hover:bg-gray-100  cursor-pointer px-3 py-2 rounded"
                >
                  {t('my_appointments')}
                </p>
                <hr className="border-gray-200" />
                <p
                  onClick={() => navigate("/chat")}
                  className=" hover:bg-gray-100  cursor-pointer flex items-center gap-2 px-3 py-2 rounded"
                >
                  <img src={assets.chats_icon} className="w-4 h-4" alt="" />
                  {t('chat_with_doctor')}
                </p>
                <p
                  onClick={() => navigate("/prescription")}
                  className=" hover:bg-gray-100  cursor-pointer flex items-center gap-2 px-3 py-2 rounded"
                >
                  <img src={assets.upload_icon} className="w-4 h-4" alt="" />
                  {t('upload_prescription')}
                </p>
                <hr className="border-gray-200" />
                <p
                  onClick={logout}
                  className=" hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded"
                >
                  {t('logout_btn')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* User profile icon for mobile screen when not logged in */}
            <button
              onClick={() => navigate("/login")}
              className="sm:hidden flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
              title={t('login')}
            >
              <User className="w-5 h-5 xs:w-6 xs:h-6 text-gray-600" />
            </button>
            {/* Create Account button for desktop screen */}
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 rounded-full font-light text-xs sm:text-sm md:text-base hidden sm:block"
            >
              {t('create_account')}
            </button>
          </>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-5 h-5 sm:w-6 sm:h-6 lg:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />

        {/* --------------- Mobile Menu----------- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } lg:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 sm:py-6">
            <img className="w-28 sm:w-32 md:w-36" src={assets.logo} alt="" />
            <img
              className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 sm:gap-3 mt-4 sm:mt-5 px-4 sm:px-5 text-base sm:text-lg font-medium">
            <NavLink
              className="px-4 py-2 rounded inline-block"
              onClick={() => setShowMenu(false)}
              to="/"
            >
              <p className="px-4 py-2 rounded inline-block">{t('home')}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">{t('all_doctors')}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">{t('about')}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">{t('contact')}</p>
            </NavLink>
            {/* Chat and Prescription for mobile - visible when logged in */}
            {token && userData && (
              <>
                <button
                  onClick={() => {
                    navigate("/chat");
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded"
                >
                  <img src={assets.chats_icon} className="w-5 h-5" alt="Chat" />
                  <span>{t('chat_with_doctor')}</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/prescription");
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded"
                >
                  <img src={assets.upload_icon} className="w-5 h-5" alt="Prescription" />
                  <span>{t('upload_prescription')}</span>
                </button>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
