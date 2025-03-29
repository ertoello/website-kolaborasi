import styles from "../../pages/style";
import brandingImage from "../../assets/branding.png";
import networkImage from "../../assets/network.png";
import { Link } from "react-router-dom";

const BrandingSection = () => (
  <section
    id="PROFIL & BRANDING"
    className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
  >
    <div className="absolute w-[60%] h-[60%] -right-[50%] rounded-full bg-[#3FA3CE] opacity-20 bottom-40" />

    <div className="w-full flex flex-col md:flex-row justify-center items-center mb-3">
      <div className="max-w-[600px] text-center md:text-left">
        <h2 className="text-[#145C75] font-bold text-[36px] md:text-[48px] leading-tight mb-4">
          🔖 PROFIL & BRANDING
        </h2>
        <p className="text-[#000000] text-lg md:text-xl">
          Optimalkan{" "}
          <span className="text-[#BF5F5F] font-semibold">
            Personal Branding
          </span>{" "}
          dan Kembangkan Jaringan Profesional Anda!
        </p>
      </div>
      <Link to="/login">
        <img
          src={brandingImage}
          alt="Branding"
          className="w-[100px] rounded-xl cursor-pointer"
        />
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <div className="bg-[#D7D7D7] p-6 rounded-lg shadow-md flex flex-col items-center text-center">
        <h3 className="text-[#2B7A98] font-semibold text-2xl">
          🔹 Mengapa Personal Branding Penting?
        </h3>
        <ul className="text-[#525252] text-lg mt-4 space-y-3">
          <li>✔ Membantu membangun reputasi dan kepercayaan.</li>
          <li>✔ Memudahkan mendapatkan peluang kerja atau usaha.</li>
          <li>✔ Memberikan keunggulan kompetitif di dunia digital.</li>
          <li>✔ Memungkinkan individu lebih dikenal dalam komunitas.</li>
        </ul>
      </div>

      <div className="bg-[#D7D7D7] p-6 rounded-lg shadow-md flex flex-col items-center text-center">
        <h3 className="text-[#BF5F5F] font-semibold text-2xl">
          💡 Jadilah Wajah Baru di Era Digital!
        </h3>
        <p className="text-[#3E3E3E] text-lg mt-4">
          Temukan strategi terbaik untuk membangun identitas digital yang{" "}
          <span className="text-[#FF9999] font-bold">
            unik dan profesional!
          </span>
        </p>
        <img
          src={networkImage}
          alt="Networking"
          className="w-[300px] rounded-lg"
        />
      </div>
    </div>
  </section>
);

export default BrandingSection;
