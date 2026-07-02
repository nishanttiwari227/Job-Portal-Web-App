const AuthCard = ({ title, subtitle, children }) => (
  <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
    <div className="mb-8 space-y-3 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

export default AuthCard;
