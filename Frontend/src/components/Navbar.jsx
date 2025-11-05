import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { AppContext } from "../context/AppContext";
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
    <div className="flex sticky top-0 bg-white/90 z-10 items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium ">
        <NavLink to="/">
          <li className="py-1 ">{t('home')}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden " />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1 ">{t('all_doctors')}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1 ">{t('about')}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1 ">{t('contact')}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        {/* Chat and Prescription buttons - visible when logged in */}
        {token && userData && (
          <>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 py-1 hover:text-primary transition-colors"
              title="Chat with Doctor"
            >
              <img src={assets.chats_icon} className="w-5 h-5" alt="Chat" />
              <span className="hidden lg:inline">Chat</span>
            </button>
            <button
              onClick={() => navigate("/prescription")}
              className="flex items-center gap-2 py-1 hover:text-primary transition-colors"
              title="Upload Prescription"
            >
              <img src={assets.upload_icon} className="w-5 h-5" alt="Prescription" />
              <span className="hidden lg:inline">Prescription</span>
            </button>
          </>
        )}
      </ul>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {token && userData ? (
          <div className=" flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 h-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0  pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col gap-2 p-3 ">
                <p
                  onClick={() => navigate("/my-profile")}
                  className=" hover:bg-gray-100 cursor-pointer px-3 py-2 rounded"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className=" hover:bg-gray-100  cursor-pointer px-3 py-2 rounded"
                >
                  My Appointment
                </p>
                <hr className="border-gray-200" />
                <p
                  onClick={() => navigate("/chat")}
                  className=" hover:bg-gray-100  cursor-pointer flex items-center gap-2 px-3 py-2 rounded"
                >
                  <img src={assets.chats_icon} className="w-4 h-4" alt="" />
                  Chat with Doctor
                </p>
                <p
                  onClick={() => navigate("/prescription")}
                  className=" hover:bg-gray-100  cursor-pointer flex items-center gap-2 px-3 py-2 rounded"
                >
                  <img src={assets.upload_icon} className="w-4 h-4" alt="" />
                  Upload Prescription
                </p>
                <hr className="border-gray-200" />
                <p
                  onClick={logout}
                  className=" hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create Account
            </button>
          </>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* --------------- Mobile Menu----------- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white  transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-6"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium ">
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
                  className="flex items-center gap-2 px-4 py-2 rounded inline-block"
                >
                  <img src={assets.chats_icon} className="w-5 h-5" alt="Chat" />
                  <span>Chat with Doctor</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/prescription");
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded inline-block"
                >
                  <img src={assets.upload_icon} className="w-5 h-5" alt="Prescription" />
                  <span>Upload Prescription</span>
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
