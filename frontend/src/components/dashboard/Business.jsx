import { features } from "./constants";
import styles, { layout } from "../../pages/style";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { FaHandsHelping, FaChartLine } from "react-icons/fa";


const FeatureCard = ({
  icon: IconComponent,
  title,
  content,
  index,
  totalFeatures,
}) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
      index !== totalFeatures - 1 ? "mb-6" : "mb-0"
    } bg-gradient-to-r from-[#2B7A98] to-[#BF5F5F] shadow-lg`}
  >
    <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center bg-[#F4F4F4] shadow-md">
      <IconComponent className="text-[#145C75] text-4xl" />
    </div>
    <div className="flex-1 flex flex-col ml-5">
      <h4 className="font-poppins font-bold text-[#FFFFFF] text-[20px] leading-[26px] mb-2">
        {title}
      </h4>
      <p className="font-poppins text-[#EAEAEA] text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
);

const Business = () => (
  <section id="KOLABORASI & INOVASI" className={`${layout.section} py-12`}>
    <div
      className={`${layout.sectionInfo} bg-[#2B7A98] p-8 rounded-lg self-start`}
    >
      <h2 className="text-[36px] font-bold text-[#FFFFFF] leading-[44px] mb-4">
        KOLABORASI & INOVASI <br />
        <span className="font-poppins font-semibold ss:text-[16px] text-[14px] text-[#66B2D6] ss:leading-[24px] leading-[22px] w-full mt-1 flex items-center">
          <FaHandsHelping className="text-[#66B2D6] text-[20px] mr-2" />
          Terhubung, Berinovasi, Kembangkan Komunitas Digital
          <FaChartLine className="text-[#66B2D6] text-[20px] ml-2" />
        </span>
      </h2>
      <p className="text-[18px] text-[#000000] leading-[28px]">
        Di era digital, inovasi dan kolaborasi menjadi fondasi utama untuk
        menciptakan perubahan.
        <span className="font-semibold text-[#BEBEBE]">
          {" "}
          Bersama, kita dapat membangun solusi yang lebih cerdas
        </span>
        , berbagi wawasan, dan mempercepat pertumbuhan komunitas.
      </p>

      <Link
        to="/login"
        className="mt-8 bg-[#BEBEBE] hover:bg-[#F4F4F4] text-[#145C75] shadow-md px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
      >
        Jelajahi Sekarang
        <FiArrowRight className="text-[#145C75] text-xl" />
      </Link>
    </div>

    <div className={`${layout.sectionImg} flex-col mt-10`}>
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id}
          {...feature}
          index={index}
          totalFeatures={features.length}
        />
      ))}
    </div>
  </section>
);

export default Business;
