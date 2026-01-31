import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Tech, Works, StarsCanvas } from "./components";
import NavbarDemo from "./components/Navbar"; // Import the new navbar
import Hackthons from "./components/Hackthons"; // Import Hackthons component

// Main Portfolio Page Component
const MainPage = () => {
  return (
    <>
      {/* Navbar only on main page */}
      <NavbarDemo />

      <div className='relative z-0 bg-primary '>
        {/* Changed to use your custom color */}
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center  ' >
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Contact />
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hackathons" element={<Hackthons />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;