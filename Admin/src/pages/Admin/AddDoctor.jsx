import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import MoveUpOnRender from "../../components/MoveUpOnRender";

const initialValues = {
  name: "",
  nameBn: "",
  email: "",
  password: "",
  experience: "1 Year",
  fees: "",
  about: "",
  aboutBn: "",
  speciality: "General physician",
  specialityBn: "",
  degree: "",
  degreeBn: "",
  address1: "",
  address2: "",
};
const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [doctorData, setDoctorData] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    //const name = e.target.name
    //const value = e.target.value
    const { name, value } = e.target;

    setDoctorData({
      ...doctorData,
      [name]: value,
    });
  };

  const { backendUrl, aToken, getAllDoctors, getDashData } = useContext(AdminContext);

  const handleOnSubmit = async (event) => {
    event.preventDefault(); // not reload funtion

    // Prevent multiple submissions
    if (isLoading) {
      return;
    }

    try {
      // Validation
      if (!docImg) {
        return toast.error("Please select a doctor image");
      }

      // Validate required fields
      if (
        !doctorData.name?.trim() ||
        !doctorData.email?.trim() ||
        !doctorData.password ||
        !doctorData.degree?.trim() ||
        !doctorData.address1?.trim() ||
        !doctorData.address2?.trim() ||
        !doctorData.about?.trim() ||
        !doctorData.fees
      ) {
        return toast.error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(doctorData.email.trim())) {
        return toast.error("Please enter a valid email address");
      }

      // Validate password length
      if (doctorData.password.length < 8) {
        return toast.error("Password must be at least 8 characters long");
      }

      setIsLoading(true);
      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", doctorData.name.trim());
      formData.append("nameBn", doctorData.nameBn?.trim() || "");
      formData.append("email", doctorData.email.trim());
      formData.append("password", doctorData.password);
      formData.append("experience", doctorData.experience);
      formData.append("fees", Number(doctorData.fees));
      formData.append("about", doctorData.about.trim());
      formData.append("aboutBn", doctorData.aboutBn?.trim() || "");
      formData.append("speciality", doctorData.speciality);
      formData.append("specialityBn", doctorData.specialityBn?.trim() || "");
      formData.append("degree", doctorData.degree.trim());
      formData.append("degreeBn", doctorData.degreeBn?.trim() || "");
      formData.append(
        "address",
        JSON.stringify({
          line1: doctorData.address1.trim(),
          line2: doctorData.address2.trim(),
        })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: { aToken },
          onUploadProgress: (progressEvent) => {
            // Optional: Show upload progress
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Doctor added successfully!");
        setDocImg(null);
        setDoctorData(initialValues);
        // Reset file input
        const fileInput = document.getElementById("doc-img");
        if (fileInput) {
          fileInput.value = "";
        }
        getAllDoctors();
        getDashData();
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      console.log("error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add doctor. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MoveUpOnRender id="admin-adddoctor">
      <form onSubmit={handleOnSubmit} className="m-5 w-full">
        <p className="mb-3 text-lg font-medium">Add Doctor</p>

        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll ">
          <div className="flex items-center gap-4 mb-8 text-gray-500">
            <label htmlFor="doc-img">
              <img
                className="w-16 bg-gray-100 rounded-full cursor-pointer "
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setDocImg(e.target.files[0])}
              type="file"
              id="doc-img"
              hidden
            />
            <p>
              Upload Doctor <br /> picture
            </p>
          </div>

          <div className=" flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor name (English)</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  onChange={handleInputChange}
                  value={doctorData.name}
                  name="name"
                  label="name"
                  placeholder="Name (English)"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor name (বাংলা) - Optional</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  onChange={handleInputChange}
                  value={doctorData.nameBn}
                  name="nameBn"
                  label="nameBn"
                  placeholder="নাম (বাংলা)"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Email</p>
                <input
                  className="border rounded px-3 py-2"
                  type="email"
                  value={doctorData.email}
                  onChange={handleInputChange}
                  name="email"
                  label="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Password</p>
                <input
                  className="border rounded px-3 py-2"
                  type="password"
                  placeholder="Password"
                  value={doctorData.password}
                  onChange={handleInputChange}
                  name="password"
                  label="password"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Experience</p>
                <select
                  value={doctorData.experience}
                  onChange={handleInputChange}
                  name="experience"
                  label="experience"
                  className="border rounded px-3 py-2"
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Year">2 Year</option>
                  <option value="3 Year">3 Year</option>
                  <option value="4 Year">4 Year</option>
                  <option value="5 Year">5 Year</option>
                  <option value="6 Year">6 Year</option>
                  <option value="7 Year">7 Year</option>
                  <option value="8 Year">8 Year</option>
                  <option value="9 Year">9 Year</option>
                  <option value="10 Year">10 Year</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Fess</p>
                <input
                  className="border rounded px-3 py-2"
                  type="number"
                  placeholder="Fees"
                  value={doctorData.fees}
                  onChange={handleInputChange}
                  name="fees"
                  label="fees"
                  required
                />
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Speciality (English)</p>
                <select
                  value={doctorData.speciality}
                  onChange={handleInputChange}
                  name="speciality"
                  label="speciality"
                  className="border rounded px-3 py-2"
                  id=""
                >
                  <option value="General physician">General physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatricians">Pediatricians</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Speciality (বাংলা) - Optional</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  value={doctorData.specialityBn}
                  onChange={handleInputChange}
                  name="specialityBn"
                  label="specialityBn"
                  placeholder="বিশেষত্ব (বাংলা)"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Education (English)</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  value={doctorData.degree}
                  onChange={handleInputChange}
                  name="degree"
                  label="degree"
                  placeholder="Education (English)"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Education (বাংলা) - Optional</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  value={doctorData.degreeBn}
                  onChange={handleInputChange}
                  name="degreeBn"
                  label="degreeBn"
                  placeholder="শিক্ষা (বাংলা)"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Address</p>
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  value={doctorData.address1}
                  onChange={handleInputChange}
                  name="address1"
                  label="address1"
                  placeholder="Address 1"
                  required
                />
                <input
                  className="border rounded px-3 py-2"
                  type="text"
                  value={doctorData.address2}
                  onChange={handleInputChange}
                  name="address2"
                  label="address2"
                  placeholder="Address 2"
                  required
                />
              </div>
            </div>
          </div>

          <div className="">
            <p className="mt-4 mb-2">About Doctor (English)</p>
            <textarea
              className="w-full px-4 pt-2 border rounded"
              placeholder="Write about doctor (English)"
              value={doctorData.about}
              onChange={handleInputChange}
              name="about"
              label="about"
              rows={5}
              required
            />
          </div>
          <div className="">
            <p className="mt-4 mb-2">About Doctor (বাংলা) - Optional</p>
            <textarea
              className="w-full px-4 pt-2 border rounded"
              placeholder="ডাক্তার সম্পর্কে লিখুন (বাংলা)"
              value={doctorData.aboutBn}
              onChange={handleInputChange}
              name="aboutBn"
              label="aboutBn"
              rows={5}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-primary px-10 py-3 mt-4 text-white rounded-full transition-all duration-200 ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary/90 hover:scale-105"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Doctor...
              </span>
            ) : (
              "Add Doctor"
            )}
          </button>
        </div>
      </form>
    </MoveUpOnRender>
  );
};

export default AddDoctor;
