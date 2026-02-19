import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    loggedUser,
    setLoggedUser,
  } = useContext(ShopContext);

  const dropdownRef = useRef();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    setToken("");
    setLoggedUser("");
    setCartItems({});
    navigate("/login");
  };

  const handleSearchIcon = () => {
    setShowSearch(true);
    navigate("/collection");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium sticky top-0 bg-gray-50 px-2 z-50">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
        </NavLink>
      </ul>

     
      <div className="flex items-center gap-6">
     
        <img
          onClick={handleSearchIcon}
          src={assets.search_icon}
          className="cursor-pointer w-5"
          alt=""
        />

       
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={() => !isMobile && token && setOpen(true)}
          onMouseLeave={() => !isMobile && setOpen(false)}
        >
          <img
            onClick={() => {
              if (!token) {
                navigate("/login");
              } else if (isMobile) {
                setOpen(!open);
              }
            }}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />

          {open && (
            <div className="absolute right-0 pt-4 z-50">
              <div className="flex flex-col w-44 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                {token && (
                  <>
                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                      <p className="font-semibold text-gray-800 text-sm">
                        {loggedUser?.name}
                      </p>
                      <p className="text-xs text-gray-500 break-all">
                        ({loggedUser?.email})
                      </p>
                    </div>

                    <div className="flex flex-col text-sm text-gray-600">
                      <a
                       href="https://forever-ecom-indra-admin.vercel.app/orders"
                       target="_blank"  
                        className="text-left px-5 py-3 hover:bg-gray-100 hover:text-black transition"
                      >
                        Admin Panel
                      </a>

                      <button
                        onClick={() => navigate("/orders")}
                        className="text-left px-5 py-3 hover:bg-gray-100 hover:text-black transition"
                      >
                        Orders
                      </button>

                      <button
                        onClick={logout}
                        className="text-left px-5 py-3 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) }
              </div>
            </div>
          )}
        </div>

     
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square text-[8px] rounded-full">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 cursor-pointer">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt=""
            />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/">
            Home
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            Collection
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            About
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
