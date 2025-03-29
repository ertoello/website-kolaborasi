import { CheckCircle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-600 p-4 rounded-xl shadow-2xl text-sm text-white mt-3">
      {/* Header */}
      <h2 className="text-center text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7cccef] to-[#EF8B8B]">
        ⚡ Syarat & Ketentuan Berkolaborasi
      </h2>

      {/* Isi Syarat & Ketentuan */}
      <ul className="mt-4 space-y-4 text-sm">
        <li className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Jujur & Transparan – Dilarang menyesatkan, mengklaim ide orang lain,
          atau menyebarkan informasi palsu.
        </li>
        <li className="flex items-   gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Kolaborasi, Bukan Kompetisi – Saling membantu, bukan menjatuhkan.
          Sukses bersama lebih baik!
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Jaga Etika & Kesopanan – Hindari kata-kata kasar, spam, atau tindakan
          merugikan.
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Keamanan adalah Prioritas – Jangan bagikan data pribadi atau informasi
          sensitif sembarangan.
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Admin Berhak Bertindak – Pelanggaran akan ditindak sesuai aturan,
          termasuk penghapusan akun.
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-400" />
          Dengan Bergabung, Anda Menyetujui Aturan Ini – Mari ciptakan ruang
          kerja yang positif & produktif!
        </li>
      </ul>
    </div>
  );
}
