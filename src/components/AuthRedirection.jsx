// components/AuthRedirectHandler.jsx
import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ProfileContext } from "../contexts/ProfileContext";
import { toast } from "sonner";

export default function AuthRedirectHandler() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { profile, loading: profileLoading } = useContext(ProfileContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run checks when auth and profile data are fully loaded
    if (authLoading || profileLoading) return;

    if (user && profile) {
      const requiredProfileFields = ['fullName', 'address', 'phoneNumber'];
      const isIncompleteProfile = requiredProfileFields.some(
        field => !profile[field] || profile[field].trim() === ''
      );

      const protectedRoutes = ['/checkout', '/account'];
      const isOnProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );

      const isOnUpdateProfilePage = location.pathname === '/update-profile';

      if (isIncompleteProfile && (isOnProtectedRoute || isOnUpdateProfilePage)) {
        navigate('/update-profile', {
          state: { 
            from: location.pathname,
            message: 'Please complete your profile to continue'
          }
        });
        toast.warning('Please complete your profile information');
      }
    } else if (!user) {
      // Handle case where user is not logged in but trying to access protected routes
      const authRequiredRoutes = ['/account', '/checkout', '/update-profile'];
      if (authRequiredRoutes.some(route => location.pathname.startsWith(route))) {
        navigate('/login', {
          state: { from: location.pathname }
        });
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, location]);

  return null;
}