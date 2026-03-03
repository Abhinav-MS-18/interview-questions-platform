const LoadingSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="skeleton h-6 w-28 rounded-lg" />
                            <div className="skeleton h-4 w-20 rounded" />
                        </div>
                        <div className="skeleton h-6 w-16 rounded-full" />
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-5/6 rounded" />
                        <div className="skeleton h-4 w-4/6 rounded" />
                    </div>
                    <div className="flex gap-2">
                        <div className="skeleton h-5 w-14 rounded-md" />
                        <div className="skeleton h-5 w-20 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
