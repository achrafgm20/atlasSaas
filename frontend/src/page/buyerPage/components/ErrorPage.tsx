import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        
        {/* SVG Illustration */}
        <svg
          className="mx-auto mb-6"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 9h.01M15 9h.01M8 15c1.333-1 2.667-1 4 0s2.667 1 4 0" />
        </svg>

        <h1 className="text-4xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
