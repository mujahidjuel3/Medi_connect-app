import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import MoveUpOnRender from "../../components/MoveUpOnRender";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorPrescriptions = () => {
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dToken) return;

    const loadPrescriptions = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/prescriptions/doctor`,
          {
            headers: { dToken },
          }
        );

        if (data.success) {
          setPrescriptions(data.prescriptions || []);
        } else {
          toast.error(data.message || "Failed to load prescriptions");
        }
      } catch (error) {
        console.error("Load prescriptions error:", error);
        toast.error("Failed to load prescriptions");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, [dToken, backendUrl]);

  const deletePrescription = async (prescriptionId) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/prescriptions/doctor`,
        {
          data: { prescriptionId },
          headers: { dToken },
        }
      );

      if (data.success) {
        toast.success(data.message || "Prescription deleted successfully");
        // Reload prescriptions
        const { data: reloadData } = await axios.get(
          `${backendUrl}/api/prescriptions/doctor`,
          {
            headers: { dToken },
          }
        );
        if (reloadData.success) {
          setPrescriptions(reloadData.prescriptions || []);
        }
      } else {
        toast.error(data.message || "Failed to delete prescription");
      }
    } catch (error) {
      console.error("Delete prescription error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete prescription"
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <MoveUpOnRender id="doctor-prescriptions">
      <div className="m-5">
        <h1 className="text-lg font-medium mb-4">Patient Prescriptions</h1>

        <div className="bg-white border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>Loading prescriptions...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No prescriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Appointment
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      File Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescriptions.map((prescription) => (
                    <tr key={prescription._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prescription.user?.image || "/default-avatar.png"}
                            alt={prescription.user?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {prescription.user?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {prescription.user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {prescription.appointment ? (
                          <span className="text-green-600">Linked</span>
                        ) : (
                          <span className="text-gray-400">Not linked</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {prescription.format?.toUpperCase() || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFileSize(prescription.bytes)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(prescription.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={prescription.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm px-3 py-1.5 rounded hover:bg-primary/10 transition-colors cursor-pointer font-medium"
                            title="View prescription in new tab"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </a>
                          <button
                            onClick={() => deletePrescription(prescription._id)}
                            className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MoveUpOnRender>
  );
};

export default DoctorPrescriptions;

