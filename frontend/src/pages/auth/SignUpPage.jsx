import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
import FloatingShape from "../../components/FloatingShape";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center">
      <FloatingShape
        color="bg-[#3FA3CE]" // Biru Muda
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#EF8B8B]" // Merah Muda Pastel
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#145C75]" // Biru Tua
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Bagian Kiri - Informasi */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <img
          className="mx-auto h-32 w-auto mb-6"
          src="/logopanjang1.png"
          alt="Kolaborasi Digital"
        />
        <h2 className="text-4xl font-extrabold">🤝 Kolaborasi & Inovasi</h2>
        <p className="mt-4 text-lg font-light text-[#000000]">
          Bangun koneksi, wujudkan ide, dan kembangkan komunitas digital dengan
          lebih mudah dan modern.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            className="h-full rounded-lg"
            src="/kolaborasi.png"
            alt="Kolaborasi"
          />
          <img className="h-full rounded-lg" src="/inovasi.png" alt="Inovasi" />
        </div>
      </div>

      {/* Bagian Kanan - Formulir Pendaftaran */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl">
        <h3 className="text-2xl font-semibold text-[#145C75] text-center mb-4">
          Daftar Sekarang
        </h3>
        <SignUpForm />

        <div className="mt-6 relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D7D7D7]"></div>
          </div>
          <div className="relative inline-block px-3 bg-white text-[#828282] text-sm">
            Sudah punya akun?
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-block py-3 px-6 text-lg font-medium text-white bg-gradient-to-r from-[#2B7A98] to-[#145C75] rounded-lg shadow-lg hover:shadow-xl hover:from-[#145C75] hover:to-[#2B7A98] transition-all duration-300"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
