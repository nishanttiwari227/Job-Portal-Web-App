const AuthFormField = ({ label, error, children }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </label>
);

export default AuthFormField;
