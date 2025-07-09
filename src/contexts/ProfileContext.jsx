// src/contexts/ProfileContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "sonner";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3550/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data.data);
      // console.log(res.data.data);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData, profilePicture) => {
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      const res = await axios.put(
        "http://localhost:3550/api/auth/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.data);
      toast.success(res.data.message || "Profile updated successfully!");
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = () => {
    setProfile(null);
    setError(null);
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      resetProfile();
    }
  }, [token]);

  return (
    <ProfileContext.Provider 
      value={{ 
        profile, 
        loading, 
        error,
        updateProfile, 
        fetchProfile,
        resetProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;