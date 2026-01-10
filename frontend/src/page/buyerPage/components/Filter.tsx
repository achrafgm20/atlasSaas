import  { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, RotateCcw, Check } from 'lucide-react';

const Filter = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [selectedFilters, setSelectedFilters] = useState({
    Brand: 'All Brands',
    Model: 'All Models',
    Grade: 'All Grades',
    Storage: 'All Storage',
    Color: 'All Colors'
  });

  const filterOptions = {
    Brand: [
      { name: 'All Brands', icon: null },
      { name: 'Apple', icon: '🍎' },
      { name: 'Samsung', icon: '📱' },
      { name: 'Google', icon: '🔍' },
      { name: 'Dell', icon: '💻' },
      { name: 'HP', icon: '🖥️' },
      { name: 'Lenovo', icon: '💼' },
    ],
    Model: ['All Models', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'Samsung S24', 'Pixel 8'],
    Grade: [
      { name: 'All Grades', icon: null },
      { name: 'Grade A+', icon: '⭐⭐⭐' },
      { name: 'Grade A', icon: '⭐⭐' },
      { name: 'Grade B', icon: '⭐' },
      { name: 'Grade C', icon: null },
    ],
    Storage: ['All Storage', '64GB', '128GB', '256GB', '512GB', '1TB'],
    Color: [
      { name: 'All Colors', color: null },
      { name: 'Black', color: '#333' },
      { name: 'White', color: '#fff', border: true },
      { name: 'Blue', color: '#007bff' },
      { name: 'Silver', color: '#c0c0c0' },
      { name: 'Gold', color: '#ffd700' },
      { name: 'Pink', color: '#ffc0cb' },
      { name: 'Purple', color: '#a020f0' },
    ]
  };

  const handleReset = () => {
    setSelectedFilters({
      Brand: 'All Brands',
      Model: 'All Models',
      Grade: 'All Grades',
      Storage: 'All Storage',
      Color: 'All Colors'
    });
    setActiveCategory('all');
    setActiveMenu(null);
  };

  const selectOption = (category, value) => {
    setSelectedFilters(prev => ({ ...prev, [category]: value }));
    setActiveMenu(null);
  };

  const getCategoryClass = (category) => {
    const isActive = activeCategory === category;
    return `px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
      isActive 
        ? "bg-white text-blue-600 shadow-sm" 
        : "text-gray-500 hover:text-gray-700"
    }`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
    
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all border ${
            showFilters ? "bg-[#2B59C3] text-white" : "bg-white border-blue-600 text-blue-600"
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2">
          
         
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveCategory('all')} 
              className={getCategoryClass('all')}
            >
              All
            </button>
            <button 
              onClick={() => setActiveCategory('phones')} 
              className={getCategoryClass('phones')}
            >
              <span>📱</span> Phones
            </button>
            <button 
              onClick={() => setActiveCategory('laptops')} 
              className={getCategoryClass('laptops')}
            >
              <span>💻</span> Laptops
            </button>
          </div>

          <div className="h-8 w-[1px] bg-gray-300 mx-2 hidden md:block"></div>

          <div className="flex flex-wrap gap-3 relative">
            {Object.keys(filterOptions).map((key) => (
              <div key={key} className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
                    activeMenu === key ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 bg-white"
                  }`}
                >
                  <span className={selectedFilters[key].includes('All') ? "text-gray-700" : "text-blue-600"}>
                    {selectedFilters[key]}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${activeMenu === key ? "rotate-180" : ""}`} />
                </button>

                {activeMenu === key && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 max-h-64 overflow-y-auto">
                    {filterOptions[key].map((option) => {
                      const optionName = typeof option === 'string' ? option : option.name;
                      const isSelected = selectedFilters[key] === optionName;
                      
                      return (
                        <button
                          key={optionName}
                          onClick={() => selectOption(key, optionName)}
                          className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {option.icon && <span>{option.icon}</span>}
                            {option.color && (
                              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: option.color }} />
                            )}
                            <span className={isSelected ? "font-bold text-blue-600" : "text-gray-700"}>
                              {optionName}
                            </span>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;