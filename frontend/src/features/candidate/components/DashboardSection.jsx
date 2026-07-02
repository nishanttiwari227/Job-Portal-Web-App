const DashboardSection = ({ title, children }) => (
  <section className="space-y-4">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    </div>
    {children}
  </section>
);

export default DashboardSection;
