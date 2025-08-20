import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        // formData me naya avatar store
        const updatedUser = { ...currentUser, avatar: data.secure_url };

        // Redux me update karo
        dispatch(signInSuccess(updatedUser));

        setFormData({ ...formData, avatar: data.secure_url });
        setFilePerc(100);
        setFileUploadError(false);
      } else {
        setFileUploadError(true);
      }
    } catch (error) {
      console.error(error);
      setFileUploadError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => handleFileUpload(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {filePerc > 0 && filePerc < 100 && <p>Uploading: {filePerc}%</p>}
        {filePerc === 100 && (
          <p className="text-green-600">Upload complete!</p>
        )}
        {fileUploadError && (
          <p className="text-red-600">Upload failed. Try again.</p>
        )}

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />

        <button className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
    </div>
  );
}
