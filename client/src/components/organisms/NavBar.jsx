import { NavLink, Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import logoDark from '../../assets/logo-dark.svg';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/cafes', 'My Cafés'], ['/add', 'Add Café / Visit'], ['/profile', 'Profile']];
  return <header className="navbar">
  <div className="nav-inner">
  <Link to="/" className="brand">
      <img src={logoDark} alt=""/>
      <span>Pick &amp; Sip</span>
  </Link>
  <nav className="desktop-nav" aria-label="Main navigation">{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>)}</nav>
  <button className="mobile-menu-button" type="button" aria-label="Open menu" onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</button>
  </div>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>)}</nav>}</header>;
}
