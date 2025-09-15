import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai'; // Import the icon
import { MdOutlineCancel } from 'react-icons/md';
import { SiShopware } from 'react-icons/si';
import logo from '../data/jeevanrakshak-logo.svg';
// import { NavLink } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { links } from '../data/dummy';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-4 pl-4 pr-3 py-2.5 rounded-xl text-white text-[15px] m-2 shadow-sm';
  const normalLink = 'flex items-center gap-4 pl-4 pr-3 py-2.5 rounded-xl text-[15px] text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 transition-colors';

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <img src={logo} alt="JeevanRakshak" className="h-8 w-auto" />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-8">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}

            {/* GIS-Mapping section */}
            <div key="GISMapping">
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                GIS-Mapping
              </p>
              <a
                href="https://health-rakshak.vercel.app/"
                onClick={handleCloseSideBar}
                className={window.location.pathname.includes('gisTracking') ? activeLink : normalLink}
              >
                <AiOutlineShoppingCart />
                <span className="capitalize ">gisTracking</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
