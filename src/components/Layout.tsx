import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default Layout;
