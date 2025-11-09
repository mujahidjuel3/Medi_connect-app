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
  const { token, userData, doctors, backendUrl } = useContext(AppContext);
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
  }, [token, userData, navigate, doctorIdFromUrl, doctors]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatWindow(true);
  };

  if (!token || !userData) {
    return null;
  }

  return (
    <MoveUpOnRender id="chat">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-2 xs:px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <img src={assets.chats_icon} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" alt="Chat" />
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">{t('chat_with_doctor_title')}</h1>
        </div>

        {!showChatWindow ? (
          <div>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
              {t('select_doctor_to_chat')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                        {i18n.language === 'bn' && doctor.nameBn ? doctor.nameBn : doctor.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
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
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <button
                onClick={() => {
                  setShowChatWindow(false);
                  setSelectedDoctor(null);
                }}
                className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm md:text-base"
              >
                ← {t('back_to_doctors')}
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 bg-white">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg truncate">
                    {i18n.language === 'bn' && selectedDoctor.nameBn ? selectedDoctor.nameBn : selectedDoctor.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {i18n.language === 'bn' && selectedDoctor.specialityBn ? selectedDoctor.specialityBn : selectedDoctor.speciality}
                  </p>
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

