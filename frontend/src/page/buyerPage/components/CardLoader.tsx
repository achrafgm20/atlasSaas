const  CardLoader = () => (
  <div className="w-full max-w-md">
    <div className="bg-slate-200 rounded-xl p-6 border border-slate-100">
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-3 bg-slate-100 rounded w-1/3"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
        <div className="mt-4 h-48 bg-slate-100 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default CardLoader;