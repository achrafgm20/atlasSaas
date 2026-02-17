
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const navigate = useNavigate()
//   const orderNumber = "ORD-2024-1234";
//   const amount = "$99.99";

  const handleContinue = () => {
    navigate('/')
    console.log('Continue shopping clicked');
    // Add your navigation logic here
  };

  const handleDownloadReceipt = () => {
    navigate('/Order')
    console.log('Check the Order');
    
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your payment has been processed successfully
          </p>
          
        
          
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleDownloadReceipt}
              className="w-full cursor-pointer bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition-colors"
            >
              Check the Order
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Thank you for shopping with us! 
          </p>
        </div>
      </div>
    </div>
  );
}