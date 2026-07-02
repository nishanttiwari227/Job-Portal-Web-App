const DashboardCard = ({ title, value, description, accent }) => (
  <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${accent || 'border-slate-200'}`}>
    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</h3>
    <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
  </div>
);

export default DashboardCard;
