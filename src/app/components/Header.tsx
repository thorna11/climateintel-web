import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/demo', label: 'Demo' },
    { path: '/methodology', label: 'Methodology' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl text-foreground">ClimateIntel</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              Contact Us
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}