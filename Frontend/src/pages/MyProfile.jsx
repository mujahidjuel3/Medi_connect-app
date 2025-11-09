import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import MoveUpOnRender from "../components/MoveUpOnRender";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const MyProfile = () => {
  const { backendUrl, token, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);
  const { t } = useTranslation();

  const [isEdit, setEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("nameBn", userData.nameBn || "");
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        loadUserProfileData();
        setEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <MoveUpOnRender id="my-profile">
        <div className="max-w-full sm:max-w-lg flex flex-col gap-2 text-xs sm:text-sm px-2 xs:px-4 sm:px-0">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-24 xs:w-28 sm:w-32 md:w-36 rounded opacity-60"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img
                  className="w-8 sm:w-10 absolute bottom-8 sm:bottom-10 md:bottom-12 right-8 sm:right-10 md:right-12"
                  src={image ? "" : assets.upload_icon}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img className="w-24 xs:w-28 sm:w-32 md:w-36 rounded" src={userData.image} alt="" />
          )}
          {isEdit ? (
            <>
              <input
                className="bg-gray-50 text-lg sm:text-2xl md:text-3xl font-medium max-w-full sm:max-w-60 mt-3 sm:mt-4 capitalize px-2 py-1 rounded"
                value={userData.name}
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="English Name"
              />
              <input
                className="bg-gray-50 text-lg sm:text-2xl md:text-3xl font-medium max-w-full sm:max-w-60 mt-2 px-2 py-1 rounded"
                value={userData.nameBn || ""}
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, nameBn: e.target.value }))
                }
                placeholder="বাংলা নাম (ঐচ্ছিক)"
              />
            </>
          ) : (
            <p className="font-medium text-xl sm:text-2xl md:text-3xl text-neutral-800 mt-3 sm:mt-4 capitalize">
              {i18n.language === 'bn' && userData.nameBn ? userData.nameBn : userData.name}
            </p>
          )}
          <hr className="bg-zinc-400 h-[1px] border-none mt-2 sm:mt-3" />
          <div>
            <p className="text-neutral-500 underline mt-3 sm:mt-4 text-xs sm:text-sm">
              {t('contact_information')}
            </p>
            <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr] gap-y-2 sm:gap-y-2.5 mt-3 text-neutral-700 text-xs sm:text-sm">
              <p className="font-medium">{t('email_id')}</p>
              <p className="text-blue-500 break-all">{userData.email}</p>
              <p className="font-medium">{t('phone')}</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-full sm:max-w-52 px-2 py-1 rounded"
                  value={userData.phone}
                  type="text"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-blue-500">{userData.phone}</p>
              )}

              <p className="font-medium">{t('address')}</p>
              {isEdit ? (
                <div className="flex flex-col gap-2">
                  <input
                    className="bg-gray-50 px-2 py-1 rounded"
                    value={userData.address?.line1}
                    type="text"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    className="bg-gray-50 px-2 py-1 rounded"
                    value={userData.address?.line2}
                    type="text"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  {userData.address?.line1}
                  {userData.address?.line2 && (
                    <>
                      <br />
                      {userData.address.line2}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-neutral-500 underline mt-3 sm:mt-4 text-xs sm:text-sm">{t('basic_information')}</p>
            <div className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_3fr] gap-y-2 sm:gap-y-2.5 mt-3 text-neutral-700 text-xs sm:text-sm">
              <p className="font-medium">{t('gender')}</p>
              {isEdit ? (
                <select
                  className="max-w-full sm:max-w-20 bg-gray-100 px-2 py-1 rounded"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              ) : (
                <p className="text-gray-400">{userData.gender}</p>
              )}

              <p className="font-medium">{t('birthday')}</p>
              {isEdit ? (
                <input
                  className="max-w-full sm:max-w-28 bg-gray-100 px-2 py-1 rounded"
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-400">{userData.dob}</p>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            {isEdit ? (
              <button
                className="border border-primary px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-100 text-xs sm:text-sm"
                onClick={updateUserProfileData}
              >
                {t('save_information')}
              </button>
            ) : (
              <button
                className="border border-primary px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-100 text-xs sm:text-sm"
                onClick={() => setEdit(true)}
              >
                {t('edit')}
              </button>
            )}
          </div>
        </div>
      </MoveUpOnRender>
    )
  );
};

export default MyProfile;
