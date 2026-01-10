
import Header from '../components/Header'; 
import Filter from '../components/Filter';
import Allproducts from '../components/Allproducts'; 
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div>
      <Header />
      <Filter />
      <Allproducts />
      <Footer />
    </div>
  );
}