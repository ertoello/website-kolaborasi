import { useState } from "react";
import { close, logobeopoeng, menu } from "../../assets";
import { navLinks } from "./constants";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  // Fungsi untuk scroll dengan offset agar tidak tertutup navbar
  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    const navbarHeight = 64; // Sesuaikan dengan tinggi navbar

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
      setActive(id);
      setToggle(false); // Tutup menu di mobile setelah klik
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#000000]/30 backdrop-blur-md py-3 sm:px-10 px-4 z-50 flex justify-between items-center shadow-lg transition-all duration-300">
      <img src={logobeopoeng} alt="beopoeng" className="w-[130px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1 space-x-6">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className={`font-poppins font-medium cursor-pointer sm:text-[14px] text-[12px] transition-all duration-300 ${
              active === nav.id
                ? "text-white border-b-2 border-white pb-1"
                : "text-[#3E3E3E] hover:text-white"
            }`}
            onClick={() => handleNavClick(nav.id)}
          >
            {nav.title}
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <div className="sm:hidden flex items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[24px] h-[24px] object-contain cursor-pointer"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`absolute top-14 right-4 w-40 bg-black p-3 rounded-xl transition-all ${
            toggle ? "block" : "hidden"
          }`}
        >
          <ul className="list-none flex flex-col space-y-3">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[14px] transition-all duration-300 ${
                  active === nav.id
                    ? "text-white border-b-2 border-white pb-1"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleNavClick(nav.id)}
              >
                {nav.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
