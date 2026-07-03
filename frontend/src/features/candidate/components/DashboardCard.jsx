const DashboardCard = ({ title, value, description, accent }) => (
  <div className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover ${accent || ''}`}>
    <div className="relative z-10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</h3>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {description && <p className="mt-2 text-sm font-medium text-slate-500">{description}</p>}
    </div>
    {/* Decorative hover effect */}
    <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
  </div>
);

export default DashboardCard;