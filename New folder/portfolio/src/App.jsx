import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Tech, Works, StarsCanvas } from "./components";
import NavbarDemo from "./components/Navbar"; // Import the new navbar

const App = () => {
  return (
    <BrowserRouter>
        {/* New Navbar */}
  
    
        
        {/* Main Content */}
        <div className='relative z-0 bg-primary '>
            {/* Changed to use your custom color */}
          <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center  ' >
            <NavbarDemo />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Feedbacks />
          <div className='relative z-0'>
            <Contact />
            <StarsCanvas />
          </div>
        </div>

    </BrowserRouter>
  );
}

export default App;