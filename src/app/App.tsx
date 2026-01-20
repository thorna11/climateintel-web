import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Home } from '@/app/pages/Home';
import { Products } from '@/app/pages/Products';
import { ProductDetail } from '@/app/pages/ProductDetail';
import Demo from '@/app/pages/Demo';
import { Methodology } from '@/app/pages/Methodology';
import { About } from '@/app/pages/About';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}
