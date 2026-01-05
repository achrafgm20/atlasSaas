import React from 'react';
import Header from '../Components/Header'; 
import Filter from '../Components/Filter';
import Allproducts from '../Components/Allproducts'; 
import Footer from '../Components/Footer';

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