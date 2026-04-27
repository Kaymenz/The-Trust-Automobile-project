import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, activePage }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Hide the main site chrome (nav + footer) on dashboard-style pages
  const hideShell = pathname.startsWith('/dashboard') || pathname.startsWith('/portals');

  return (
    <>
      {!hideShell && <Navbar activePage={activePage} />}
      <main>{children}</main>
      {!hideShell && <Footer />}
    </>
  );
}
