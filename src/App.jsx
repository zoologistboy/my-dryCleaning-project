import { useEffect } from 'react';
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
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20 pb-20 px-4">
        <Hero />
        <BelowHero />
        <HowWeWork />
        <Testimonials />
        <Pricing />
        <ContactUsForm />
        <Faq />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
