import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import BottomNav from "../components/BottomNav/BottomNav";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background font-sans relative">
      <Navbar />
      <main className="flex-grow pt-[72px] pb-[72px] md:pb-0 w-full max-w-7xl mx-auto flex flex-col">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
