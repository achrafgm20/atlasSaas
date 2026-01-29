
import { XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
    const navigate = useNavigate()
  const errorMessage = "Payment could not be processed";

  const handleRetry = () => {
    navigate('/Cart')
    // Add your retry payment logic here
  };

//   const handleContactSupport = () => {
//     console.log('Contact support clicked');
//     // Add your support contact logic here
//   };

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
          
          {/* <div className="bg-red-50 rounded-lg p-6 mb-8 border border-red-100">
            <h3 className="font-semibold text-gray-900 mb-3">Common Issues:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Payment declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>Network or connection issues</span>
              </li>
            </ul>
          </div> */}
          
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            {/* <button
              onClick={handleContactSupport}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 transition-colors"
            >
              Contact Support
            </button> */}
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            No charges were made to your account
          </p>
        </div>
      </div>
    </div>
  );
}