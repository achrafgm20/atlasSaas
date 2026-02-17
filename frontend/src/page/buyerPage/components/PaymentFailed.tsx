
import { XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
    const navigate = useNavigate()
  const errorMessage = "Payment could not be processed";

  const handleRetry = () => {
    navigate('/Cart')
    // Add your retry payment logic here
  };



  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-8">
            {errorMessage}
          </p>
          
          
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
  
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No charges were made to your account
          </p>
        </div>
      </div>
    </div>
  );
}