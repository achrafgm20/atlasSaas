import React from 'react';

const CommentUI = () => {
  // Mock data for UI demonstration
  const comments = [
    { id: 1, author: "Alex Johnson", time: "2 hours ago", message: "The quality of this product is amazing! Definitely worth the price." },
    { id: 2, author: "Sarah Smith", time: "5 hours ago", message: "Fast shipping and great customer support. Highly recommended!" },
  ];

  return (
    <div className="max-w-2xl mx-auto  bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          Comments <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h3>
      </div>

      {/* Comment List */}
      <div className="p-6 space-y-6 max-h-100overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0">
              {c.author.charAt(0)}
            </div>
            
            {/* Bubble */}
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{c.author}</h4>
                <span className="text-xs text-gray-400">{c.time}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {c.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div> {/* User Avatar Placeholder */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-gray-100 border-none rounded-full py-2 px-5 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentUI;