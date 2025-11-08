import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          nameBn,
          password,
          email,
        });
        console.log("data:", data);
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[320px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg ">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? t('create_account_title') : t('login_title')}
        </p>
        <p>
          {state === "Sign Up" ? t('please_sign_up') : t('please_log_in')}
        </p>

        {state === "Sign Up" && (
          <>
            <div className="w-full">
              <p>{t('full_name')} (English)</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div className="w-full">
              <p>{t('full_name')} (বাংলা) - {t('optional')}</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setNameBn(e.target.value)}
                value={nameBn}
                placeholder="বাংলা নাম (ঐচ্ছিক)"
              />
            </div>
          </>
        )}

        <div className="w-full">
          <p>{t('email')}</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>{t('password')}</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {state === "Sign Up" ? t('create_account_title') : t('login_title')}
        </button>
        {state === "Sign Up" ? (
          <p className="">
            {t('already_have_account')}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              {t('login_here')}
            </span>
          </p>
        ) : (
          <p>
            {t('create_new_account')}
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              {t('click_here')}
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
