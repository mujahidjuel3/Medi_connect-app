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
  const [searchParams] = useSearchParams();
  const appointmentIdFromUrl = searchParams.get("appointmentId");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (!token || !userData) {
      toast.warn("Please login to upload prescription");
      navigate("/login");
      return;
    }
    fetchAppointments();
    
    // If appointmentId is in URL, auto-select that appointment
    if (appointmentIdFromUrl) {
      setSelectedAppointment(appointmentIdFromUrl);
    }
  }, [token, userData, navigate, appointmentIdFromUrl]);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        // Show only completed appointments
        const completed = data.appointments.filter(
          (apt) => apt.isCompleted && !apt.cancelled
        );
        setAppointments(completed);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No completed appointments found. Upload prescription for a
                completed appointment.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Appointment (Optional)
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={selectedAppointment || ""}
                  onChange={(e) =>
                    setSelectedAppointment(
                      e.target.value ? e.target.value : null
                    )
                  }
                >
                  <option value="">No specific appointment</option>
                  {appointments.map((apt) => (
                    <option key={apt._id} value={apt._id}>
                      {apt.docData?.name} - {apt.slotDate} {apt.slotTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Upload Prescription File
                </h3>
                <PrescriptionUpload
                  appointmentId={selectedAppointment || undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default Prescription;

