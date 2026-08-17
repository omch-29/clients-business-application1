export default function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-amber-700" />
    </div>
  );
}
