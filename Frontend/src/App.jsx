import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Chat from "./pages/Chat";
import Prescription from "./pages/Prescription";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";
import axios from "axios";
import TopLoadingBar from "./components/TopLoadingBar";
import { useTranslation } from 'react-i18next';

const App = () => {
  const { isLoading, setIsLoading } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <>
      {isLoading && <TopLoadingBar message={t('loading')} />}
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/doctors" element={<Doctors />}></Route>
          <Route path="/doctors/:speciality" element={<Doctors />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
          <Route path="/my-profile" element={<MyProfile />}></Route>
          <Route path="/my-appointments" element={<MyAppointments />}></Route>
          <Route path="/appointment/:docId" element={<Appointment />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/prescription" element={<Prescription />}></Route>
          <Route path="*" element={<div>{t('not_found')}</div>} />
        </Routes>
        <Footer />
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
