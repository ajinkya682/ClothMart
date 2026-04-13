import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => (
  <main className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
    <div className="text-center max-w-md w-full bg-white rounded-[2rem] border border-gray-100 p-12 shadow-sm animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <span className="text-[12rem] font-black font-heading leading-none">404</span>
      </div>
      
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
        <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg mb-6">404 Error</div>
        <h1 className="text-4xl font-black font-heading text-gray-900 tracking-tight mb-4">Page not found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all group mx-auto">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </motion.div>
    </div>
  </main>
);

export default NotFound;
