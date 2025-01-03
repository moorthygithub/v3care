import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import DashboardNavbar from "../components/DashboardNavbar";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [openSideNav, setOpenSideNav] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleCollapseChange = (newState) => {
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

 
 
 
  // xl:ml-80
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 ">
      <SideNav openSideNav={openSideNav} setOpenSideNav={setOpenSideNav}     isCollapsed={isCollapsed} />
      <div className={`p-4 ${isCollapsed ? 'xl:ml-28' : 'xl:ml-72'} transition-all duration-300`}>
        <DashboardNavbar
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleCollapseChange}
        />
        {children}
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
      {/* {(useType === "1" ||
        useType === "5" ||
        useType === "6" ||
        useType === "7") && (
        <button
          className="fixed bottom-12 right-6 bg-gradient-to-r  from-purple-500 to-indigo-400 transform -translate-y-1 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition duration-300  "
          onClick={() => navigate("/add-booking")}
        >
          + Add Booking
        </button>
      )} */}
    </div>
  );
};

export default Layout;

// bg-gradient-to-br from-blue-200 to-gray-100
