const AuthCard = ({ title, subtitle, children }) => (
  <div className="mx-auto w-full max-w-md animate-fade-in rounded-2xl border border-slate-100 bg-white p-8 sm:p-10 shadow-card transition-all duration-300 hover:shadow-card-hover">
    <div className="mb-8 space-y-2 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="text-sm font-medium text-slate-500">{subtitle}</p>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

export default AuthCard;