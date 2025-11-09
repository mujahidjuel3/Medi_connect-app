import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PrescriptionUpload from "../components/prescription/PrescriptionUpload";
import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const Prescription = () => {
  const { token, userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    // Load selected doctor from localStorage
    return localStorage.getItem('selectedDoctorId') || null;
  });

  useEffect(() => {
    if (!token || !userData) {
      toast.warn(t('please_login'));
      navigate("/login");
      return;
    }
    fetchDoctors();
  }, [token, userData, navigate, t]);

  // Save selected doctor to localStorage
  useEffect(() => {
    if (selectedDoctor) {
      localStorage.setItem('selectedDoctorId', selectedDoctor);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/all-doctors", {
        headers: { token },
      });
      if (data.success) {
        // Filter only available doctors
        const available = data.doctors.filter((doc) => doc.available);
        setDoctors(available);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  if (!token || !userData) {
    return null;
  }

  return (
    <MoveUpOnRender id="prescription">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl mx-auto px-2 xs:px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <img
            src={assets.upload_icon}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            alt="Prescription"
          />
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            {t('upload_prescription')}
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6">
          <div>
            <div className="mb-4 sm:mb-5 md:mb-6">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1.5 sm:mb-2">
                {t('select_doctor')} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"
                value={selectedDoctor || ""}
                onChange={(e) =>
                  setSelectedDoctor(e.target.value ? e.target.value : null)
                }
                required
              >
                <option value="">{t('select_doctor_required')}</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.speciality}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4 sm:pt-5 md:pt-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
                {t('upload_prescription_file')}
              </h3>
              <PrescriptionUpload
                doctorId={selectedDoctor || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default Prescription;

