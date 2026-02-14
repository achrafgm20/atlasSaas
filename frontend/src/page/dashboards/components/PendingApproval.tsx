import { AlertCircle, Clock, Shield, X } from "lucide-react";

interface PendingApprovalProps {
  onClose: () => void;
}

export default function PendingApproval({ onClose }: PendingApprovalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center justify-center">
          <div className="bg-yellow-100 rounded-full p-3">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Account Pending Approval
          </h2>
          <p className="text-gray-600">
            Your seller account is currently under review by our admin team.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-blue-900 mb-1">What's happening?</p>
              <p>Our admin team is verifying your account details to ensure platform security and quality.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-blue-900 mb-1">What can you do?</p>
              <p>Please wait for admin approval. You'll be notified via email once your account is approved.</p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          This usually takes 24-48 hours
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}