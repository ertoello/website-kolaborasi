import styles from "../../pages/style";
import { logobeopoeng } from "../../assets";
import { footerLinks, socialMedia } from "./constants";

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const Footer = () => (
  <section className="relative w-full bg-gradient-to-r from-[#BEBEBE] via-[#78C1E4] to-[#2B7A98] py-6 px-4 md:px-12 text-white">
    {/* Atas: Logo & Navigasi */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-6 gap-6">
      {/* Logo & Deskripsi */}
      <div className="flex-1">
        <img
          src={logobeopoeng}
          alt="BeoPoeng Logo"
          className="w-[180px] h-auto object-contain"
        />
        <p className="mt-3 text-[#255d74] max-w-[320px] leading-normal text-[14px]">
          Di era digital, teknologi adalah kunci kemajuan desa! Wujudkan masa
          depan digital bersama{" "}
          <span className="text-gray-700">"BeoPoeng"!</span>
        </p>
      </div>

      <div className="flex-[1.5] w-full flex flex-row justify-evenly flex-wrap md:mt-0 mt-8">
        {footerLinks.map((footerlink) => (
          <div
            key={footerlink.title}
            className="flex flex-col ss:my-0 my-3 min-w-[140px]"
          >
            <h4 className="font-poppins font-bold text-[14px] leading-[18px] text-[#eca5a5]">
              {footerlink.title}
            </h4>
            <ul className="list-none mt-3">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`font-poppins font-normal text-[13px] leading-[16px] text-dimWhite hover:text-secondary cursor-pointer ${
                    index !== footerlink.links.length - 1 ? "mb-3" : "mb-0"
                  }`}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bawah: Copyright & Sosial Media */}
    <div className="flex flex-col md:flex-row justify-between items-center pt-5 text-gray-800 text-[13px]">
      <p className="text-center md:text-left">
        &copy;Copyright {new Date().getFullYear()} Yohanes Serpiyanto Elo_BEOPOENG. All Rights Reserved.
      </p>

      {/* Social Media Icons */}
      <div className="flex space-x-5 mt-4 md:mt-0">
        {socialMedia.map((social) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className="w-5 h-5 object-contain cursor-pointer hover:scale-110 transition duration-300"
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
