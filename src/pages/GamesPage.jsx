import Footer from "../components/Footer";
import Games from "../components/Games";
import NavBar from "../components/Navbar";

const GamesPage = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <NavBar />
      <Games />
      <Footer />
    </main>
  );
};

export default GamesPage;
