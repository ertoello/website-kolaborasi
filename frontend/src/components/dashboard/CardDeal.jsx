import { FaComments, FaUsers, FaBell, FaHeadset } from "react-icons/fa";
import styles from "../../pages/style";
import {chatfeature} from "../../assets";
import Button from "./Button";

const ChatFeature = () => {
  return (
    <section
      id="KOMUNIKASI CEPAT & INTERAKTIF"
      className={`py-16 px-6 rounded-2xl ${styles.flexCenter} flex-col md:flex-row`}
    >
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-[42px] font-bold text-[#145C75] leading-[50px]">
          🗨️ FITUR CHAT – Komunikasi Cepat & Interaktif
        </h2>
        <p className="text-[18px] text-[#000000] leading-[28px] mt-4 max-w-[500px]">
          Bangun koneksi, wujudkan ide, dan kembangkan komunitas digital dengan
          fitur chat real-time kami!
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-3 bg-[#EAEAEA] p-4 rounded-lg shadow">
            <FaUsers size={24} className="text-[#3FA3CE]" />
            <span className="text-[#2B7A98] font-medium">
              Diskusi Komunitas
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-[#EAEAEA] p-4 rounded-lg shadow">
            <FaComments size={24} className="text-[#EF8B8B]" />
            <span className="text-[#C06C6C] font-medium">
              Kolaborasi Instan
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-[#EAEAEA] p-4 rounded-lg shadow">
            <FaHeadset size={24} className="text-[#145C75]" />
            <span className="text-[#525252] font-medium">
              Dukungan & Bantuan
            </span>
          </div>
          <div className="flex items-center space-x-3 bg-[#EAEAEA] p-4 rounded-lg shadow">
            <FaBell size={24} className="text-[#FF9999]" />
            <span className="text-[#BF5F5F] font-medium">
              Notifikasi & Update
            </span>
          </div>
        </div>
        <Button styles="mt-10" />
      </div>
      <div className="flex-1 flex justify-center mt-8 md:mt-0">
        <img
          src={chatfeature}
          alt="Fitur Chat"
          className="w-full max-w-[900px] rounded-lg"
        />
      </div>
    </section>
  );
};

export default ChatFeature;
