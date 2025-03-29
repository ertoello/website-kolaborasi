import styles from "../../pages/style";
import { villageTech, innovation, overlay1, overlay2 } from "../../assets";
import GetStarted from "./GetStarted";
import {FaHome, FaChartLine} from "react-icons/fa";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="BERANDA"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row items-center py-[8px] px-5 bg-[#3FA3CE] rounded-[12px] mb-4 shadow-xl">
          <img
            src={innovation}
            alt="innovation"
            className="w-[50px] h-[50px] mr-3"
          />
          <p
            className={`${styles.paragraph} text-white font-medium text-base leading-[22px]`}
          >
            Platform Kolaboratif untuk Pemberdayaan Masyarakat dan Personal
            Branding
          </p>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-bold ss:text-[42px] text-[38px] text-[#FFFFFF] ss:leading-[60px] leading-[50px]">
            <span className="text-[#191919]">
              wujudkan masa depan digital bersama
            </span>
            &nbsp;
            <span className="text-[#FF9999] font-bold">"Beopoeng"!</span>
            <br className="sm:block hidden" />
          </h1>

          <div className="ss:flex hidden md:mr-4 mr-0">
            <GetStarted />
          </div>
        </div>

        <h2 className="font-poppins font-semibold ss:text-[18px] text-[16px] text-[#66B2D6] ss:leading-[26px] leading-[24px] w-full mt-1 flex items-center">
          <FaHome className="text-[#66B2D6] text-[20px] mr-2" />
          Membangun Desa Maju, Mandiri, dan Berdaya Saing!
          <FaChartLine className="text-[#66B2D6] text-[20px] ml-2" />
        </h2>
        <p
          className={`${styles.paragraph} max-w-[570px] mt-5 text-[#000000] text-base leading-6`}
        >
          Di era digital, teknologi adalah kunci kemajuan desa! Dengan
          "Beopoeng", kami menghubungkan komunitas desa dengan solusi digital
          inovatif untuk menciptakan ekosistem yang lebih produktif dan berdaya
          saing.
        </p>
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <Link to="/login">
          <GetStarted />
        </Link>
      </div>

      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <img
          src={villageTech}
          alt="digital-village"
          className="w-[100%] h-[100%] relative z-[5] rounded-lg"
        />

        {/* Layered Images */}
        <img
          src={overlay1}
          alt="overlay-1"
          className="absolute w-[60%] h-[60%] top-5 left-5 opacity-50"
        />
        <img
          src={overlay2}
          alt="overlay-2"
          className="absolute w-[70%] h-[70%] bottom-5 right-5 opacity-30"
        />
      </div>
    </section>
  );
};

export default Hero;
