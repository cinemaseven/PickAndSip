import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, Link } from 'react-router';
import logoDark from '../../assets/logo-dark.svg';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const links = [
    ['/', 'Home'],
    ['/cafes', 'My Cafés'],
    ['/add', 'Add Café / Visit'],
    ['/profile', 'Profile']
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <img src={logoDark} alt="" />
          <span>Pick &amp; Sip</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
        >
          {open ? (
            <X size={26} strokeWidth={2.2} />
          ) : (
            <Menu size={28} strokeWidth={2.2} />
          )}
        </button>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}