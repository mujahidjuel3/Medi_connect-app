import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [dashData, setDashData] = useState([]);

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { aToken },
      });

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || "Failed to load doctors");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load doctors");
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change availability");
    }
  };

  const deleteDoctor = async (docId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this doctor?")) {
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-doctor",
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message || "Failed to load dashboard data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    }
  };

  const getAllPrescriptions = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/prescriptions/admin/all", {
        headers: { aToken },
      });
      if (data.success) {
        setPrescriptions(data.prescriptions || []);
      } else {
        toast.error(data.message || "Failed to load prescriptions");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load prescriptions");
    }
  };

  const deletePrescription = async (prescriptionId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this prescription?")) {
        return;
      }

      const { data } = await axios.delete(backendUrl + "/api/prescriptions", {
        data: { prescriptionId },
        headers: { aToken },
      });

      if (data.success) {
        toast.success(data.message || "Prescription deleted successfully");
        getAllPrescriptions();
      } else {
        toast.error(data.message || "Failed to delete prescription");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete prescription");
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    deleteDoctor,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    getDashData,
    dashData,
    prescriptions,
    getAllPrescriptions,
    deletePrescription,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
