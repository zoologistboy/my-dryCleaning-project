import { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BelowHero from './components/BelowHero';
import HowWeWork from './components/HowWeWork';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import ContactUsForm from './components/ContactUsForm';
import Faq from './components/Faq';
import ScrollToTop from './components/ScrollToTop';
import SignUp from './pages/SignUpPage';
// import SignUp from './pages/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailVerify from './pages/EmailVerify';
import EmailSent from './pages/EmailSent';
import SignInPage from './pages/SiginPage';
import NotFound from './pages/ErrorPage';
import AuthProvider from './contexts/AuthContext';
import CustomerDashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import UpdateProfile from './pages/UpdateUserProfile';
import { ProfileProvider } from '../src/contexts/ProfileContext';
import AuthRedirectHandler from './components/AuthRedirection';
import BookService from './pages/Book';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import { Schedule } from '@mui/icons-material';
import Confirmation from './pages/Confirmation';
import WalletPage from './pages/Wallet';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import { SocketProvider } from '../src/contexts/SocketContext';


function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  return (
    <AuthProvider>
      {/* <AuthRedirectHandler> */}
    <ProfileProvider>
      <SocketProvider>
      <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20 pb-20 px-4">
           <AuthRedirectHandler />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <BelowHero />
                  <div id='services'><HowWeWork /></div>
                  <Testimonials />
                  <div id='pricing'> <Pricing/></div>
                  <div id='contactUs'><ContactUsForm /></div>
                  <Faq />
                </>
              }
            />
           <Route path="/signup" element={<SignUp />} />
           <Route path="/verify/:token" element={<EmailVerify />} />
           <Route path="/email-sent" element={<EmailSent />} />
           <Route path="/signin" element={<SignInPage />} />
           <Route path="*" element={<NotFound/>} />
           <Route path="/dashboard" element={<CustomerDashboard />} />
           <Route path="/profile" element={<UpdateProfile />} />
           <Route path="/Book" element={<BookService />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/home" element={<Home />} />
           <Route path="/support" element={<ContactUs />} />
           <Route path="/schedule" element={<Schedule />} />
           <Route path="/confirmation" element={<Confirmation />} />
           <Route path="/orders" element={<OrderHistory/>} />
           <Route path="/wallet/topup" element={<WalletPage />} />
           <Route path="/orders/:id" element={<OrderDetails />} />




            {/* Add /signin, /verify, etc. here */}
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <Toaster richColors visibleToasts={1}/>
      </div>
    </Router>
    </SocketProvider>
    </ProfileProvider>
    {/* </AuthRedirectHandler> */}
    </AuthProvider>
  );
}

export default App;
