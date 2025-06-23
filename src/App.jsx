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


function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  return (
    <AuthProvider>
      <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20 pb-20 px-4">
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


            {/* Add /signin, /verify, etc. here */}
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
