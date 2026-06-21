export function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ message }) {
  return (
    <div className="rounded-2xl bg-white py-16 text-center text-gray-400 shadow-sm">{message}</div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none text-gray-400 hover:text-navy-900">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
