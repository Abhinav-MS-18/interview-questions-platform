const StatCard = ({ icon, label, value, color = 'indigo', subtitle }) => {
    const colorMap = {
        indigo: 'from-indigo-500 to-indigo-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
        cyan: 'from-cyan-500 to-cyan-600',
    };
    const gradient = colorMap[color] || colorMap.indigo;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
                    {icon}
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value ?? '—'}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
    );
};

export default StatCard;
