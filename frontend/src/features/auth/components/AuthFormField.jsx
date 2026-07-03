const AuthFormField = ({ label, error, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
    {error && (
      <span className="mt-0.5 text-xs font-medium text-red-500 animate-fade-in">
        {error}
      </span>
    )}
  </label>
);

export default AuthFormField;