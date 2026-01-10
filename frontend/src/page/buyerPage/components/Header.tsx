
import React from 'react';
import { ShieldCheck, Diamond, Zap, Box, CheckCircle, Headphones } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex flex-col items-center justify-center text-center pt-10 pb-16 px-4 bg-[#e2edf7]">
     
      <h1 className="text-5xl font-black text-[#1e3a8a] mb-6 tracking-tight leading-tight">
        Your next high-tech device<br />
        <span className="text-[#94b4e4] text-4xl">without wasting a second</span>
      </h1>
      
      <p className="text-gray-400 text-xl font-medium mb-9">
        Verified phones & laptops from trusted sellers
      </p>

     
      <div className="flex gap-4 flex-wrap justify-center mb-20">
        <Badge icon={<ShieldCheck className="text-red-500" size={20} />} text="Quality Guaranteed" />
        <Badge icon={<Diamond className="text-blue-400" size={20} />} text="Best Prices" />
        <Badge icon={<Zap className="text-yellow-500" size={20} />} text="Instant Support" />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        <StatCard 
          icon={<Box size={28} className="text-white" />} 
          iconBg="bg-gradient-to-br from-blue-400 to-blue-700"
          number="2,500+" 
          title="Active Products" 
          desc="Updated daily with new arrivals" 
        />
        <StatCard 
          icon={<CheckCircle size={28} className="text-white" />} 
          iconBg="bg-gradient-to-br from-emerald-400 to-emerald-600"
          number="100%" 
          title="Quality Verified" 
          desc="Every device thoroughly tested" 
        />
        <StatCard 
          icon={<Headphones size={28} className="text-white" />} 
          iconBg="bg-gradient-to-br from-blue-500 to-blue-800"
          number="24/7" 
          title="Customer Support" 
          desc="We're always here to help you" 
        />
      </div>
    </header>
  );
};

interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}

const Badge = ({ icon, text }: BadgeProps) => (
  <div className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-2.5 rounded-full shadow-xl hover:shadow-xl transition-all hover:scale-105 duration-300">
    {icon}
    <span className="text-sm font-bold text-gray-700">{text}</span>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  number: string;
  title: string;
  desc: string;
}

const StatCard = ({ icon, iconBg, number, title, desc }: StatCardProps) => (
  <div className="bg-white p-10   rounded-[32px] shadow-sm border border-gray-50 w-auto h-auto flex flex-col items-center transition-all hover:scale-105 hover:shadow-xl duration-300">
    <div className={`${iconBg} p-4 rounded-full mb-6 shadow-lg shadow-blue-100`}>
      {icon}
    </div>
    <h3 className="text-4xl font-black text-slate-800 mb-1">{number}</h3>
    <p className="font-bold text-slate-700 mb-2">{title}</p>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Header;