import { motion } from "framer-motion";
import {
  Billing,
  Business,
  CardDeal,
  Navbar,
  Testimonials,
  Hero,
} from "../components/dashboard";
import FloatingShape from "../components/FloatingShape";

const DashboardPage = () => (
  <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
    {/* Elemen dekoratif */}
    <FloatingShape color="bg-[#3FA3CE]" size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingShape color="bg-[#EF8B8B]" size="w-48 h-48" top="70%" left="80%" delay={5} />
    <FloatingShape color="bg-[#145C75]" size="w-32 h-32" top="40%" left="-10%" delay={2} />
    
    {/* Kontainer utama */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-8  w-full max-w-6xl flex flex-col"
    >
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <div className="mt-6">
        <Hero />
      </div>
      
      {/* Konten Utama */}
      <div className="mt-6 space-y-6">
        <Business />
        <Billing />
        <CardDeal />
        <Testimonials />
      </div>
    </motion.div>
  </div>
);

export default DashboardPage;
