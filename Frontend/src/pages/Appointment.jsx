import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import SlotSelector from "../components/SlotSelector";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, backendUrl, getDoctorsData } =
    useContext(AppContext);
  const { t } = useTranslation();
  const daysOfWeek = ["SUN", "MON", "TUE", "WEND", "THE", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [docSlots]);
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const checkSlotAvailable = (docInfo, slotDate, slotTime) => {
    if (!docInfo || !docInfo.slots_booked) return true; // if  docinfo is null
    return !docInfo.slots_booked?.[slotDate]?.includes(slotTime);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    const today = new Date();

    const generateSlotDate = (date) =>
      `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Set the start time
      if (i === 0) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const slotDate = generateSlotDate(currentDate);
        const isAvailable = checkSlotAvailable(
          docInfo,
          slotDate,
          formattedTime
        );

        if (isAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: isAvailable ? formattedTime : undefined,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // If no available slots, add a placeholder
      if (timeSlots.length === 0) {
        timeSlots.push({ datetime: new Date(currentDate), time: false });
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn(t('please_login_book'));
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.error(t('please_select_slot'));
    }
    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };
  return (
    docInfo && (
      <div className="px-2 xs:px-4 sm:px-0">
        {/* --------------Doctor Details ----------------- */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6">
          <div className="w-full sm:w-auto lg:w-auto">
            <img
              className="bg-primary w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-4 sm:p-6 md:p-8 bg-white mx-0 sm:mx-2 lg:mx-0 mt-0 sm:mt-[-60px] lg:mt-0">
            {/* --------------- Doc info name , degree , experience      --------------- */}
            <p className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
              {i18n.language === 'bn' && docInfo.nameBn ? docInfo.nameBn : docInfo.name}
              <img className="w-4 sm:w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-1 text-gray-600">
              <p>
                {(i18n.language === 'bn' && docInfo.degreeBn ? docInfo.degreeBn : docInfo.degree)} - {(i18n.language === 'bn' && docInfo.specialityBn ? docInfo.specialityBn : docInfo.speciality)}
              </p>
              <button className="py-0.5 px-2 border text-[10px] xs:text-xs rounded-full">
                {docInfo.experience}{" "}
              </button>
            </div>

            {/* ------------- Doctor About */}
            <div className="mt-3 sm:mt-4">
              <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-900">
                {t('about')} <img className="w-3 sm:w-4" src={assets.info_icon} alt="" />
              </p>
              <p className="text-xs sm:text-sm text-gray-500 max-w-full lg:max-w-[700px] mt-1 sm:mt-2">
                {i18n.language === 'bn' && docInfo.aboutBn ? docInfo.aboutBn : docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-3 sm:mt-4 text-xs sm:text-sm md:text-base">
              {t('appointment_fee')}{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>{" "}
            </p>
          </div>
        </div>

        {/* ---------- Booking slots */}

        <div className="lg:ml-0 xl:ml-72 xl:pl-4 mt-4 sm:mt-6 font-medium text-gray-700">
          <p className="text-sm sm:text-base md:text-lg">{t('booking_slots')}</p>
          <div className="flex gap-2 sm:gap-3 items-center w-full overflow-x-auto mt-3 sm:mt-4 pb-2">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-4 sm:py-5 md:py-6 min-w-14 sm:min-w-16 rounded-full cursor-pointer text-xs sm:text-sm ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <SlotSelector
            docSlots={docSlots}
            slotIndex={slotIndex}
            slotTime={slotTime}
            setSlotTime={setSlotTime}
          />
          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-xs sm:text-sm font-light px-6 sm:px-10 md:px-14 py-2 sm:py-2.5 md:py-3 rounded-full my-4 sm:my-5 w-full sm:w-auto"
          >
            {t('book_an_appointment')}
          </button>
        </div>

        {/* ------------------listing related doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
