import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { assets } from "../assets/assets";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
    // Check for payment status in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success(t('payment_success'));
      getUserAppointments();
      // Clean URL
      window.history.replaceState({}, document.title, '/my-appointments');
    } else if (paymentStatus === 'failed') {
      toast.error(t('payment_failed'));
      window.history.replaceState({}, document.title, '/my-appointments');
    } else if (paymentStatus === 'cancelled') {
      toast.info(t('payment_cancelled'));
      window.history.replaceState({}, document.title, '/my-appointments');
    }
  }, [token]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dataArray = slotDate.split("_");
    return (
      dataArray[0] + " " + months[Number(dataArray[1])] + " " + dataArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancle-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  // handle razorpay payment
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          console.log("error:", error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
  };

  // handle razorpay payment
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  // handle SSLCommerz payment
  const appointmentSSLCommerz = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-sslcommerz",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success && data.gatewayUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = data.gatewayUrl;
      } else {
        toast.error(data?.message || t('payment_initiation_failed'));
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message || t('payment_initiation_failed'));
    }
  };

  //handle navigation
  const handleNavigation = (docId) => {
    navigate(`/appointment/${docId}`);
  };

  return (
    <div className="px-2 xs:px-4 sm:px-0">
      <p className="pb-2 sm:pb-3 mt-8 sm:mt-10 md:mt-12 font-medium text-zinc-700 border-b text-sm sm:text-base md:text-lg">
        {t('my_appointments_title')}
      </p>

      <MoveUpOnRender id="my-appointments">
        {appointments.map((item, index) => (
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 py-3 sm:py-4 border-b"
            key={index}
          >
            <div onClick={() => handleNavigation(item?.docData?._id)} className="flex-shrink-0">
              <img
                className="w-24 xs:w-28 sm:w-32 md:w-36 bg-indigo-50 rounded-lg cursor-pointer"
                src={item?.docData?.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-xs sm:text-sm text-zinc-500 min-w-0">
              <p className="text-neutral-800 font-semibold text-sm sm:text-base md:text-lg">
                {i18n.language === 'bn' && item?.docData?.nameBn ? item?.docData?.nameBn : item?.docData?.name}
              </p>
              <p className="text-xs sm:text-sm mt-0.5 sm:mt-1">
                {i18n.language === 'bn' && item?.docData?.specialityBn ? item?.docData?.specialityBn : item?.docData?.speciality}
              </p>
              <p className="text-zinc-700 font-medium mt-2 sm:mt-3 text-xs sm:text-sm">{t('address')}:</p>
              <p className="text-[10px] xs:text-xs">{item?.docData?.address?.line1}</p>
              <p className="text-[10px] xs:text-xs">{item?.docData?.address?.line2 || item?.docData?.address?.line1}</p>
              <p className="text-[10px] xs:text-xs mt-1 sm:mt-2">
                <span className="text-xs sm:text-sm text-neutral-700 font-medium">
                  {t('date_time')}
                </span>{" "}
                {slotDateFormat(item?.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:gap-2.5 justify-start sm:justify-end w-full sm:w-auto sm:min-w-[140px] md:min-w-[180px]">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="text-xs sm:text-sm text-stone-500 text-center w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border bg-indigo-50 rounded">
                  {t('paid')}
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentSSLCommerz(item?._id)}
                  className="text-xs sm:text-sm text-stone-500 text-center w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border hover:bg-primary hover:text-white transition duration-300 rounded"
                >
                  {t('pay_online')}
                </button>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-xs sm:text-sm text-stone-500 text-center w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border hover:bg-red-600 hover:text-white transition duration-300 rounded"
                >
                  {t('cancel_appointment')}
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border border-red-500 rounded text-red-500 text-xs sm:text-sm">
                  {t('appointment_cancelled')}
                </button>
              )}
              {item.isCompleted && (
                <button className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border border-green-500 rounded text-green-500 text-xs sm:text-sm">
                  {t('completed')}
                </button>
              )}
              
              {/* Chat and Prescription buttons */}
              {!item.cancelled && (
                <>
                  <button
                    onClick={() => navigate(`/chat?doctorId=${item.docData?._id}`)}
                    className="text-xs sm:text-sm text-center w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 rounded"
                  >
                    <img src={assets.chats_icon} className="w-3 h-3 sm:w-4 sm:h-4" alt="" />
                    {t('chat')}
                  </button>
                  <button
                    onClick={() => navigate(`/prescription?appointmentId=${item._id}`)}
                    className="text-xs sm:text-sm text-center w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px] lg:min-w-[180px] py-1.5 sm:py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 rounded"
                  >
                    <img src={assets.upload_icon} className="w-3 h-3 sm:w-4 sm:h-4" alt="" />
                    {t('prescription')}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </MoveUpOnRender>
    </div>
  );
};

export default MyAppointments;
