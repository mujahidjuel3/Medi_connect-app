import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ChatWindow from "../components/chat/ChatWindow";
import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Chat = () => {
  const { token, userData, doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const doctorIdFromUrl = searchParams.get("doctorId");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    if (!token || !userData) {
      toast.warn(t('please_login_chat'));
      navigate("/login");
      return;
    }

    // If doctorId is in URL, auto-select that doctor
    if (doctorIdFromUrl && doctors.length > 0) {
      const doctor = doctors.find((doc) => doc._id === doctorIdFromUrl);
      if (doctor) {
        setSelectedDoctor(doctor);
        setShowChatWindow(true);
      }
    }
  }, [token, userData, navigate, doctorIdFromUrl, doctors, t]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatWindow(true);
  };

  if (!token || !userData) {
    return null;
  }

  return (
    <MoveUpOnRender id="chat">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          <img src={assets.chats_icon} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" alt="Chat" />
          <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800">{t('chat_with_doctor_title')}</h1>
        </div>

        {!showChatWindow ? (
          <div>
            <p className="text-gray-600 mb-3 sm:mb-4 md:mb-5 text-xs xs:text-sm sm:text-base md:text-lg">
              {t('select_doctor_to_chat')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="border border-gray-200 rounded-lg p-2 xs:p-3 sm:p-4 md:p-5 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl truncate">
                        {i18n.language === 'bn' && doctor.nameBn ? doctor.nameBn : doctor.name}
                      </h3>
                      <p className="text-xs xs:text-xs sm:text-sm md:text-base text-gray-500 truncate">
                        {i18n.language === 'bn' && doctor.specialityBn ? doctor.specialityBn : doctor.speciality}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="border border-gray-200 rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 bg-white shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 pb-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    setShowChatWindow(false);
                    setSelectedDoctor(null);
                  }}
                  className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 order-2 sm:order-1"
                >
                  <span className="text-lg sm:text-xl">←</span>
                  <span className="text-sm sm:text-base font-medium">{t('back_to_doctors').replace('←', '').trim()}</span>
                </button>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-start">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex-shrink-0 border-2 border-primary/20 shadow-md"
                  />
                  <div className="min-w-0 flex-1 sm:flex-none">
                    <h3 className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl truncate text-gray-800">
                      {i18n.language === 'bn' && selectedDoctor.nameBn ? selectedDoctor.nameBn : selectedDoctor.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate hidden xs:block">
                      {i18n.language === 'bn' && selectedDoctor.specialityBn ? selectedDoctor.specialityBn : selectedDoctor.speciality}
                    </p>
                  </div>
                </div>
              </div>
              <ChatWindow
                userId={userData._id || userData.id}
                doctorId={selectedDoctor._id}
              />
            </div>
          </div>
        )}
      </div>
    </MoveUpOnRender>
  );
};

export default Chat;

