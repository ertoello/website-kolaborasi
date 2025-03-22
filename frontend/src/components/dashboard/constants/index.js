import { people01, people02, people03, facebook, instagram, linkedin, twitter, binance, coinbase, dropbox} from "../../../assets";
import {
  FaUsers,
  FaLightbulb,
  FaBusinessTime,
  FaLaptopCode,
} from "react-icons/fa";

export const navLinks = [
  {
    id: "BERANDA",
    title: "BERANDA",
  },
  {
    id: "KOLABORASI & INOVASI",
    title: "KOLABORASI & INOVASI",
  },
  {
    id: "DASHBOARD INTERAKTIF",
    title: "DASHBOARD INTERAKTIF",
  },
  {
    id: "KOMUNIKASI CEPAT & INTERAKTIF",
    title: "KOMUNIKASI CEPAT & INTERAKTIF",
  },
  {
    id: "PROFIL & BRANDING",
    title: "PROFIL & BRANDING",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: FaUsers,
    title: "Koneksi Antar Masyarakat",
    content:
      "Bangun komunitas digital yang aktif dan saling berbagi inspirasi.",
  },
  {
    id: "feature-2",
    icon: FaLightbulb,
    title: "Inovasi Berkelanjutan",
    content: "Ciptakan solusi berbasis teknologi untuk memajukan desa.",
  },
  {
    id: "feature-3",
    icon: FaBusinessTime,
    title: "Dukungan Usaha Lokal",
    content: "Kembangkan bisnis berbasis digital dengan kolaborasi inovatif.",
  },
  {
    id: "feature-4",
    icon: FaLaptopCode,
    title: "Transformasi Digital",
    content: "Terapkan teknologi untuk kemajuan desa dan komunitas.",
  },
];

export const footerLinks = [
  {
    title: "NAVIGASI",
    links: [
      {
        name: "Beranda",
        id: "BERANDA", // Benar (mengacu pada ID di HTML)
      },
      {
        name: "Kolaborasi & Inovasi",
        id: "KOLABORASI & INOVASI", // Perbaikan: spasi diubah menjadi "-" atau "_"
      },
      {
        name: "Dashboard Interaktif",
        id: "DASHBOARD INTERAKTIF", // Ditambahkan "#" agar bisa dipakai untuk navigasi internal
      },
      {
        name: "Komunikasi Cepat & Interaktif",
        id: "KOMUNIKASI CEPAT & INTERAKTIF", // Ditambahkan "#" dan spasi diganti "-"
      },
      {
        name: "Profil & Branding",
        id: "PROFIL & BRANDING", // Ditambahkan "#" agar bisa digunakan untuk scroll
      },
    ],
  },
  {
    title: "Komunitas BeoPoeng",
    links: [
      {
        name: "Pusat Bantuan",
        link: "https://www.beopoeng.com/help-center/",
      },
      {
        name: "Mitra BeoPoeng",
        link: "https://www.beopoeng.com/partners/",
      },
      {
        name: "Saran & Masukan",
        link: "https://www.beopoeng.com/suggestions/",
      },
      {
        name: "Artikel & Blog",
        link: "https://www.beopoeng.com/blog/",
      },
      {
        name: "Berlangganan Info",
        link: "https://www.beopoeng.com/newsletters/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];
