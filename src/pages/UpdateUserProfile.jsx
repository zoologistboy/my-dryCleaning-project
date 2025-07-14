import { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import triggerConfetti from "../components/Celebration"
// import Celebration from "../components/Celebration";
// import Confetti from "react-confetti";

export default function UpdateProfile() {

  const navigate = useNavigate()
  const { profile, updateProfile, loading, error } = useContext(ProfileContext);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [touched, setTouched] = useState({
    fullName: false,
    phoneNumber: false,
    address: false
  });

  // Validation
  const validate = {
    fullName: (value) => value.trim().length >= 3,
    phoneNumber: (value) => /^\d{10,15}$/.test(value),
    address: (value) => value.trim().length >= 5
  };

  const errors = {
    fullName: !validate.fullName(formData.fullName) && touched.fullName,
    phoneNumber: !validate.phoneNumber(formData.phoneNumber) && touched.phoneNumber,
    address: !validate.address(formData.address) && touched.address
  };

  const isFormValid = Object.values(errors).every(error => !error) && 
                     Object.values(formData).every(field => field.trim().length > 0);

  // Populate fields when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
      if (profile.profilePictureUrl) {
        setPreview(profile.profilePictureUrl);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }
      
      // Validate file type
      if (!file.type.match("image.*")) {
        toast.error("Only image files are allowed");
        return;
      }

      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    try {
      await updateProfile(formData, profilePicture);//localhost
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
      toast.success("Profile updated successfully!")
      
      triggerConfetti("firework")
      
      
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
      setPreview(profile.profilePictureUrl || "");
      setProfilePicture(null);
    }
    setTouched({
      fullName: false,
      phoneNumber: false,
      address: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center">
          Update Profile
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500 dark:border-red-400" : ""
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Full name must be at least 3 characters
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, phoneNumber: true }))}
              placeholder="Enter your phone number"
              className={`w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phoneNumber ? "border-red-500 dark:border-red-400" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Please enter a valid phone number (10-15 digits)
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Address *
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
              placeholder="Enter your delivery address"
              className={`w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500 dark:border-red-400" : ""
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Address must be at least 5 characters
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded hover:file:bg-blue-700 dark:file:bg-blue-500 dark:file:hover:bg-blue-600"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Max 2MB. JPG, PNG, or GIF.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}