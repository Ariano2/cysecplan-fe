import { Link, useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    let theme = localStorage.getItem('theme');
    theme = theme === 'cupcake' ? 'dark' : 'cupcake';
    localStorage.setItem('theme', theme);
    location.reload();
  };

  const handleDashboardRedirect = () => {
    const token = Cookies.get('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'participant') {
      navigate('/participant');
    } else {
      navigate('/login'); // fallback
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <header className="navbar bg-base-100 shadow-sm px-6">
      <div className="flex-1">
        <button className="btn btn-ghost md:text-xl font-semibold tracking-tight">
          CyberSecPlan Portal
        </button>
      </div>

      <nav className="flex-none">
        <ul className="menu menu-horizontal items-center gap-2">
          <li className="tooltip tooltip-bottom" data-tip="Toggle Theme">
            <input
              type="checkbox"
              onChange={handleThemeToggle}
              className="toggle border-indigo-600 bg-indigo-500 checked:border-white checked:bg-white checked:text-gray-600"
            />
          </li>

          <li>
            <Link to="/login" className="font-medium hover:text-primary">
              Login
            </Link>
          </li>

          <li>
            <button
              onClick={handleDashboardRedirect}
              className="btn btn-ghost font-medium hidden md:inline"
            >
              Dashboard
            </button>
          </li>

          <li>
            <details>
              <summary className="cursor-pointer font-medium">Menu</summary>
              <ul className="p-2 bg-base-100 rounded-t-none w-44 z-10">
                <li>
                  <button onClick={handleLogout} className="text-left">
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
