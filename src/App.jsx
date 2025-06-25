import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router';
function App() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
