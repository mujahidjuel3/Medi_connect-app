import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import PrescriptionUpload from "../components/prescription/PrescriptionUpload";
import { assets } from "../assets/assets";
import MoveUpOnRender from "../components/MoveUpOnRender";
import axios from "axios";

const Prescription = () => {
  const { token, userData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    // Load selected doctor from localStorage
    return localStorage.getItem('selectedDoctorId') || null;
  });

  useEffect(() => {
    if (!token || !userData) {
      toast.warn("Please login to upload prescription");
      navigate("/login");
      return;
    }
    fetchDoctors();
  }, [token, userData, navigate]);

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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={assets.upload_icon}
            className="w-8 h-8"
            alt="Prescription"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            Upload Prescription
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                value={selectedDoctor || ""}
                onChange={(e) =>
                  setSelectedDoctor(e.target.value ? e.target.value : null)
                }
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.speciality}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Upload Prescription File
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

