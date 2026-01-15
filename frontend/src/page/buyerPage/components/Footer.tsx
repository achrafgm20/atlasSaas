

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#d2e2f3] border-t border-gray-100 pt-10 pb-6 px-6 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        <div className="flex-1 max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">AtlasTech</h2>
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-70">
            Your trusted marketplace for premium smartphones and laptops.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-2">
          
          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Phones</a></li>
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Laptops</a></li>
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Deals</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Shipping</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-gray-900 font-semibold mb-5">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-500  hover:text-blue-900 transition-colors">Terms</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} AtlasTech. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;