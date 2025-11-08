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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <img src={assets.chats_icon} className="w-8 h-8" alt="Chat" />
          <h1 className="text-2xl font-semibold text-gray-800">{t('chat_with_doctor_title')}</h1>
        </div>

        {!showChatWindow ? (
          <div>
            <p className="text-gray-600 mb-4">
              {t('select_doctor_to_chat')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {i18n.language === 'bn' && doctor.nameBn ? doctor.nameBn : doctor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
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
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => {
                  setShowChatWindow(false);
                  setSelectedDoctor(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                {t('back_to_doctors')}
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">
                    {i18n.language === 'bn' && selectedDoctor.nameBn ? selectedDoctor.nameBn : selectedDoctor.name}
                  </h3>
                  <p className="text-sm text-gray-500">
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

