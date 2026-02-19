import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, ArrowRight, Home } from "lucide-react";

function PaymentResult() {
  // Mock params and navigate for demo
  const orderId = "ORD-1001";
  const navigate = (path: string) => console.log("Navigate to:", path);
  
  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading");

  useEffect(() => {
    const checkPayment = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Mock response - change to "failed" to test error state
        setStatus("failed");
      } catch (err: any) {
        console.log(err)
        setStatus("failed");
      }
    };
    checkPayment();
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="w-20 h-20 text-blue-600 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Processing Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <CheckCircle className="w-24 h-24 text-blue-600 mx-auto relative animate-scale-in" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            Your order has been confirmed
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Order ID: <span className="font-mono font-semibold text-gray-700">{orderId}</span>
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              View Order Details
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to your inbox
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <XCircle className="w-24 h-24 text-blue-600 mx-auto relative animate-shake" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Payment
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-2">
            Common issues:
          </p>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• Insufficient funds</li>
            <li>• Invalid card details</li>
            <li>• Network connection error</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaymentResult;