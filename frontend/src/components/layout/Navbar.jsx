import { Link, NavLink } from 'react-router-dom';
import Logo from '../../assets/logo.svg';  

export default function Navbar() {
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 font-bold text-xl text-indigo-600">ShareNest</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-indigo-600 font-medium'
                    : 'text-gray-600 hover:text-indigo-600'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button (optional) */}
        {/* <button>☰</button> */}
      </nav>
    </header>
  );
}